import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// 12. STAFF PAGE
// ==========================================
function StaffPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Use data from context instead of localStorage
  const userName = userData?.name || 'Ms. Santos, RSW';
  
  // Dashboard states
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('expiry');

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Placeholders for conditionals
  const hasUrgentChat = true; 
  const reportsLabelStatus = "Monthly summary";

  const staffStyles = {
    body: { fontFamily: 'Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, overflowX: 'hidden' },
    header: { height: '72px', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #e2e8f0', position: 'relative', zIndex: 50 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '24px' },
    avatarArea: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', position: 'relative' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e3a8a', fontSize: '16px' },
    iconBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', color: '#64748b' },
    badge: { position: 'absolute', top: '-5px', right: '-8px', background: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px', lineHeight: '1' },
    dropdown: { position: 'absolute', top: '100%', right: '0', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '10px', minWidth: '220px', zIndex: 60, marginTop: '15px' },
    chatPanel: { position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: 'white', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)', zIndex: 100, transform: showChatPanel ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-in-out', display: 'flex', flexDirection: 'column' },
    content: { flex: 1, padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
    urgentBanner: { height: '80px', background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', borderRadius: '8px', marginBottom: '16px' },
    card: { height: '145px', background: 'white', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', boxSizing: 'border-box' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' },
    reportsTitle: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '8px' },
    reportsLabel: { margin: '4px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#1E3A8A' },
    cardLabel: { margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' },
    cardBtn: { background: '#f1f5f9', color: '#1e3a8a', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', alignSelf: 'flex-start' },
    reportsBtn: { background: '#1E3A8A', color: 'white', padding: '0 20px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', alignSelf: 'flex-start' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { background: 'white', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxSizing: 'border-box' },
    chatItem: { padding: '16px', borderBottom: '1px solid #f1f5f9' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginTop: '16px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 'bold' },
    td: { padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#334155' }
  };

  return (
    <div style={staffStyles.body} className="anim-fade-in">
      <style>{`
        .staff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 768px) { .staff-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HEADER */}
      <header style={staffStyles.header}>
        <div style={staffStyles.headerLeft}>
          <img src="/images/MSWD.png" alt="MSWD Logo" style={{ height: '40px' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontWeight: '900', fontSize: '20px', color: '#1e3a8a' }}>MSWD Portal</span>
        </div>
        <div style={staffStyles.headerRight}>
          <button style={staffStyles.iconBtn} onClick={() => { setShowChatPanel(true); setShowNotifDropdown(false); setShowProfileDropdown(false); }} className="hover-btn">
            💬 <span style={staffStyles.badge}>5</span>
          </button>
          <div style={{ position: 'relative' }}>
            <button style={staffStyles.iconBtn} onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowProfileDropdown(false); setShowChatPanel(false); }} className="hover-btn">
              🔔 <span style={staffStyles.badge}>2</span>
            </button>
            {showNotifDropdown && (
              <div style={{ ...staffStyles.dropdown, right: '-10px', width: '280px' }} className="anim-slide-up">
                <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>Notifications</h4>
                <div style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' }}>Notification 1 - TBD</div>
                <div style={{ padding: '10px 0', fontSize: '14px', color: '#334155' }}>Notification 2 - TBD</div>
              </div>
            )}
          </div>
          <div style={staffStyles.avatarArea} onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); setShowChatPanel(false); }}>
            <div style={staffStyles.avatar}>{userName.charAt(0) || 'M'}</div>
            <div style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px' }}>
              {userName} ▾
            </div>
            {showProfileDropdown && (
              <div style={staffStyles.dropdown} className="anim-slide-up">
                <div style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '5px' }}>
                  <strong style={{ display: 'block', color: '#1e3a8a' }}>{userName}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>MSWD Staff - Naic</span>
                </div>
                <button style={{ width: '100%', textAlign: 'left', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#334155', fontWeight: 'bold' }} className="hover-btn">Profile Settings</button>
                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 'bold' }} className="hover-btn">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* RIGHT SIDE CHAT PANEL */}
      <div style={staffStyles.chatPanel}>
        <div style={{ padding: '20px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Chat Queue - 5 Waiting</h3>
          <button onClick={() => setShowChatPanel(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', lineHeight: '1' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Item 1 (Urgent) */}
          <div style={staffStyles.chatItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <strong style={{ color: '#1e3a8a', fontSize: '15px' }}>Maria S. - 3m ago ⚠️</strong>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569' }}>"Question about requirements."</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ ...staffStyles.cardBtn, background: '#e0e7ff', color: '#1e40af' }} className="hover-btn">Quick Reply</button>
              <button style={staffStyles.cardBtn} className="hover-btn">Open Full Chat</button>
            </div>
          </div>
          {/* Item 2 */}
          <div style={staffStyles.chatItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24' }}></div>
              <strong style={{ color: '#1e3a8a', fontSize: '15px' }}>Jose S. - 1m ago</strong>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569' }}>"Question about cash aid."</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ ...staffStyles.cardBtn, background: '#e0e7ff', color: '#1e40af' }} className="hover-btn">Quick Reply</button>
              <button style={staffStyles.cardBtn} className="hover-btn">Open Full Chat</button>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', background: '#f8fafc' }}>
          <button style={{ background: 'none', border: 'none', color: '#1e3a8a', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }} className="hover-link">View All Active Chats</button>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }} className="hover-link">History</button>
        </div>
      </div>

      {/* MAIN CONTENT BODY */}
      <div style={staffStyles.content}>
        
        {/* Urgent Banner */}
        {hasUrgentChat && (
          <div style={staffStyles.urgentBanner} className="anim-slide-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span> URGENT: 5 chats waiting more than 3 mins
            </div>
            <button style={{ background: '#ef4444', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }} className="hover-btn" onClick={() => setShowChatPanel(true)}>
              Reply Now
            </button>
          </div>
        )}

        {/* Action Cards Grid */}
        <div className="staff-grid">
          {/* Row 1 */}
          <div style={staffStyles.card} className="hover-card anim-slide-up">
            <div style={staffStyles.cardHeader}>
              <div>
                <h4 style={staffStyles.cardTitle}>📄 Review Applications</h4>
                <p style={staffStyles.cardLabel}>3 new pending</p>
              </div>
            </div>
            <button style={staffStyles.cardBtn} className="hover-btn" onClick={() => navigate('/pending-registrations')}>Review</button>
          </div>
          <div style={staffStyles.card} className="hover-card anim-slide-up">
            <div style={staffStyles.cardHeader}>
              <div>
                <h4 style={staffStyles.cardTitle}>👥 View Records</h4>
                <p style={staffStyles.cardLabel}>Search / Scan QR</p>
              </div>
            </div>
            <button style={staffStyles.cardBtn} className="hover-btn" onClick={() => alert('Opening QR Scanner (Placeholder)')}>Open Scanner</button>
          </div>

          {/* Row 2 */}
          <div style={staffStyles.card} className="hover-card anim-slide-up">
            <div style={staffStyles.cardHeader}>
              <div>
                <h4 style={staffStyles.cardTitle}>📢 Announcements</h4>
                <p style={staffStyles.cardLabel}>Post an update</p>
              </div>
            </div>
            <button style={staffStyles.cardBtn} className="hover-btn" onClick={() => setShowAnnouncementModal(true)}>Create New</button>
          </div>
          <div style={staffStyles.card} className="hover-card anim-slide-up">
            <div style={staffStyles.cardHeader}>
              <div>
                <h4 style={staffStyles.cardTitle}>💵 Track Claims</h4>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                  • Subsidy for Indigents<br/>
                  • Educational Assistance
                </div>
              </div>
            </div>
            <button style={staffStyles.cardBtn} className="hover-btn" onClick={() => navigate('/claims')}>Manage Benefits</button>
          </div>

          {/* Row 3 */}
          <div style={staffStyles.card} className="hover-card anim-slide-up">
            <div style={staffStyles.cardHeader}>
              <div>
                <h4 style={staffStyles.reportsTitle}>📊 Reports</h4>
                <p style={staffStyles.reportsLabel}>{reportsLabelStatus}</p>
                <p style={{...staffStyles.cardLabel, fontSize: '13px', marginTop: '4px'}}>Monthly summary</p>
              </div>
            </div>
            <button style={staffStyles.reportsBtn} className="hover-btn" onClick={() => setShowReportsModal(true)}>Generate</button>
          </div>
          <div style={staffStyles.card} className="hover-card anim-slide-up">
            <div style={staffStyles.cardHeader}>
              <div>
                <h4 style={staffStyles.cardTitle}>📅 MSWD Events</h4>
                <p style={staffStyles.cardLabel}>2 upcoming</p>
              </div>
            </div>
            <button style={staffStyles.cardBtn} className="hover-btn" onClick={() => alert('Navigating to Events Management (Placeholder)')}>Manage</button>
          </div>
        </div>
      </div>

      {/* CREATE NEW ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div style={staffStyles.modalOverlay}>
          <div style={{ ...staffStyles.modalContent, maxWidth: '500px' }} className="anim-slide-up">
            <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '20px' }}>Create New Announcement</h3>
            <input type="text" placeholder="Announcement Title" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '16px', boxSizing: 'border-box', fontSize: '14px' }} />
            <textarea placeholder="Details..." style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '140px', marginBottom: '16px', boxSizing: 'border-box', resize: 'vertical', fontSize: '14px', fontFamily: 'Arial' }}></textarea>
            <button style={{ ...staffStyles.cardBtn, marginBottom: '16px', alignSelf: 'flex-start' }} className="hover-btn" onClick={() => alert('Upload media placeholder')}>+ Add Photo/Video</button>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button style={{ ...staffStyles.cardBtn, background: '#f1f5f9', color: '#64748b' }} className="hover-btn" onClick={() => setShowAnnouncementModal(false)}>Cancel</button>
              <button style={staffStyles.reportsBtn} className="hover-btn" onClick={() => alert('Submitted to Admin for approval (Placeholder)')}>Send to Admin</button>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS MODAL */}
      {showReportsModal && (
        <div style={staffStyles.modalOverlay}>
          <div style={{ ...staffStyles.modalContent, maxWidth: '800px', width: '600px', height: '560px' }} className="anim-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '20px' }}>System Reports</h3>
              <button onClick={() => setShowReportsModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b', lineHeight: '1' }} className="hover-btn">✕</button>
            </div>
            
            <select style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', color: '#334155' }} value={activeReportTab} onChange={(e) => setActiveReportTab(e.target.value)}>
              <option value="expiry">Solo Parent ID Expiry</option>
              <option value="master">Master List</option>
              <option value="benefits">Benefits Claimed</option>
              <option value="events">Event Attendance</option>
              <option value="applications">Application Summary</option>
              <option value="barangay">Barangay Breakdown</option>
            </select>

            {activeReportTab === 'expiry' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <button style={{ ...staffStyles.cardBtn, background: '#e0e7ff', color: '#1e40af' }}>Next 30 Days</button>
                  <button style={staffStyles.cardBtn}>60 Days</button>
                  <button style={staffStyles.cardBtn}>90 Days</button>
                  <button style={staffStyles.cardBtn}>Per Barangay</button>
                  <button style={staffStyles.cardBtn}>Status</button>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <table style={staffStyles.table}>
                    <thead>
                      <tr>
                        <th style={staffStyles.th}>SP ID</th>
                        <th style={staffStyles.th}>Name</th>
                        <th style={staffStyles.th}>Barangay</th>
                        <th style={staffStyles.th}>Expiry Date</th>
                        <th style={staffStyles.th}>Days Left</th>
                        <th style={staffStyles.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={staffStyles.td}>SP-001</td>
                        <td style={staffStyles.td}>Maria S.</td>
                        <td style={staffStyles.td}>Naic Proper</td>
                        <td style={staffStyles.td}>Oct 15, 2026</td>
                        <td style={staffStyles.td}>12 days</td>
                        <td style={staffStyles.td}><button style={{ ...staffStyles.cardBtn, background: '#fef2f2', color: '#dc2626' }} className="hover-btn" onClick={() => alert('Sending notification to Maria S. (Placeholder)')}>Notify</button></td>
                      </tr>
                      <tr>
                        <td style={staffStyles.td}>SP-142</td>
                        <td style={staffStyles.td}>Ana C.</td>
                        <td style={staffStyles.td}>Tanza</td>
                        <td style={staffStyles.td}>Nov 01, 2026</td>
                        <td style={staffStyles.td}>29 days</td>
                        <td style={staffStyles.td}><button style={{ ...staffStyles.cardBtn, background: '#fef2f2', color: '#dc2626' }} className="hover-btn" onClick={() => alert('Sending notification to Ana C. (Placeholder)')}>Notify</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', alignItems: 'center' }}>
                  <button style={staffStyles.reportsBtn} className="hover-btn" onClick={() => alert('Reminders triggered for all (Placeholder)')}>Send Reminders to All</button>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={staffStyles.cardBtn} className="hover-btn" onClick={() => alert('Exporting CSV (Placeholder)')}>Export CSV</button>
                    <button style={staffStyles.cardBtn} className="hover-btn" onClick={() => alert('Exporting PDF (Placeholder)')}>Export PDF</button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontSize: '16px', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                Placeholder content for {activeReportTab} tab.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default StaffPage;