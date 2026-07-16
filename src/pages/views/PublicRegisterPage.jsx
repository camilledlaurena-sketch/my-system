import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { soloParentCategories } from './CategoriesPage';

// ==========================================
// PUBLIC REGISTER PAGE
// ==========================================
function PublicRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || '');
  const [documentFiles, setDocumentFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    dob: '',
    address: '',
    contact: '',
    email: '',
    childrenCount: '',
    occupation: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleFileChange = (e, reqName) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFiles(prev => ({...prev, [reqName]: file }));
    }
  };

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      return alert("Please select a Solo Parent Category first.");
    }
    if (!validatePassword(formData.password)) {
      setPasswordError("Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, and 1 number.");
      return;
    }
    setPasswordError('');
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      const uploadedDocs = {};
      const cloudName = 'dfcemnno8';
      const uploadPreset = 'soloparent_uploads';
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      
      const uploadPromises = Object.entries(documentFiles).map(async ([reqName, file]) => {
        const fetchFormData = new FormData();
        fetchFormData.append('file', file);
        fetchFormData.append('upload_preset', uploadPreset);
        fetchFormData.append('folder', `requirements/${user.uid}`);
        const response = await fetch(cloudinaryUrl, { method: 'POST', body: fetchFormData });
        if (!response.ok) {
          throw new Error(`Cloudinary upload failed for ${reqName}`);
        }
        const data = await response.json();
        return { reqName, downloadURL: data.secure_url };
      });
      
      const uploadedResults = await Promise.all(uploadPromises);
      uploadedResults.forEach(result => {
        uploadedDocs[result.reqName] = result.downloadURL;
      });
      
      const fullName = `${formData.firstName} ${formData.middleInitial}. ${formData.lastName}`;
      await setDoc(doc(db, 'pending_users', user.uid), {
        name: fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleInitial: formData.middleInitial,
        dob: formData.dob,
        address: formData.address,
        contact: formData.contact,
        email: formData.email,
        childrenCount: formData.childrenCount,
        occupation: formData.occupation,
        category: selectedCategory,
        documents: uploadedDocs,
        role: 'soloparent',
        status: 'pending',
        denyReason: '',
        registrationDate: new Date().toISOString()
      });
      
      alert(`Registration submitted successfully! Please wait for staff approval.`);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register. ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      background: 'transparent', // <-- BINAGO: from #f8fafc to transparent para walang background sa modal
      minHeight: 'auto', // <-- BINAGO: from 100vh to auto
      padding: '0' // <-- BINAGO: from 40px to 0
    },
    container: {
      width: '100%', // <-- BINAGO: from maxWidth 800px to 100%
      padding: '25px', // <-- BINAGO: from 40px to 25px para mas compact
      borderRadius: '16px',
      background: '#ffffff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)', // <-- MAS MALAKAS NA SHADOW PARA LUMUTANG
      borderTop: '6px solid #fbbf24'
    },
    title: {
      color: '#1e3a8a',
      marginTop: '0',
      fontSize: '24px', // <-- BINAGO: from 28px to 24px mas maliit
      fontWeight: '900',
      marginBottom: '20px', // <-- BINAGO: from 25px to 20px
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px' // <-- BINAGO: from 15px to 12px mas siksik
    },
    fullWidth: {
      gridColumn: '1 / -1'
    },
    formGroup: {
      marginBottom: '12px' // <-- BINAGO: from 15px to 12px
    },
    label: {
      display: 'block',
      marginBottom: '6px', // <-- BINAGO: from 8px to 6px
      fontWeight: 'bold',
      color: '#1e3a8a',
      fontSize: '13px' // <-- BINAGO: from 14px to 13px
    },
    input: {
      width: '100%',
      padding: '10px', // <-- BINAGO: from 12px to 10px
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      boxSizing: 'border-box',
      background: '#f8fafc',
      fontSize: '13px' // <-- BINAGO: from 14px to 13px
    },
    fileBox: {
      border: '2px dashed #1e3a8a',
      padding: '12px', // <-- BINAGO: from 15px to 12px
      textAlign: 'center',
      borderRadius: '8px',
      background: '#eff6ff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    button: {
      background: isSubmitting? '#cbd5e1' : '#fbbf24',
      color: '#1e3a8a',
      padding: '12px', // <-- BINAGO: from 14px to 12px
      border: 'none',
      borderRadius: '8px',
      cursor: isSubmitting? 'not-allowed' : 'pointer',
      fontWeight: 'bold',
      width: '100%',
      marginTop: '15px', // <-- BINAGO: from 20px to 15px
      fontSize: '15px' // <-- BINAGO: from 16px to 15px
    },
    linkText: {
      textAlign: 'center',
      marginTop: '12px', // <-- BINAGO: from 15px to 12px
      display: 'block',
      color: '#1e3a8a',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '13px' // <-- DAGDAG
    }
  };

  const activeCategoryObj = soloParentCategories.find(c => c.code === selectedCategory);

