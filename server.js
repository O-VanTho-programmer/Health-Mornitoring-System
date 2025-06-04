const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.post('/sign_up', async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    gender,
    userType,
    height,
    weight,
    DOB,
    maxPatient,
    expertise,
    YoE
  } = req.body;

  try {
    // Mã hóa mật khẩu
    

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!['patient', 'doctor'].includes(userType.trim().toLowerCase())) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Chèn vào bảng users
    const [userResult] = await db.query(
      `INSERT INTO users (name, email, password, role, dob, gender)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, userType, DOB, gender]
    );

    const userId = userResult.insertId;
    /*patient*/
    if (userType === "patient") {
      const [patientResult] = await db.query(
        `INSERT INTO patients (patient_id)
         VALUES (?)`,
        [userId]
      );

      const patientID = patientResult.insertId;

      await db.query(
        `INSERT INTO health_status(patient_id, height, weight)
         VALUES (?, ?, ?)`,
        [patientID, height, weight]
      )
    }
    /*doctor*/
    else if (userType === "doctor") {

      await db.query(
        `INSERT INTO doctors (doctor_id, max_patient, isAvailable, YoE, expertise)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, maxPatient, true, YoE, expertise]
      );
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ message: "Error when sign up", error });
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const queryUser = 'SELECT * FROM users WHERE email = ?';
    const [userResult] = await db.query(queryUser, [email]);

    if (userResult.length === 0) {
      console.log("Email doesn't exist")
      return res.status(401).json({ message: "Email doesn't exist" });
    }

    const user = userResult[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password is incorrect")
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user.user_id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      "dasdnoo-aCVXd_vcS-jgasdvs",
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
})

app.post('/logout', async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
})

app.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, 'dasdnoo-aCVXd_vcS-jgasdvs');
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// 
app.get('/get_doctors', async (req, res) => {
  try {
    const query = `
      SELECT doctor_id, isAvailable, max_patient, expertise, YoE, u.name, u.role, u.avatar, u.gender, u.dob FROM doctors
      JOIN users u ON u.user_id = doctor_id    
    `;

    const [doctors] = await db.query(query);
    return res.status(200).json({ message: "Get success", doctors });
  } catch (error) {
    console.log("Error fetching doctor data", error)
    return res.status(500).json({ message: "Error fetching doctor data" });
  }
})

app.get('/get_doctor_by_patient_id/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;

    const query = `
      SELECT 
        da.doctor_id,
        u.name as doctor_name,
        u.avatar,
        u.gender,
        u.email,
        u.role,
        d.expertise,
        d.YoE,
        da.status,
        DATE_FORMAT(da.date_start, '%d/%m/%Y') AS date_start,
        DATE_FORMAT(da.date_end, '%d/%m/%Y') AS date_end
      FROM doctor_assignment da
      JOIN doctors d ON d.doctor_id = da.doctor_id
      JOIN users u ON u.user_id = d.doctor_id
      WHERE da.patient_id = ?
        AND da.status = 'Active'
      ORDER BY da.date_start DESC
      LIMIT 1
    `;

    const [rows] = await db.query(query, [patient_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active doctor assignment found for this patient' });
    }
    return res.status(200).json({ doctor: rows[0] });
  } catch (error) {
    console.log("Error get doctor from patient ID", error);
    return res.status(500).json({ message: "Error getting doctor by patient ID" });
  }
});


//get_all_patients
app.get('/get_all_patients', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT patient_id AS id, full_name AS name, dob, 
             TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, gender 
      FROM patients
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.get('/get_made_consultants_patient_doctor/:patient_id/:doctor_id', async (req, res) => {
  const { patient_id, doctor_id } = req.params;

  try {
    const query = `
      SELECT 
        cr.request_id,
        DATE_FORMAT(cr.date, '%d/%m/%Y') AS date,
        cr.subject,
        cr.status,
        cr.message,
        cr.price,
        cr.sender_id,
        u.name AS doctor_name
      FROM consultant_request cr
      JOIN users u ON 
        (cr.sender_id = u.user_id AND cr.receiver_role = 'patient') OR 
        (cr.receiver_id = u.user_id AND cr.sender_role = 'patient')
      WHERE 
        (cr.sender_id = ? AND cr.receiver_id = ?)
        OR 
        (cr.sender_id = ? AND cr.receiver_id = ?)
      ORDER BY cr.date_create DESC
    `;

    const [consultants] = await db.query(query, [patient_id, doctor_id, doctor_id, patient_id]);

    return res.status(200).json({ message: "Fetched consultants success", consultants });
  } catch (error) {
    console.log("Error fetching made consultants", error)
    return res.status(500).json({ message: "Error fetching made consultants" });
  }
})

app.get('/get_made_consultants_by_doctor_id/:doctor_id', async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const query = `
      SELECT 
        cr.request_id,
        DATE_FORMAT(cr.date, '%d/%m/%Y') AS date,
        u.name AS patient_name,
        cr.subject,
        cr.status,
        cr.message,
        cr.price,
        cr.sender_id
      FROM consultant_request cr
      JOIN users u ON 
        (cr.sender_id = ? AND cr.receiver_id = u.user_id) OR 
        (cr.receiver_id = ? AND cr.sender_id = u.user_id)
      WHERE 
        (cr.sender_id = ? OR cr.receiver_id = ?) 
      ORDER BY cr.date_create DESC
    `;

    const [consultants] = await db.query(query, [doctor_id, doctor_id, doctor_id, doctor_id]);

    return res.status(200).json({
      message: "Fetched made consultants successfully",
      consultants
    });
  } catch (error) {
    console.error("Error fetching made consultants", error);
    return res.status(500).json({ message: "Server error while fetching made consultants" });
  }
});


