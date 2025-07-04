import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = () => {
  // State to track whether the form is in "login" or "signup" mode
  const [isLogin, setIsLogin] = useState(false);

  // State to hold form field values
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    username: '',
    password: ''
  });

  // Function to switch between login and signup forms
  const toggleForm = () => {
    setIsLogin(prev => !prev);
    // Reset the form data whenever switching modes
    setFormData({
      first_name: '',
      email: '',
      username: '',
      password: ''
    });
  };

  // Function to update form data on input change
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault();

    if (isLogin) {
      // LOGIN: Only send username and password to backend
      try {
        const res = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const data = await res.json();
        console.log('Login Response:', data);
        alert(data.message || 'Login response received');
      } catch (err) {
        console.error('Login Error:', err);
        alert('Login request failed');
      }
    } else {
      // SIGNUP: Send all form fields to backend
      try {
        const res = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        console.log('Signup Response:', data);
        alert(data.message || 'Signup response received');
      } catch (err) {
        console.error('Signup Error:', err);
        alert('Signup request failed');
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">{isLogin ? 'Login' : 'Signup'}</h2>
        <div className="underline"></div>

        {/* The form */}
        <form onSubmit={handleSubmit}>
          {/* Signup fields - Only visible in Signup mode */}
          {!isLogin && (
            <>
              <label>
                <i className="fa-regular fa-user"></i> First Name:
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />

              <label>
                <i className="fa-regular fa-envelope"></i> Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* Username field (common for both Login & Signup) */}
          <label>
            <i className="fa-regular fa-user"></i> Username:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Password field */}
          <label>
            <i className="fa-solid fa-key"></i> Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Submit button */}
          <button className="btn" type="submit">
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        {/* Toggle between Login & Signup */}
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={toggleForm}>
            {isLogin ? 'Signup here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
