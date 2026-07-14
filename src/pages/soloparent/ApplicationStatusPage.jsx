import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// APPLICATION STATUS PAGE
// ==========================================
function ApplicationStatusPage() {
  const navigate = useNavigate();
  const { userData, loading } = useAuth();

  const userName = userData?.name || 'Applicant';

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', minHeight: '100vh', padding: '40px 20px' },
    container: { maxWidth: '800px', margin: '0 auto' },
    title: { color: 'white', fontSize: '32px', fontWeight: '800', marginBottom: '20px' },
    section: { padding: '25px', borderRadius: '16px', marginBottom: '30px', background: 'rgba(255,255,255,0.95)' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statusBox: { padding: '20px', borderRadius: '8px', borderLeft: '6px solid', marginBottom: '20px', fontWeight: 'bold' },
    logoutBtn: { background: '#64748b', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
  };

  const getStatusDisplay = () => {
    if (!userData) return null;
    if (userData.status === 'denied') return { color: '#dc2626', text: `❌ Your application was Denied. Reason: ${userData.denyReason}` };
    return { color: '#b45309', text: '⏳ Your application is currently Pending Staff Review.' };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div style={styles.body} className="anim-fade-in">
      <div style={styles.container}>
        <div style={styles.row}>
          <h2 style={styles.title}>Welcome, {userName}</h2>
          <button style={styles.logoutBtn} className="hover-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div style={styles.section} className="anim-slide-up">
          <h3 style={{marginTop: 0, color: '#0f172a'}}>Application Status</h3>
          {loading ? <p>Loading status...</p> : (
            <div style={{...styles.statusBox, borderLeftColor: statusDisplay?.color, background: 'white'}}>
              <span style={{color: statusDisplay?.color}}>{statusDisplay?.text}</span>
            </div>
          )}
          <p style={{fontSize: '14px', color: '#64748b'}}>You will gain full access to the platform once a staff member approves your application. Check your inbox for updates.</p>
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatusPage;