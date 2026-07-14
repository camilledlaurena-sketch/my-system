import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// LOGIN PAGE COMPONENT
// ==========================================
function LoginPage() {
  const navigate = useNavigate();
  const { userRole, userData } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Securely redirect based on AuthContext state if already logged in
  useEffect(() => {
    if (userRole && userData) {
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'staff') navigate('/staff');
      else if (userRole === 'soloparent') {
        if (userData.status === 'pending' || userData.status === 'denied') navigate('/status');
        else navigate('/soloparent');
      } else navigate('/unauthorized');
    }
  }, [userRole, userData, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during login:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    const resetEmail = window.prompt("Please enter your email address to reset your password:", email);
    if (!resetEmail) return;
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert(`Password reset email sent to ${resetEmail}! Please check your inbox.`);
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Failed to send reset email: " + error.message);
    }
  };

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    card: { padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderTop: '6px solid #fbbf24' },
    title: { margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '28px', textAlign: 'center', fontWeight: '900' },
    subtitle: { margin: '0 0 25px 0', color: '#475569', fontSize: '15px', textAlign: 'center' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', color: '#1e3a8a', fontWeight: 'bold', fontSize: '14px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '15px', background: '#f8fafc' },
    button: { width: '100%', padding: '14px', background: '#fbbf24', color: '#1e3a8a', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    linkText: { textAlign: 'center', marginTop: '15px', display: 'block', color: '#1e3a8a', textDecoration: 'none', fontWeight: 'bold' }
  };

  return (
    <div style={styles.body}>
      <div style={styles.card} className="anim-slide-up">
        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>Sign in with your verified account</p>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                style={{ ...styles.input, paddingRight: '40px' }} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '10px', cursor: 'pointer', fontSize: '18px', userSelect: 'none' }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? '👁️' : '🔒'}
              </span>
            </div>
            <div 
              style={{ textAlign: 'right', marginTop: '8px', fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </div>
          </div>

          <button type="submit" style={styles.button} className="hover-btn">Login Securely</button>
          
          <Link to="/categories" style={styles.linkText}>Don't have an account? Sign up here</Link>
          <Link to="/" style={{...styles.linkText, color: '#64748b', fontSize: '13px', marginTop: '10px'}}>Back to Home</Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;