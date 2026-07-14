import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// Function to generate a password that meets the validation rules
// (Min 8 chars, 1 uppercase, 1 lowercase, 1 number)
const generatePassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const special = '!@#$%^&*';
  const all = upper + lower + nums + special;
  
  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += nums[Math.floor(Math.random() * nums.length)];
  
  // Fill the rest to reach 10 characters for extra security
  for(let i = 0; i < 7; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle the string so the order isn't predictably upper -> lower -> num
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
};

// ==========================================
// ADMIN DASHBOARD PAGE
// ==========================================
function AdminPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Use data from context instead of localStorage
  const userName = userData?.name || 'Admin Test';
  
  // Dashboard State Control
  const [currentView, setCurrentView] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Placeholder Data State
  const [staffData, setStaffData] = useState([
    { id: 1, name: "Juana Dela Cruz", email: "juana@naic.gov.ph", role: "MSWD Staff", barangay: "Naic", status: "Pending" },
    { id: 2, name: "Jose Santos", email: "jose@naic.gov.ph", role: "Social Worker", barangay: "Tanza", status: "Active" }
  ]);
  const [pendingInvitesCount, setPendingInvitesCount] = useState(2);

  // New Staff Form State
  const [newStaffForm, setNewStaffForm] = useState({ name: '', email: '', mobile: '', role: 'MSWD Staff', barangays: [] });
  const [tempPassword, setTempPassword] = useState(generatePassword());

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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Initialize or retrieve the Secondary App strictly for account creation
      const secondaryApp = getApps().find(app => app.name === "StaffCreator") 
        ? getApp("StaffCreator") 
        : initializeApp(firebaseConfig, "StaffCreator");
        
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Create the user using the secondary auth instance
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newStaffForm.email, tempPassword);
      const newUser = userCredential.user;

      // 3. Immediately sign out the secondary instance
      await signOut(secondaryAuth);

      // 4. Write the staff details to Firestore
      const assignedBarangays = newStaffForm.barangays.length > 0 ? newStaffForm.barangays.join(', ') : 'Unassigned';
      const staffDocRef = doc(db, 'staff', newUser.uid);
      
      await setDoc(staffDocRef, {
        name: newStaffForm.name,
        email: newStaffForm.email,
        role: newStaffForm.role,
        barangay: assignedBarangays,
        status: 'Active',
        registrationDate: new Date().toISOString()
      });

      // 5. Option A: Generate the mailto link
      const subject = encodeURIComponent('Welcome to MSWD Naic - Staff Account');
      const body = encodeURIComponent(`Hello ${newStaffForm.name},\n\nYour official MSWD portal staff account has been securely created.\n\nEmail: ${newStaffForm.email}\nTemporary Password: ${tempPassword}\n\nPlease log in and update your profile immediately.`);
      
      window.open(`mailto:${newStaffForm.email}?subject=${subject}&body=${body}`);

      // 6. Update local UI to reflect the newly created staff member
      const newRecord = {
        id: newUser.uid,
        name: newStaffForm.name,
        email: newStaffForm.email,
        role: newStaffForm.role,
        barangay: assignedBarangays,
        status: 'Active'
      };

      setStaffData([newRecord, ...staffData]);
      setShowAddStaffModal(false);
      
      // Reset form and generate a fresh secure password for the next entry
      setNewStaffForm({ name: '', email: '', mobile: '', role: 'MSWD Staff', barangays: [] });
      setTempPassword(generatePassword());
      
      showToast(`Staff account created. Email draft opened for ${newRecord.email}`);

    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Failed to create staff account: ' + error.message);
    }
  };

  const handleBarangayCheckbox = (brgy) => {
    setNewStaffForm(prev => {
      const exists = prev.barangays.includes(brgy);
      if (brgy === 'All Barangays') {
        return { ...prev, barangays: exists ? [] : ['All Barangays'] };
      }
      const newBrgys = exists ? prev.barangays.filter(b => b !== brgy) : [...prev.barangays.filter(b => b !== 'All Barangays'), brgy];
      return { ...prev, barangays: newBrgys };
    });
  };

  const styles = {
    layout: { fontFamily: 'Arial, sans-serif', background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { height: '72px', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #E2E8F0', position: 'relative', zIndex: 50 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    profileArea: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', position: 'relative' },
    profileIcon: { width: '24px', height: '24px', background: '#1E3A8A', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' },
    iconBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1E3A8A', position: 'relative', display: 'flex' },
    redDot: { position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#DC2626', borderRadius: '50%', border: '2px solid white' },
    dropdown: { position: 'absolute', top: '40px', right: '0', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: '180px', zIndex: 60 },
    dropdownItem: { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', color: '#334155', background: 'none', border: 'none', width: '100%', textAlign: 'left' },
    
    content: { flex: 1, padding: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
    
    overviewCard: { height: '96px', background: '#EFF6FF', borderRadius: '8px', padding: '16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #BFDBFE', marginBottom: '24px', boxSizing: 'border-box' },
    overviewTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    overviewBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' },
    moduleCard: { height: '130px', background: '#FFFFFF', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', boxSizing: 'border-box' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '8px' },
    cardTitle: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1E3A8A' },
    cardData: { margin: '4px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#1E3A8A' },
    cardDesc: { margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' },
    actionBtn: { height: '32px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', padding: '0 16px', alignSelf: 'flex-start' },
    
    tableContainer: { background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    tableHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' },
    tableInput: { padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '14px', minWidth: '200px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #E2E8F0', color: '#64748B', fontWeight: 'bold' },
    td: { padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#334155' },
    
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { background: 'white', width: '520px', height: '580px', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#1E3A8A' },
    input: { width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
    
    toast: { position: 'fixed', bottom: '24px', right: '24px', background: '#16A34A', color: 'white', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 200, fontSize: '14px', fontWeight: 'bold' }
  };

  return (
    <div style={styles.layout} onClick={() => setShowProfileMenu(false)}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/images/MSWD.png" alt="Logo" style={{ height: '36px' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontWeight: '900', fontSize: '18px', color: '#1E3A8A' }}>Admin Dashboard</span>
        </div>
        
        <div style={styles.headerRight}>
          <button style={styles.iconBtn}>
            🔔 {pendingInvitesCount > 0 && <div style={styles.redDot}></div>}
          </button>
          <button style={styles.iconBtn}>⚙️</button>
          
          <div style={styles.profileArea} onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }}>
            <div style={styles.profileIcon}>{userName ? userName.charAt(0) : 'A'}</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A8A', lineHeight: '1.2' }}>{userName} ▾</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>System Administrator</div>
            </div>
            
            {showProfileMenu && (
              <div style={styles.dropdown} className="anim-slide-up">
                <button style={styles.dropdownItem}>Profile</button>
                <button style={styles.dropdownItem}>Settings</button>
                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '4px 0' }} />
                <button style={{...styles.dropdownItem, color: '#DC2626', fontWeight: 'bold'}} onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <div style={styles.content}>
        
        {currentView === 'dashboard' && (
          <div className="anim-fade-in">
            {/* SYSTEM OVERVIEW CARD */}
            <div style={styles.overviewCard}>
              <div style={styles.overviewTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: '#1E3A8A' }}>
                  📊 System Overview
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Last updated: 2m ago</div>
              </div>
              <div style={styles.overviewBottom}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A8A' }}>
                  1,204 Active SP | 12 Staff | 2,400,000 Fund
                </div>
                {pendingInvitesCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⚠️ {pendingInvitesCount} Pending Staff Invites
                    </span>
                    <button style={{...styles.actionBtn, background: '#DC2626'}} onClick={() => setCurrentView('staff-table')}>Review</button>
                  </div>
                )}
              </div>
            </div>

            {/* MODULE CARDS GRID */}
            <div style={styles.grid}>
              <div style={styles.moduleCard} className="hover-card">
                <div>
                  <div style={styles.cardHeader}><span>👥</span> <h4 style={styles.cardTitle}>Staff Accounts</h4></div>
                  <div style={styles.cardData}>12 Active</div>
                  <div style={styles.cardDesc}>Manage users and roles</div>
                </div>
                <button style={styles.actionBtn} onClick={() => setCurrentView('staff-table')}>+ Add Staff</button>
              </div>

              <div style={styles.moduleCard} className="hover-card">
                <div>
                  <div style={styles.cardHeader}><span>📝</span> <h4 style={styles.cardTitle}>Content CMS</h4></div>
                  <div style={styles.cardData}>5 Announcements</div>
                  <div style={styles.cardDesc}>News, videos, posts</div>
                </div>
                <button style={styles.actionBtn} onClick={() => alert('Opening Unified CMS (Placeholder)')}>Manage All</button>
              </div>

              <div style={styles.moduleCard} className="hover-card">
                <div>
                  <div style={styles.cardHeader}><span>📚</span> <h4 style={styles.cardTitle}>Resources</h4></div>
                  <div style={styles.cardData}>RA 11861 v2.1</div>
                  <div style={styles.cardDesc}>Legal and health data</div>
                </div>
                <button style={styles.actionBtn} onClick={() => alert('Opening Resource Uploader (Placeholder)')}>Update</button>
              </div>

              <div style={styles.moduleCard} className="hover-card">
                <div>
                  <div style={styles.cardHeader}><span>💵</span> <h4 style={styles.cardTitle}>Fund Settings</h4></div>
                  <div style={styles.cardData}>2,400,000 / 5,000,000</div>
                  <div style={styles.cardDesc}>Budget control</div>
                </div>
                <button style={styles.actionBtn} onClick={() => alert('Opening Fund Settings Form (Placeholder)')}>Adjust Budget</button>
              </div>

              <div style={styles.moduleCard} className="hover-card">
                <div>
                  <div style={styles.cardHeader}><span>⚙️</span> <h4 style={styles.cardTitle}>System Config</h4></div>
                  <div style={styles.cardData}>18 Barangays</div>
                  <div style={styles.cardDesc}>Roles and templates</div>
                </div>
                <button style={styles.actionBtn} onClick={() => alert('Opening System Config (Placeholder)')}>Configure</button>
              </div>

              <div style={styles.moduleCard} className="hover-card">
                <div>
                  <div style={styles.cardHeader}><span>📈</span> <h4 style={styles.cardTitle}>Audit Logs</h4></div>
                  <div style={styles.cardData}>View activity</div>
                  <div style={styles.cardDesc}>Track all changes</div>
                </div>
                <button style={styles.actionBtn} onClick={() => alert('Opening Audit Logs:\n"Admin Test changed budget — Oct 4, 10:04AM"')}>Open Logs</button>
              </div>
            </div>
          </div>
        )}

        {/* STAFF ACCOUNTS TABLE VIEW */}
        {currentView === 'staff-table' && (
          <div className="anim-fade-in" style={styles.tableContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1E3A8A', fontSize: '24px' }}>Staff Accounts</h2>
              <button style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setCurrentView('dashboard')}>← Back to Dashboard</button>
            </div>
            
            <div style={styles.tableHeader}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search accounts..." style={styles.tableInput} />
                <select style={styles.tableInput}><option>Filter by Role</option></select>
                <select style={styles.tableInput}><option>Filter by Barangay</option></select>
                <select style={styles.tableInput}><option>Filter by Status</option></select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{...styles.actionBtn, background: '#F1F5F9', color: '#1E3A8A'}} onClick={() => alert('Exporting CSV...')}>Export CSV</button>
                <button style={{...styles.actionBtn, background: '#F1F5F9', color: '#1E3A8A'}} onClick={() => alert('Exporting PDF...')}>Export PDF</button>
                <button style={styles.actionBtn} onClick={() => setShowAddStaffModal(true)}>+ Add Staff</button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{...styles.th, width: '40px'}}><input type="checkbox" /></th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Assigned Barangay</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffData.map(staff => (
                    <tr key={staff.id} className="hover-card" style={{ transition: 'none' }}>
                      <td style={styles.td}><input type="checkbox" /></td>
                      <td style={styles.td}><strong>{staff.name}</strong></td>
                      <td style={styles.td}>{staff.email}</td>
                      <td style={styles.td}>{staff.role}</td>
                      <td style={styles.td}>{staff.barangay}</td>
                      <td style={styles.td}>
                        <span style={{ 
                          background: staff.status === 'Active' ? '#DCFCE7' : '#FEF9C3', 
                          color: staff.status === 'Active' ? '#16A34A' : '#D97706', 
                          padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' 
                        }}>{staff.status}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '13px' }} onClick={() => window.confirm(`Deactivate ${staff.name}?`)}>Deactivate</button>
                          <span style={{ color: '#CBD5E1' }}>|</span>
                          <button style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '13px' }} onClick={() => alert(`Password reset link sent to ${staff.email}`)}>Reset Password</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="anim-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1E3A8A', fontSize: '20px' }}>Add New Staff</h2>
              <button onClick={() => setShowAddStaffModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>
            
            <form onSubmit={handleAddStaffSubmit} style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name <span style={{ color: '#DC2626' }}>*</span></label>
                <input type="text" required style={styles.input} placeholder="Full Name" value={newStaffForm.name} onChange={e => setNewStaffForm({...newStaffForm, name: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Email <span style={{ color: '#DC2626' }}>*</span></label>
                  <input type="email" required style={styles.input} placeholder="email@naic.gov.ph" value={newStaffForm.email} onChange={e => setNewStaffForm({...newStaffForm, email: e.target.value})} />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Mobile</label>
                  <input type="text" style={styles.input} placeholder="09XX XXX XXXX" value={newStaffForm.mobile} onChange={e => setNewStaffForm({...newStaffForm, mobile: e.target.value})} />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Role <span style={{ color: '#DC2626' }}>*</span></label>
                <select style={styles.input} value={newStaffForm.role} onChange={e => setNewStaffForm({...newStaffForm, role: e.target.value})}>
                  <option value="MSWD Staff">MSWD Staff</option>
                  <option value="Social Worker">Social Worker</option>
                  <option value="Verifier">Verifier</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Assigned Barangay <span style={{ color: '#DC2626' }}>*</span></label>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                  {['All Barangays', 'Naic', 'Tanza'].map(b => (
                    <label key={b} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={newStaffForm.barangays.includes(b)} onChange={() => handleBarangayCheckbox(b)} /> {b}
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Generated Secure Password</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" readOnly value={tempPassword} style={{ ...styles.input, background: '#F1F5F9', color: '#475569', fontWeight: 'bold' }} />
                  <button type="button" style={{ ...styles.actionBtn, background: '#E2E8F0', color: '#1E3A8A' }} onClick={() => {
                    navigator.clipboard.writeText(tempPassword);
                    alert('Password copied!');
                  }}>Copy</button>
                  <button type="button" style={{ ...styles.actionBtn, background: '#E2E8F0', color: '#1E3A8A' }} onClick={() => setTempPassword(generatePassword())}>↻</button>
                </div>
              </div>

              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155' }}>
                <input type="checkbox" defaultChecked /> Force password change on first login
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                <button type="button" style={{ ...styles.actionBtn, background: '#F1F5F9', color: '#64748B' }} onClick={() => setShowAddStaffModal(false)}>Cancel</button>
                <button type="submit" style={styles.actionBtn}>Create Account and Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div style={styles.toast} className="anim-slide-up">
          ✓ {toastMsg}
        </div>
      )}

    </div>
  );
}

export default AdminPage;