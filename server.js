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
      await db.execute(
        `INSERT INTO doctors (doctor_id, max_patient, isAvailable)
         VALUES (?, ?, ?)`,
        [userId, maxPatient, true]
      );
    }

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
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