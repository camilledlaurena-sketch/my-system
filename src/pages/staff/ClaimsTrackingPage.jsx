import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, addDoc, onSnapshot, query, where, orderBy, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// CLAIMS TRACKING PAGE (STAFF/ADMIN)
// ==========================================
function ClaimsTrackingPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  const [activeTab, setActiveTab] = useState('subsidy'); // 'subsidy' or 'education'
  const [fundBalance, setFundBalance] = useState(0);
  const [claims, setClaims] = useState([]);
  
  // Modal & Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvedSPs, setApprovedSPs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    selectedSp: null,
    benefitType: 'Subsidy for Indigent Solo Parent Members',
    amount: ''
  });

  // Benefit Constants
  const BENEFIT_SUBSIDY = 'Subsidy for Indigent Solo Parent Members';
  const BENEFIT_EDUCATION = 'Educational Assistance for one (1) child of a Solo Parent';

  // 1. Fetch & Listen to Fund Balance (Real-time)
  useEffect(() => {
    const fundRef = doc(db, 'system_config', 'funds');
    
    const unsubscribe = onSnapshot(fundRef, (docSnap) => {
      if (docSnap.exists()) {
        setFundBalance(docSnap.data().balance || 0);
      } else {
        // Initialize default fund if it doesn't exist
        setDoc(fundRef, { balance: 2400000 });
        setFundBalance(2400000);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch & Listen to Claims (Real-time)
  useEffect(() => {
    const claimsQuery = query(collection(db, 'claims'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(claimsQuery, (snapshot) => {
      const claimsData = [];
      snapshot.forEach(doc => claimsData.push({ id: doc.id, ...doc.data() }));
      setClaims(claimsData);
    });

    return () => unsubscribe();
  }, []);

  // 3. Fetch Approved Solo Parents for Search/Selection (One-time fetch on load)
  useEffect(() => {
    const fetchApprovedSPs = async () => {
      try {
        const spQuery = query(collection(db, 'soloparent'), where('status', '==', 'approved'));
        const spSnapshot = await getDocs(spQuery);
        const spList = [];
        spSnapshot.forEach(doc => spList.push({ id: doc.id, ...doc.data() }));
        setApprovedSPs(spList);
      } catch (error) {
        console.error("Error fetching approved SPs:", error);
      }
    };
    fetchApprovedSPs();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  // Filter SPs based on search query
  const filteredSPs = approvedSPs.filter(sp => 
    sp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (sp.idNumber && sp.idNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!formData.selectedSp) return alert("Please select a Solo Parent from the search results.");
    if (!formData.amount || Number(formData.amount) <= 0) return alert("Please enter a valid amount.");
    
    const claimAmount = Number(formData.amount);
    
    if (claimAmount > fundBalance) {
      return alert("Insufficient funds for this claim.");
    }

    setIsSubmitting(true);
    try {
      // 1. Record the claim
      await addDoc(collection(db, 'claims'), {
        spId: formData.selectedSp.id,
        spName: formData.selectedSp.name,
        spNumber: formData.selectedSp.idNumber || 'Pending ID',
        benefitType: formData.benefitType,
        amount: claimAmount,
        date: new Date().toISOString(),
        recordedBy: userData?.name || 'Staff'
      });

      // 2. Safely deduct from global fund balance
      const fundRef = doc(db, 'system_config', 'funds');
      await updateDoc(fundRef, {
        balance: increment(-claimAmount)
      });

      alert("Claim recorded successfully and funds deducted.");
      setShowAddModal(false);
      setFormData({ selectedSp: null, benefitType: BENEFIT_SUBSIDY, amount: '' });
      setSearchQuery('');
      
    } catch (error) {
      console.error("Error processing claim:", error);
      alert("Failed to process claim. " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter claims based on the active tab
  const displayedClaims = claims.filter(claim => 
    activeTab === 'subsidy' ? claim.benefitType === BENEFIT_SUBSIDY : claim.benefitType === BENEFIT_EDUCATION
  );

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    container: { maxWidth: '1000px', width: '100%' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
    title: { color: '#1e3a8a', fontSize: '28px', fontWeight: '900', margin: 0 },
    backBtn: { background: '#e2e8f0', color: '#334155', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    
    fundCard: { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 10px 20px rgba(30,58,138,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '250px' },
    
    tabsRow: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0' },
    tabBtn: { padding: '12px 24px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', position: 'relative' },
    
    contentCard: { background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
    topActionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    recordBtn: { background: '#16a34a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 'bold' },
    td: { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#334155' },
    
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    modalContent: { background: 'white', width: '100%', maxWidth: '550px', borderRadius: '12px', padding: '24px', boxSizing: 'border-box' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' },
    
    searchResults: { border: '1px solid #cbd5e1', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', marginTop: '5px', background: 'white' },
    searchItem: { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '13px' },
    
    modalBtnGroup: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }
  };

  return (
    <div style={styles.body} className="anim-fade-in">
      <div style={styles.container}>
        
        {/* HEADER */}
        <div style={styles.headerRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={styles.backBtn} className="hover-btn" onClick={() => navigate(-1)}>← Back</button>
            <h2 style={styles.title}>Claims Tracking</h2>
          </div>
          
          <div style={styles.fundCard} className="anim-slide-up">
            <span style={{ fontSize: '13px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Available Fund Balance</span>
            <span style={{ fontSize: '28px', fontWeight: '900' }}>{formatCurrency(fundBalance)}</span>
          </div>
        </div>

        {/* TABS */}
        <div style={styles.tabsRow}>
          <button 
            style={{ ...styles.tabBtn, color: activeTab === 'subsidy' ? '#1e3a8a' : '#64748b', borderBottom: activeTab === 'subsidy' ? '3px solid #1e3a8a' : '3px solid transparent' }} 
            onClick={() => setActiveTab('subsidy')}
          >
            Subsidy for Indigents
          </button>
          <button 
            style={{ ...styles.tabBtn, color: activeTab === 'education' ? '#1e3a8a' : '#64748b', borderBottom: activeTab === 'education' ? '3px solid #1e3a8a' : '3px solid transparent' }} 
            onClick={() => setActiveTab('education')}
          >
            Educational Assistance
          </button>
        </div>

        {/* CONTENT AREA */}
        <div style={styles.contentCard} className="anim-slide-up">
          <div style={styles.topActionRow}>
            <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px' }}>
              {activeTab === 'subsidy' ? 'Recorded Subsidy Claims' : 'Recorded Educational Claims'}
            </h3>
            <button style={styles.recordBtn} className="hover-btn" onClick={() => setShowAddModal(true)}>
              + Record New Claim
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>SP ID Number</th>
                  <th style={styles.th}>Solo Parent Name</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {displayedClaims.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No claims recorded for this benefit yet.
                    </td>
                  </tr>
                ) : (
                  displayedClaims.map(claim => (
                    <tr key={claim.id} className="hover-card" style={{ transition: 'none' }}>
                      <td style={styles.td}>{new Date(claim.date).toLocaleDateString()}</td>
                      <td style={styles.td}><strong>{claim.spNumber}</strong></td>
                      <td style={styles.td}>{claim.spName}</td>
                      <td style={{ ...styles.td, color: '#16a34a', fontWeight: 'bold' }}>{formatCurrency(claim.amount)}</td>
                      <td style={styles.td}>{claim.recordedBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RECORD NEW CLAIM MODAL */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="anim-slide-up">
            <h3 style={{ margin: '0 0 20px 0', color: '#1e3a8a', fontSize: '22px' }}>Record Financial Claim</h3>
            
            <form onSubmit={handleSubmitClaim}>
              
              {/* 1. Solo Parent Search */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Search Approved Solo Parent (Name or ID)</label>
                {!formData.selectedSp ? (
                  <>
                    <input 
                      type="text" 
                      style={styles.input} 
                      placeholder="Type to search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery.trim() !== '' && (
                      <div style={styles.searchResults}>
                        {filteredSPs.length > 0 ? filteredSPs.map(sp => (
                          <div 
                            key={sp.id} 
                            style={styles.searchItem}
                            onClick={() => {
                              setFormData({ ...formData, selectedSp: sp });
                              setSearchQuery('');
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                          >
                            <strong>{sp.name}</strong> <span style={{ color: '#64748b' }}>({sp.idNumber || 'No ID yet'})</span>
                          </div>
                        )) : (
                          <div style={{ padding: '10px', fontSize: '13px', color: '#64748b' }}>No approved users found.</div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <span style={{ color: '#065f46', fontWeight: 'bold' }}>{formData.selectedSp.name}</span>
                      <div style={{ fontSize: '12px', color: '#047857' }}>{formData.selectedSp.idNumber || 'No ID yet'}</div>
                    </div>
                    <button type="button" style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }} onClick={() => setFormData({ ...formData, selectedSp: null })}>
                      Change User
                    </button>
                  </div>
                )}
              </div>
              
              {/* 2. Benefit Type Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Benefit Category</label>
                <select 
                  style={styles.input} 
                  value={formData.benefitType} 
                  onChange={(e) => setFormData({...formData, benefitType: e.target.value})} 
                  required
                >
                  <option value={BENEFIT_SUBSIDY}>{BENEFIT_SUBSIDY}</option>
                  <option value={BENEFIT_EDUCATION}>{BENEFIT_EDUCATION}</option>
                </select>
              </div>

              {/* 3. Amount Input */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Amount to Disburse (PHP)</label>
                <input 
                  type="number" 
                  style={styles.input} 
                  placeholder="e.g. 1000" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                  min="1"
                  required 
                />
              </div>

              <div style={styles.modalBtnGroup}>
                <button type="button" style={{...styles.backBtn, background: '#f1f5f9'}} onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                  setFormData({ selectedSp: null, benefitType: BENEFIT_SUBSIDY, amount: '' });
                }}>
                  Cancel
                </button>
                <button type="submit" style={{...styles.recordBtn, opacity: isSubmitting ? 0.7 : 1}} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Confirm & Deduct Fund'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ClaimsTrackingPage;