const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors());
app.use(express.json());


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

    console.log(user)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password is incorrect")
      return res.status(401).json({ message: "Password is incorrect" });
    }


    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "dasdnoo-aCVXd_vcS-jgasdvs",
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
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