const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors());
app.use(express.json());


app.post('/sign_up', async (req, res) => {
  const { name, email, password, confirmPassword, userType, height, weight, DOB, maxPatient, gender } = req.body;

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Chèn vào bảng users
    const [userResult] = await db.execute(
      `INSERT INTO users (name, email, password, role, dob, gender)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, userType, DOB, gender]
    );

    const userId = userResult.insertId;
    /*patient*/
    if (userType === 'PATIENT') {
      await db.execute(
        `INSERT INTO patients (patient_id, height, weight)
         VALUES (?, ?, ?)`,
        [userId, height, weight]
      );
    } 
    /*doctor*/
    else if (userType === 'DOCTOR') {
<<<<<<< Updated upstream
      await db.execute(
        `INSERT INTO doctors (doctor_id, max_patient, isAvailable)
         VALUES (?, ?, ?)`,
        [userId, maxPatient, true]
=======
      const { maxPatient, YoE, expertise } = req.body;
    
      await db.execute(
        `INSERT INTO doctors (doctor_id, max_patient, isAvailable, YoE, expertise)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, maxPatient, true, YoE, expertise]
>>>>>>> Stashed changes
      );
    }

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

<<<<<<< Updated upstream





=======
//get_all_patients
app.get('/get_all_patients', async (req, res) => {
  try {
    const [rows] = await db.execute(`
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


//get_health_status_by_patient_id?id=P123
app.get('/get_health_status_by_patient_id', async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing patient_id' });

  try {
    const [rows] = await db.execute(`
      SELECT * FROM health_status 
      WHERE patient_id = ?
      ORDER BY recorded_at DESC
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No health records found for this patient' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching health status:', err);
    res.status(500).json({ error: 'Failed to fetch health status' });
  }
});

//get_made_consultants_patient_side
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


//get_patients_by_doctor_id/:doctor_id
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


>>>>>>> Stashed changes






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