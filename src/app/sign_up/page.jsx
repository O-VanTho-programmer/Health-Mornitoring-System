'use client';
import React, { useState } from 'react';
import styles from '../login/login.module.css';
import axios from 'axios';

function RegistrationPage() {
  const [isFillInformation, setIsFillInformation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword:'',
    gender: '',
    userType: "patient",
    height: 0,
    weight: 0,
    DOB: '',
    maxPatient: '',
    expertise: '',
    YoE: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? value : value
    }));
  };

  const nextStep = () => {

    if (formData.name === '' || formData.email === '' || formData.password === '' || formData.confirmPassword === '') {
      alert("Please fill all information!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsFillInformation(true);
  };

  const handleSubmit = async () => {

    if (formData.gender === '' || formData.DOB === '') {
      alert("Please fill all information properly");
      return;
    }

    if (formData.userType === 'patient' && (formData.height === 0 || formData.weight === 0)) {
      alert("Please fill all information properly");
      return;
    }

    if (formData.userType === 'doctor' && (!formData.maxPatient || !formData.expertise || !formData.YoE)) {
      alert("Please fill all professional information properly");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/sign_up', formData);

      if (res.status === 201) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.log("Error fetching sign up", error);
      alert("Registration failed. Please try again.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {!isFillInformation ? (
          <div>
            <h2>Registration</h2>
            <form className={styles.form}>
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
                        value="doctor"
                        checked={formData.userType === "doctor"}
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
                        value="patient"
                        checked={formData.userType === "patient"}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className={`${styles.inputBox} ${styles.button}`}>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={nextStep}
                >
                  Register Now
                </button>
              </div>
              <div className={styles.text}>
                <h3 className={styles.textMessage}>
                  Already have an account?{' '}
                  <a href="/login" className={styles.link}>Login now</a>
                </h3>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2>Complete Your Profile</h2>
            <form action={handleSubmit} className={styles.form}>
              <div className={styles.inputBox}>
                <label htmlFor='DOB' >Date of Birth</label>
                <input
                  type="date"
                  name="DOB"
                  id='DOB'
                  value={formData.DOB}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className={styles.input}
                />
              </div>

              {/* Fỏr patient */}
              {formData.userType === 'patient' && (
                <>
                  <div className={styles.inputBox}>
                    <label htmlFor='height' >Enter your Height (cm)</label>
                    <input
                      id='height'
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputBox}>
                    <label htmlFor='height' >Enter your Weight (kg)</label>
                    <input
                      id='weight'
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </div>
                </>
              )}
              {/* For Patient */}

              {/* For Doctor */}
              {formData.userType === 'doctor' && (
                <>
                  <div className={styles.inputBox}>
                    <label htmlFor='maxPatient' >Maximum number of patients you can handle simultaneously</label>
                    <input
                      id='maxPatient'
                      type="number"
                      name="maxPatient"
                      value={formData.maxPatient}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </div>


                  <div className={styles.inputBox}>
                    <label htmlFor='expertise'>Expertise</label>
                    <input
                      id='expertise'
                      type="text"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputBox}>
                    <label htmlFor='YoE'>Year of experience</label>
                    <input
                      id='YoE'
                      type="number"
                      name="YoE"
                      value={formData.YoE}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </div>
                </>

              )}
              {/* For Doctor */}

              <div className={styles.policy}>
                <h3 className={styles.policyHeading}>Your gender?</h3>
                <div className={styles.choose}>
                  <div className={styles.radioOption}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Male</span>
                    </label>
                  </div>
                  <div className={styles.radioOption}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Female</span>
                    </label>
                  </div>
                  <div className={styles.radioOption}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={formData.gender === 'Other'}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Other</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={`${styles.inputBox} ${styles.button}`}>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationPage;