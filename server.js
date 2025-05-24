const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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
        u.name,
        u.avatar,
        u.gender,
        d.expertise,
        d.YoE,
        da.status,
        da.date_start,
        da.date_end
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
      SELECT * FROM consultant_request
      WHERE patient_id = ? AND doctor_id = ? AND status = 'Complete'
    `;

    const [consultants] = await db.query(query, [patient_id, doctor_id]);

    return res.status(200).json({ message: "Get consultants success", consultants });
  } catch (error) {
    console.log("Error fetching made consultants", error)
    return res.status(500).json({ message: "Error fetching made consultants" });
  }
})

app.post('/submit_consultant', async (req, res) => {
  const { patient_id, doctor_id, selectedDate, message, subject } = req.body;

  try {
    const query = `
      INSERT INTO consultant_request (doctor_id, patient_id, date, message, subject) VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [doctor_id, patient_id, selectedDate, message, subject]);

    return res.status(200).json({ message: "Submit consultant success" });
  } catch (error) {
    console.log("Error while submitting consultant", error)
    return res.status(500).json({ message: "Error while submitting consultant" });
  }
})

app.get('/get_health_status_by_patient_id/:patient_id', async (req, res) => {
  const { patient_id } = req.params;

  if (!patient_id) return res.status(400).json({ error: 'Missing patient_id' });

  try {
    const [rows] = await db.execute(`
      SELECT * FROM health_status 
      WHERE patient_id = ?
      ORDER BY recorded_at DESC
    `, [patient_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No health records found for this patient' });
    }

    res.json(rows);
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
        cr.date, 
        u.name AS doctor_name, 
        cr.subject, 
        cr.status
      FROM consultant_request cr
      JOIN doctors d ON cr.doctor_id = d.doctor_id
      JOIN users u ON d.doctor_id = u.user_id
      WHERE cr.patient_id = ?
      ORDER BY cr.date DESC
    `;

    const [consultants] = await db.query(query, [patient_id]);

    return res.status(200).json({
      message: "Fetched consultant requests successfully",
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
      SELECT DISTINCT 
        u.user_id AS patient_id,
        u.name AS full_name,
        u.email,
        u.gender,
        u.avatar
      FROM consultant_request cr
      JOIN patients p ON cr.patient_id = p.patient_id
      JOIN users u ON p.patient_id = u.user_id
      WHERE cr.doctor_id = ?
    `;

    const [patients] = await db.query(query, [doctor_id]);

    return res.status(200).json({
      message: "Fetched patients successfully",
      patients
    });
  } catch (error) {
    console.error("Error fetching patients by doctor_id", error);
    return res.status(500).json({ message: "Server error while fetching patients" });
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