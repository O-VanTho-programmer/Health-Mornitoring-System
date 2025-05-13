'use client';
import React, { useState } from 'react';
import styles from './login.module.css';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/login`, {email, password})

      if(res.status === 200){
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.log("Error Login", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={`${styles.inputBox} ${styles.button}`}>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Login
            </button>
          </div>
          <div className={styles.text}>
            <h3>
              Don't have an account?{' '}
              <a href="/sign_up">Sign up now</a>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;