app.get('/get_consultant_requests_by_doctor_id/:doctor_id', async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const query = `
      SELECT 
        cr.request_id,
        DATE_FORMAT(cr.date, '%d/%m/%Y') AS date,
        u.name AS patient_name,
        cr.subject,
        cr.message
      FROM consultant_request cr
      JOIN users u ON cr.sender_id = u.user_id
      WHERE cr.receiver_id = ? AND cr.receiver_role = 'doctor' AND cr.status = 'Pending'
      ORDER BY cr.date_create DESC
    `;

    const [requests] = await db.query(query, [doctor_id]);

    return res.status(200).json({
      message: "Fetched consultant requests successfully",
      requests
    });
  } catch (error) {
    console.error("Error fetching consultant requests", error);
    return res.status(500).json({ message: "Server error while fetching consultant requests" });
  }
});

app.get('/get_consultant_request_to_patient/:patient_id', async (req, res) => {
  const { patient_id } = req.params;

  try {
    const query = `
      SELECT 
        cr.request_id,
        DATE_FORMAT(cr.date, '%d/%m/%Y') AS date,
        u.name AS doctor_name,
        cr.subject,
        cr.status,
        cr.message,
        cr.price,
        cr.sender_id
      FROM consultant_request cr
      JOIN users u ON 
        (cr.sender_role = 'doctor' AND cr.sender_id = u.user_id)
      WHERE 
        (cr.receiver_id = ? AND cr.receiver_role = 'patient')
      ORDER BY cr.date_create DESC
    `;

    const [requests] = await db.query(query, [patient_id]);

    return res.status(200).json({
      message: "Fetched consultant requests for patient successfully",
      requests
    });
  } catch (error) {
    console.error("Error fetching consultant requests for patient", error);
    return res.status(500).json({ message: "Error fetching consultant requests for patient" });
  }
});

app.post('/accept_consultant', async (req, res) => {
  const { request_id, price } = req.body;
  await db.query(
    `UPDATE consultant_request SET status = 'Accepted (UnPaid)', price = ? WHERE request_id = ?`,
    [price, request_id]
  );
  res.send({ message: 'Consultant accepted' });
});

app.post('/reject_consultant', async (req, res) => {
  const { request_id } = req.body;
  await db.query(
    `UPDATE consultant_request SET status = 'Rejected' WHERE request_id = ?`,
    [request_id]
  );
  res.send({ message: 'Consultant rejected' });
});


app.post('/submit_consultant', async (req, res) => {
  const { sender_id, receiver_id, sender_role, receiver_role, selectedDate, message, subject, price } = req.body;

  try {
    const query = `
      INSERT INTO consultant_request (sender_id, receiver_id, sender_role, receiver_role, date, subject, message, status, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
    `;
    await db.query(query, [sender_id, receiver_id, sender_role, receiver_role, selectedDate, subject, message, price]);

    return res.status(200).json({ message: "Consultant request submitted successfully" });
  } catch (error) {
    console.error("Error submitting consultant:", error);
    return res.status(500).json({ message: "Server error while submitting consultant" });
  }
});

app.post('/remove_consultant', async (req, res) => {
  const { request_id } = req.body;

  try {
    const query = `
      DELETE FROM consultant_request WHERE request_id = ?
    `;

    await db.query(query, [request_id]);
    return res.status(200).json({ message: "Consultant request removed successfully" });
  } catch (error) {
    console.error("Error removing consultant request:", error);
    return res.status(500).json({ message: "Server error while removing consultant request" });
  }
});

