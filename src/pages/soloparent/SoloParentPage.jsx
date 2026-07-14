import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// SOLO PARENT DASHBOARD PAGE
// ==========================================
function SoloParentPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Use secure data from context
  const userName = userData?.name || 'Loading...';
  const soloParentId = userData?.idNumber || 'SP-000000000';
  const category = userData?.category || 'A1';
  const expiryDate = userData?.expiryDate || 'Dec 31, 2026';

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      // Clear any cached role data as a fallback
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const styles = {
    layout: { fontFamily: 'Arial, sans-serif', background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { height: '72px', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #E2E8F0', position: 'relative', zIndex: 50 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    profileArea: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', position: 'relative' },
    profileIcon: { width: '36px', height: '36px', background: '#1E3A8A', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' },
    iconBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B', position: 'relative', display: 'flex' },
    badge: { position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: '#DC2626', borderRadius: '50%', border: '2px solid white' },
    dropdown: { position: 'absolute', top: '50px', right: '0', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: '200px', zIndex: 60 },
    dropdownItem: { padding: '12px 20px', cursor: 'pointer', fontSize: '14px', color: '#334155', background: 'none', border: 'none', width: '100%', textAlign: 'left', fontWeight: 'bold' },
    
    content: { flex: 1, padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' },
    
    mainCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    sideCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    
    card: { background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    cardTitle: { margin: '0 0 16px 0', color: '#1E3A8A', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' },
    
    idCard: { background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '16px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.2)' },
    idHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    idGovText: { fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
    idTitle: { fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' },
    idNumber: { fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'monospace' },
    idBody: { display: 'flex', gap: '20px', alignItems: 'center' },
    idPhotoFrame: { width: '90px', height: '90px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' },
    idDetails: { display: 'flex', flexDirection: 'column', gap: '8px' },
    idLabel: { fontSize: '11px', opacity: 0.7, margin: 0 },
    idValue: { fontSize: '15px', fontWeight: 'bold', margin: 0 },
    
    actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
    actionBtn: { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', color: '#1E3A8A', fontWeight: 'bold', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    actionIcon: { fontSize: '24px' },
    
    announcementItem: { padding: '16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' },
    announcementDate: { fontSize: '12px', color: '#64748B', marginBottom: '4px' },
    announcementTitle: { fontSize: '15px', color: '#1E3A8A', fontWeight: 'bold', margin: 0 },
    announcementPreview: { fontSize: '13px', color: '#475569', marginTop: '6px', lineHeight: '1.4' }
  };

  return (
    <div style={styles.layout} onClick={() => { setShowProfileDropdown(false); setShowNotifDropdown(false); }}>
      <style>{`
        @media (max-width: 900px) {
          .sp-content { grid-template-columns: 1fr !important; }
        }
        .action-hover:hover { background: #EFF6FF !important; border-color: #BFDBFE !important; transform: translateY(-2px); }
      `}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/images/MSWD.png" alt="Logo" style={{ height: '36px' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontWeight: '900', fontSize: '18px', color: '#1E3A8A' }}>Solo Parent Portal</span>
        </div>
        
        <div style={styles.headerRight}>
          <div style={{ position: 'relative' }}>
            <button style={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setShowNotifDropdown(!showNotifDropdown); setShowProfileDropdown(false); }}>
              🔔 <div style={styles.badge}></div>
            </button>
            {showNotifDropdown && (
              <div style={{...styles.dropdown, right: '-10px', width: '280px'}} className="anim-slide-up">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', fontWeight: 'bold', color: '#1E3A8A' }}>Notifications</div>
                <div style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                  <strong>Benefit Claim Available:</strong> You are eligible for the Q3 Educational Assistance.
                </div>
              </div>
            )}
          </div>
          
          <div style={styles.profileArea} onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); }}>
            <div style={styles.profileIcon}>{userName ? userName.charAt(0) : 'S'}</div>
            <div style={{ display: 'none' }} className="desktop-only">
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A8A' }}>{userName} ▾</div>
            </div>
            
            {showProfileDropdown && (
              <div style={styles.dropdown} className="anim-slide-up">
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #E2E8F0', marginBottom: '4px' }}>
                  <strong style={{ display: 'block', color: '#1E3A8A' }}>{userName}</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Verified Solo Parent</span>
                </div>
                <button style={styles.dropdownItem} onClick={() => navigate('/profile')}>My Profile</button>
                <button style={styles.dropdownItem} onClick={() => navigate('/inbox')}>Messages</button>
                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '4px 0' }} />
                <button style={{...styles.dropdownItem, color: '#DC2626'}} onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <div style={styles.content} className="sp-content">
        
        {/* LEFT COLUMN */}
        <div style={styles.mainCol}>
          
          {/* DIGITAL ID CARD */}
          <div className="anim-fade-in">
            <h2 style={{ fontSize: '20px', color: '#1E3A8A', margin: '0 0 16px 0' }}>Your Digital ID</h2>
            <div style={styles.idCard}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
              <div style={styles.idHeader}>
                <div>
                  <p style={styles.idGovText}>Republic of the Philippines</p>
                  <h3 style={styles.idTitle}>Solo Parent Identification Card</h3>
                </div>
                <div>
                  <p style={styles.idGovText} style={{ textAlign: 'right', opacity: 0.8, fontSize: '11px', margin: '0 0 4px 0' }}>ID Number</p>
                  <div style={styles.idNumber}>{soloParentId}</div>
                </div>
              </div>
              <div style={styles.idBody}>
                <div style={styles.idPhotoFrame}>👤</div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={styles.idDetails}>
                    <p style={styles.idLabel}>Full Name</p>
                    <p style={styles.idValue}>{userName}</p>
                  </div>
                  <div style={styles.idDetails}>
                    <p style={styles.idLabel}>Category</p>
                    <p style={styles.idValue}>{category.toUpperCase()}</p>
                  </div>
                  <div style={styles.idDetails}>
                    <p style={styles.idLabel}>Status</p>
                    <p style={{...styles.idValue, color: '#A7F3D0'}}>Active & Verified</p>
                  </div>
                  <div style={styles.idDetails}>
                    <p style={styles.idLabel}>Valid Until</p>
                    <p style={styles.idValue}>{expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={styles.card} className="anim-slide-up">
            <h3 style={styles.cardTitle}>⚙️ Quick Actions</h3>
            <div style={styles.actionGrid}>
              <button style={styles.actionBtn} className="action-hover" onClick={() => navigate('/ra11861-guidelines')}>
                <span style={styles.actionIcon}>📖</span>
                View RA 11861 Benefits
              </button>
              <button style={styles.actionBtn} className="action-hover" onClick={() => navigate('/support-tickets')}>
                <span style={styles.actionIcon}>✉️</span>
                Request Assistance
              </button>
              <button style={styles.actionBtn} className="action-hover" onClick={() => navigate('/programs')}>
                <span style={styles.actionIcon}>🏢</span>
                LGU Programs
              </button>
              <button style={styles.actionBtn} className="action-hover" onClick={() => navigate('/profile')}>
                <span style={styles.actionIcon}>📝</span>
                Update Profile / Renewal
              </button>
              <button style={{...styles.actionBtn, gridColumn: '1 / -1'}} className="action-hover" onClick={() => navigate('/forum')}>
                <span style={styles.actionIcon}>💬</span>
                Community Forum
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.sideCol}>
          
          {/* NOTICES & ALERTS */}
          <div style={{...styles.card, borderTop: '4px solid #F59E0B'}} className="anim-slide-up">
            <h3 style={styles.cardTitle}>📌 Active Claims</h3>
            <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '8px', color: '#92400E', fontSize: '14px', lineHeight: '1.5' }}>
              <strong>Educational Assistance (Q3)</strong><br />
              Status: <span style={{ color: '#059669', fontWeight: 'bold' }}>Approved</span><br />
              Please proceed to MSWD Office on Oct 15, 2026.
            </div>
          </div>

          {/* ANNOUNCEMENTS FEED */}
          <div style={{...styles.card, padding: 0, overflow: 'hidden'}} className="anim-slide-up">
            <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <h3 style={{...styles.cardTitle, margin: 0}}>📢 Latest Updates</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={styles.announcementItem} onClick={() => navigate('/announcements')}>
                <div style={styles.announcementDate}>Oct 2, 2026 • General Info</div>
                <h4 style={styles.announcementTitle}>PhilHealth Registration Drive for Solo Parents</h4>
                <p style={styles.announcementPreview}>Ensure your dependents are covered. Join us at the town plaza this coming Friday...</p>
              </div>
              
              <div style={styles.announcementItem} onClick={() => navigate('/announcements')}>
                <div style={styles.announcementDate}>Sep 28, 2026 • Livelihood</div>
                <h4 style={styles.announcementTitle}>Free Technical-Vocational Training</h4>
                <p style={styles.announcementPreview}>TESDA partnership courses are now open for enrollment. Limited slots available...</p>
              </div>
            </div>
            
            <button 
              style={{ width: '100%', padding: '12px', background: 'white', border: 'none', color: '#2563EB', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              onClick={() => navigate('/announcements')}
            >
              View All Announcements →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SoloParentPage;