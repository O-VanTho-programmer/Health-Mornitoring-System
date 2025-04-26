'use client';
import React, { useState } from 'react';
import styles from '../login/login.module.css'; // Changed to local CSS module

function RegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'Patient'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? (checked ? value : prev.userType) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Registration</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputBox}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.policy}>
            <h3 className={styles.policyHeading}>Are you a Doctor?</h3>
            <div className={styles.choose}>
              <div className={styles.radioOption}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="Doctor"
                    checked={formData.userType === 'Doctor'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>Yes</span>
                </label>
              </div>
              <div className={styles.radioOption}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="Patient"
                    checked={formData.userType === 'Patient'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>No</span>
                </label>
              </div>
            </div>
          </div>
          <div className={`${styles.inputBox} ${styles.button}`}>
            <input
              type="submit"
              value="Register Now"
              className={styles.submitButton}
            />
          </div>
          <div className={styles.text}>
            <h3 className={styles.textMessage}>
              Already have an account?{' '}
              <a href="/login" className={styles.link}>Login now</a>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;