return (
  <div style={styles.container} className="anim-slide-up"> {/* <-- TINANGGAL KO NA YUNG styles.body DITO */}
    <h2 style={styles.title}>Solo Parent Registration</h2>
    
    <form onSubmit={handleSubmit}>
      <div style={styles.grid}>
        <div style={{...styles.formGroup, ...styles.fullWidth}}>
          <label style={styles.label}>Selected Solo Parent Category</label>
          <select 
            style={styles.input} 
            value={selectedCategory} 
            onChange={(e) => { 
              setSelectedCategory(e.target.value); 
              setDocumentFiles({}); 
            }} 
            required
          >
            <option value="" disabled>-- Select a Category --</option>
            {soloParentCategories.map(cat => (
              <option key={cat.code} value={cat.code}>
                Code {cat.code.toUpperCase()} - {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>First Name</label>
          <input type="text" style={styles.input} value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name</label>
          <input type="text" style={styles.input} value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Middle Initial</label>
          <input type="text" style={styles.input} maxLength="2" value={formData.middleInitial} onChange={(e) => setFormData({...formData, middleInitial: e.target.value})} placeholder="e.g. S." required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Date of Birth</label>
          <input type="date" style={styles.input} value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} required />
        </div>
        
        <div style={{...styles.formGroup, ...styles.fullWidth}}>
          <label style={styles.label}>Home Address</label>
          <input type="text" style={styles.input} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Contact Number</label>
          <input type="text" style={styles.input} value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input type="email" style={styles.input} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Source of Income / Occupation</label>
          <input type="text" style={styles.input} value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Children</label>
          <input type="number" style={styles.input} value={formData.childrenCount} onChange={(e) => setFormData({...formData, childrenCount: e.target.value})} required />
        </div>
        
        <div style={{...styles.formGroup, ...styles.fullWidth}}>
          <label style={styles.label}>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              style={{ ...styles.input, paddingRight: '40px', borderColor: passwordError ? '#dc2626' : '#cbd5e1' }} 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
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
          {passwordError && (
            <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', fontWeight: 'bold' }}>
              {passwordError}
            </div>
          )}
        </div>

        <div style={{...styles.formGroup, ...styles.fullWidth}}>
          <label style={{...styles.label, borderBottom: '2px solid #cbd5e1', paddingBottom: '5px'}}>
            Upload Specific Requirements for your Category
          </label>
          {!activeCategoryObj ? (
            <p style={{fontSize: '14px', color: '#dc2626'}}>Please select a Solo Parent Category above to see required documents.</p>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '15px'}}> {/* <-- PINALIIT KO YUNG minmax at gap */}
              {activeCategoryObj.requirements.map((req, idx) => (
                <div key={idx} style={styles.fileBox}>
                  <span style={{fontSize: '12px', color: '#1e3a8a', display: 'block', marginBottom: '10px', fontWeight: 'bold'}}>{req}</span>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf" 
                    style={{width: '100%', fontSize: '11px'}} 
                    onChange={(e) => handleFileChange(e, req)} 
                    required 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button type="submit" style={styles.button} className="hover-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading Documents & Registering...' : 'Submit Registration'}
      </button>
      
      <Link to="/login" style={styles.linkText}>Already have an account? Login here</Link>
      <Link to="/categories" style={{...styles.linkText, fontSize:'12px', marginTop:'5px'}}>Cancel and go back to Categories</Link>
    </form>
  </div>
);
}

export default PublicRegisterPage;