app.get('/get_health_status_by_patient_id/:patient_id/', async (req, res) => {
  const { patient_id } = req.params;

  if (!patient_id) return res.status(400).json({ error: 'Missing patient_id' });

  try {
    const [rows] = await db.query(`
      SELECT 
        u.name,
        u.avatar, 
        u.gender, 
        u.role,
        u.email,
        DATE_FORMAT(u.dob, '%d/%m/%Y') AS dob,
        DATE_FORMAT(da.date_start, '%d/%m/%Y') AS date_start,
        p.age, 
        hs.height, 
        hs.weight, 
        hs.temperature, 
        hs.blood_pressure, 
        hs.heart_rate 
      FROM users u
      JOIN health_status hs ON u.user_id = hs.patient_id
      JOIN patients p ON u.user_id = p.patient_id
      JOIN doctor_assignment da ON da.patient_id = p.patient_id AND da.status = "Active"
      WHERE u.user_id = ?
      ORDER BY hs.recorded_at DESC
      LIMIT 1
    `, [patient_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No health records found for this patient' });
    }

    res.status(200).json({ patient: rows[0] });
  } catch (err) {
    console.error('Error fetching health status:', err);
    res.status(500).json({ error: 'Failed to fetch health status' });
  }
});

app.get('/get_made_consultants_patient_side/:patient_id', async (req, res) => {
  const { patient_id } = req.params;

  try {
    const query = `
      SELECT 
        cr.request_id,
        DATE_FORMAT(cr.date, '%d/%m/%Y') AS date, 
        u.name AS doctor_name, 
        cr.subject, 
        cr.status,
        cr.message,
        cr.price,
        cr.sender_id
      FROM consultant_request cr
      JOIN users u ON 
        (cr.sender_role = 'doctor' AND cr.sender_id = u.user_id) OR
        (cr.receiver_role = 'doctor' AND cr.receiver_id = u.user_id)
      WHERE 
        (cr.sender_id = ? AND cr.sender_role = 'patient') OR 
        (cr.receiver_id = ? AND cr.receiver_role = 'patient')
      ORDER BY cr.date_create DESC
    `;

    const [consultants] = await db.query(query, [patient_id, patient_id]);

    return res.status(200).json({
      message: "Fetched consultant requests for patient successfully",
      consultants
    });
  } catch (error) {
    console.error("Error fetching consultant requests", error);
    return res.status(500).json({ message: "Server error while fetching consultant requests" });
  }
});


app.get('/get_patients_by_doctor_id/:doctor_id', async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const query = `
      SELECT 
        u.user_id AS id,
        u.name AS full_name,
        p.age,
        u.gender,
        u.avatar,
        DATE_FORMAT(u.dob, '%d/%m/%Y') AS dob,
        DATE_FORMAT(da.date_start, '%d/%m/%Y') AS date_start,
        da.status
      FROM doctor_assignment da
      JOIN patients p ON da.patient_id = p.patient_id
      JOIN users u ON p.patient_id = u.user_id
      WHERE da.doctor_id = ?
    `;

    const [patients] = await db.query(query, [doctor_id]);

    return res.status(200).json({
      message: "Fetched assigned patients successfully",
      patients
    });
  } catch (error) {
    console.error("Error fetching assigned patients", error);
    return res.status(500).json({ message: "Server error while fetching assigned patients" });
  }
});

// Payment
app.post("/pay_consultant", async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      request_id,
      patient_name,
      doctor_name,
      service,
      date,
      price,
      payment_method,
      card_number = "",
      card_holder = "",
      expiry = "",
      cvc = "",
    } = req.body;

    const query = `
      UPDATE consultant_request
      SET status = 'Accepted'
      WHERE request_id = ?
    `

    await db.query(query, [request_id]);

    const row = {
      "Patient ID": patient_id,
      "Doctor ID": doctor_id,
      "Request ID": request_id,
      "Patient Name": patient_name,
      "Doctor Name": doctor_name,
      "Service": service,
      "Date": date,
      "Price": price,
      "Payment Method": payment_method,
      "Card Number": payment_method === "card" ? card_number : "",
      "Card Holder": payment_method === "card" ? card_holder : "",
      "Expiry": payment_method === "card" ? expiry : "",
      "CVC": payment_method === "card" ? cvc : "",
      "Created At": new Date().toLocaleString(),
    };

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet([row]);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Payments");

    const fileName = `payment_${Date.now()}.xlsx`;
    const dir = path.join(__dirname, "exports");
    const filePath = path.join(dir, fileName);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    xlsx.writeFile(workbook, filePath);

    return res.status(200).json({
      message: "Payment recorded successfully",
      file: `/payment_records/${fileName}`,
    });
  } catch (err) {
    console.error("Error in /pay_consultant:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});




const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MySql@VanTho0948',
  database: 'health_mornitoring_system',
}).promise();

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing the database connection: ' + err.stack);
    } else {
      console.log('Database connection closed');
    }
    process.exit();
  });
});

module.exports = db;