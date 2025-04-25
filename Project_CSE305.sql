CREATE DATABASE project;
USE project;

-- Bảng users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('doctor', 'patient') NOT NULL
);

-- Doctor (mở rộng từ users)
CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY,
    dob DATE NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id)
);

-- Patient (mở rộng từ users)
CREATE TABLE patients (
    patient_id INT PRIMARY KEY,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    dob DATE NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES users(user_id));
    
-- Thêm cột age vào bảng patients
ALTER TABLE patients ADD COLUMN age INT;

-- Tính tuổi
DELIMITER //
CREATE TRIGGER set_patient_age
BEFORE INSERT ON patients
FOR EACH ROW
BEGIN
  SET NEW.age = YEAR(CURDATE()) - YEAR(NEW.dob);
END;
//
DELIMITER ;