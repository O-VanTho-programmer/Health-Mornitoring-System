'use client';
import React, { useState } from 'react';
import styles from './login.module.css';

function LoginPage() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
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
            <input type="submit" value="Login" />
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