import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// ==========================================
// SUB-COMPONENT: DOCUMENT VIEWER
// Handles both Images and PDFs dynamically
// ==========================================
const DocumentViewer = ({ reqName, fileUrl, styles }) => {
  const [isPdfFallback, setIsPdfFallback] = useState(false);

  return (
    <div style={styles.imageBox}>
      {!isPdfFallback ? (
        <img 
          src={fileUrl} 
          style={styles.actualImg} 
          alt={reqName} 
          onError={() => setIsPdfFallback(true)} // If image fails to render, assume PDF
        />
      ) : (
        <div style={{ ...styles.actualImg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
          <span style={{ fontSize: '28px', marginBottom: '8px' }}>📄</span>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '12px', color: '#2563EB', fontWeight: 'bold', textDecoration: 'none', background: '#DBEAFE', padding: '6px 12px', borderRadius: '4px' }}
          >
            View PDF Document
          </a>
        </div>
      )}
      <strong style={{ fontSize: '11px', padding: '0 5px', lineHeight: '1.4' }}>{reqName}</strong>
    </div>
  );
};

// ==========================================
// PENDING REGISTRATIONS PAGE
// ==========================================
function PendingRegistrationsPage() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [viewingApplicationId, setViewingApplicationId] = useState(null);
  
  // Deny State
  const [selectedUserForDeny, setSelectedUserForDeny] = useState(null);
  const [denyReason, setDenyReason] = useState('');
  
  // Approve State
  const [selectedUserForApprove, setSelectedUserForApprove] = useState(null);
  const [approveForm, setApproveForm] = useState({ spId: '', issueDate: '', expiryDate: '' });

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'pending_users'));
      const usersList = [];
      usersSnapshot.forEach((document) => usersList.push({ id: document.id, ...document.data() }));
      setPendingUsers(usersList);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubmit = async (e, user) => {
    e.preventDefault();
    if (!approveForm.spId || !approveForm.issueDate || !approveForm.expiryDate) {
      return alert('Please fill in all ID details to issue the Digital ID.');
    }

    try {
      const { id, ...userData } = user;
      userData.status = 'approved';
      userData.denyReason = '';
      userData.idNumber = approveForm.spId;
      userData.issueDate = approveForm.issueDate;
      userData.expiryDate = approveForm.expiryDate;
      
      await setDoc(doc(db, 'soloparent', id), userData);
      await deleteDoc(doc(db, 'pending_users', id));
      
      // Auto-reply Inbox
      await addDoc(collection(db, 'inbox'), {
        toEmail: user.email,
        title: 'Account Approved & ID Issued',
        message: `Congratulations! Your Solo Parent registration has been approved. Your official SP ID is ${approveForm.spId}. You may now log in to view your Digital ID and access your benefits.`,
        date: new Date().toISOString(),
        read: false
      });

      alert('User Approved & Digital ID Assigned!');
      setViewingApplicationId(null);
      setSelectedUserForApprove(null);
      setApproveForm({ spId: '', issueDate: '', expiryDate: '' });
      fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleDenySubmit = async (e, user) => {
    e.preventDefault();
    if (!denyReason) return alert('Please provide a reason for denial.');
    
    try {
      const { id, ...userData } = user;
      userData.status = 'denied';
      userData.denyReason = denyReason;
      
      await setDoc(doc(db, 'denied_users', id), userData);
      await deleteDoc(doc(db, 'pending_users', id));
      
      // Auto-reply Inbox
      await addDoc(collection(db, 'inbox'), {
        toEmail: user.email,
        title: 'Account Application Denied',
        message: `Your Solo Parent registration was denied. Reason: ${denyReason}`,
        date: new Date().toISOString(),
        read: false
      });

      alert('User Denied. Reason sent to applicant.');
      setSelectedUserForDeny(null);
      setDenyReason('');
      setViewingApplicationId(null);
      fetchPendingUsers();
    } catch (error) {
      console.error('Error denying user:', error);
    }
  };

  const resetForms = () => {
    setSelectedUserForDeny(null);
    setSelectedUserForApprove(null);
    setDenyReason('');
    setApproveForm({ spId: '', issueDate: '', expiryDate: '' });
  };

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', background: 'linear-gradient(135deg, #1e3a8a 0%, #fbbf24 100%)', minHeight: '100vh', padding: '40px 20px' },
    container: { maxWidth: '1000px', margin: '0 auto' },
    section: { padding: '25px', borderRadius: '16px', marginBottom: '30px', background: 'rgba(255,255,255,0.95)' },
    userCard: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '15px' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
    detailItem: { fontSize: '14px', color: '#334155' },
    imagePlaceholderContainer: { display: 'flex', gap: '15px', marginTop: '15px', gridColumn: '1 / -1', flexWrap: 'wrap' },
    imageBox: { flex: '1 1 200px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', border: '1px solid #94a3b8', color: '#64748b', textAlign: 'center', padding: '10px', overflow: 'hidden' },
    actualImg: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' },
    btnGroup: { display: 'flex', gap: '10px', marginTop: '15px' },
    viewBtn: { background: '#2563eb', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    approveBtn: { background: '#16a34a', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 },
    denyBtn: { background: '#dc2626', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '10px', marginTop: '10px', boxSizing: 'border-box', fontSize: '14px' },
    submitBtn: { background: '#1e3a8a', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    submitDenyBtn: { background: '#dc2626', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    backBtn: { background: '#64748b', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'block', margin: '0 auto' }
  };

  return (
    <div style={styles.body} className="anim-fade-in">
      <div style={styles.container}>
        
        <div style={styles.section} className="anim-slide-up">
          <h3 style={{marginTop: 0, color: '#1e3a8a', fontSize: '24px'}}>Review Pending Registrations</h3>
          
          {loading ? <p>Loading applications...</p> : pendingUsers.length === 0 ? <p style={{color: '#475569'}}>No pending applications at the moment.</p> : (
            pendingUsers.map(user => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.row}>
                  <div>
                    <h4 style={{margin: '0 0 5px 0', fontSize: '18px', color:'#1e3a8a'}}>{user.name}</h4>
                    <p style={{margin: 0, fontSize: '14px', color: '#64748b'}}>Awaiting Staff Review</p>
                  </div>
                  <button 
                    style={styles.viewBtn} 
                    className="hover-btn" 
                    onClick={() => {
                      setViewingApplicationId(viewingApplicationId === user.id ? null : user.id);
                      resetForms();
                    }}
                  >
                    {viewingApplicationId === user.id ? 'Close Application' : 'View Full Application'}
                  </button>
                </div>

                {viewingApplicationId === user.id && (
                  <div style={{marginTop: '15px', borderTop: '1px solid #e2e8f0'}}>
                    <div style={styles.detailsGrid}>
                      <div style={styles.detailItem}><strong>Category:</strong> {user.category ? `Code ${user.category.toUpperCase()}` : 'N/A'}</div>
                      <div style={styles.detailItem}><strong>First Name:</strong> {user.firstName || 'N/A'}</div>
                      <div style={styles.detailItem}><strong>Last Name:</strong> {user.lastName || 'N/A'}</div>
                      <div style={styles.detailItem}><strong>Middle Initial:</strong> {user.middleInitial || 'N/A'}</div>
                      <div style={styles.detailItem}><strong>Date of Birth:</strong> {user.dob || 'N/A'}</div>
                      <div style={styles.detailItem}><strong>Email:</strong> {user.email}</div>
                      <div style={styles.detailItem}><strong>Contact Number:</strong> {user.contact || 'N/A'}</div>
                      <div style={styles.detailItem}><strong>Home Address:</strong> {user.address || 'N/A'}</div>
                      <div style={styles.detailItem}><strong>Occupation:</strong> {user.occupation || 'N/A'}</div>
                      <div style={styles.detailItem}><strong>Number of Children:</strong> {user.childrenCount || 'N/A'}</div>

                      <div style={styles.imagePlaceholderContainer}>
                        {user.documents && Object.keys(user.documents).length > 0 ? (
                          Object.entries(user.documents).map(([reqName, fileUrl]) => (
                            <DocumentViewer key={reqName} reqName={reqName} fileUrl={fileUrl} styles={styles} />
                          ))
                        ) : (
                          <div style={{...styles.imageBox, padding: '20px'}}>No documents uploaded.</div>
                        )}
                      </div>
                    </div>

                    {/* APPROVAL & DENIAL FORMS */}
                    {!selectedUserForDeny && !selectedUserForApprove ? (
                      <div style={styles.btnGroup}>
                        <button style={styles.approveBtn} className="hover-btn" onClick={() => setSelectedUserForApprove(user)}>Approve Registration</button>
                        <button style={styles.denyBtn} className="hover-btn" onClick={() => setSelectedUserForDeny(user)}>Deny Registration</button>
                      </div>
                    ) : null}

                    {/* Approve Form */}
                    {selectedUserForApprove?.id === user.id && (
                      <form onSubmit={(e) => handleApproveSubmit(e, user)} style={{marginTop: '15px', padding: '15px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0'}}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#065f46' }}>Issue Official Solo Parent ID</h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{fontWeight: 'bold', fontSize: '13px', color: '#065f46'}}>Official SP ID Number:</label>
                            <input type="text" style={styles.input} placeholder="e.g., SP-2026-001" value={approveForm.spId} onChange={(e) => setApproveForm({...approveForm, spId: e.target.value})} required />
                          </div>
                          <div>
                            <label style={{fontWeight: 'bold', fontSize: '13px', color: '#065f46'}}>Issue Date:</label>
                            <input type="date" style={styles.input} value={approveForm.issueDate} onChange={(e) => setApproveForm({...approveForm, issueDate: e.target.value})} required />
                          </div>
                          <div>
                            <label style={{fontWeight: 'bold', fontSize: '13px', color: '#065f46'}}>Expiry Date (Valid 1 Year):</label>
                            <input type="date" style={styles.input} value={approveForm.expiryDate} onChange={(e) => setApproveForm({...approveForm, expiryDate: e.target.value})} required />
                          </div>
                        </div>

                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                          <button type="submit" style={{...styles.submitBtn, background: '#16a34a'}} className="hover-btn">Confirm & Issue ID</button>
                          <button type="button" style={{...styles.submitBtn, background: '#64748b'}} onClick={resetForms}>Cancel</button>
                        </div>
                      </form>
                    )}

                    {/* Deny Form */}
                    {selectedUserForDeny?.id === user.id && (
                      <form onSubmit={(e) => handleDenySubmit(e, user)} style={{marginTop: '15px', padding: '15px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca'}}>
                        <label style={{fontWeight: 'bold', fontSize: '14px', color: '#dc2626'}}>Reason for Denial (Will be sent to user):</label>
                        <input type="text" style={styles.input} placeholder="e.g., Missing valid ID, Incorrect details..." value={denyReason} onChange={(e) => setDenyReason(e.target.value)} required />
                        <div style={{display: 'flex', gap: '10px'}}>
                          <button type="submit" style={styles.submitDenyBtn} className="hover-btn">Confirm & Send Denial</button>
                          <button type="button" style={{...styles.submitDenyBtn, background: '#64748b'}} onClick={resetForms}>Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <button style={styles.backBtn} className="hover-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}

export default PendingRegistrationsPage;