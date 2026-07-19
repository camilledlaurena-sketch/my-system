import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { soloParentCategories } from './CategoriesPage';

function PublicRegisterPage({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || '');
  const [documentFiles, setDocumentFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState({});

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', middleInitial: '', dob: '', address: '',
    contact: '', email: '', childrenCount: '', occupation: '', password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const activeCategoryObj = soloParentCategories.find(c => c.code === selectedCategory);

  // COMPACT STYLES WITH HOVER EFFECTS
  const styles = {
    container: {
      width: '100%', padding: '25px', borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(25px)',
      boxShadow: '0 25px 70px rgba(0,0,0,0.4)', border: '1px solid rgba(37, 99, 235, 0.2)',
      position: 'relative', maxHeight: '85vh', overflowY: 'auto'
    },
    title: { color: '#1e3a8a', marginTop: '0', fontSize: '22px', fontWeight: '900', marginBottom: '15px', textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    fullWidth: { gridColumn: '1 / -1' },
    formGroup: { marginBottom: '12px', position: 'relative' },
    label: {
      position: 'absolute', left: '12px', pointerEvents: 'none',
      top: '12px', fontSize: '14px', color: '#64748b', fontWeight: '600',
      transition: 'all 0.2s', background: '#f8fafc', padding: '0 4px'
    },
    input: {
      width: '100%', padding: '14px 12px', borderRadius: '10px',
      border: '2px solid #e2e8f0', boxSizing: 'border-box',
      background: '#f8fafc', fontSize: '14px', outline: 'none', transition: 'all 0.2s'
    },
    fileBox: {
      border: '2px dashed #1e3a8a', padding: '10px', textAlign: 'center',
      borderRadius: '10px', background: '#eff6ff', transition: 'all 0.2s'
    },
    button: {
      background: isSubmitting? '#cbd5e1' : 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
      color: '#1e3a8a', padding: '14px', border: 'none', borderRadius: '12px',
      cursor: isSubmitting? 'not-allowed' : 'pointer', fontWeight: '800', width: '100%',
      marginTop: '15px', fontSize: '15px', transition: 'transform 0.2s'
    },
    linkText: { textAlign: 'center', marginTop: '12px', display: 'block', color: '#1e3a8a', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }
  };

  const FloatingInput = ({id, label, type = "text", required = false}) => (
    <div style={styles.formGroup}>
      <input
        id={id} type={type} required={required}
        style={{
         ...styles.input,
          borderColor: focused[id]? '#2563eb' : '#e2e8f0',
          boxShadow: focused[id]? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none'
        }}
        value={formData[id] || ''}
        onChange={(e) => setFormData({...formData, [id]: e.target.value})}
        onFocus={() => setFocused({...focused, [id]: true})}
        onBlur={() => setFocused({...focused, [id]: formData[id]!== ''})}
      />
      <label style={{
       ...styles.label,
        top: (focused[id] || formData[id])? '-8px' : '14px',
        fontSize: (focused[id] || formData[id])? '11px' : '14px',
        color: focused[id]? '#2563eb' : '#64748b',
      }}>{label}</label>
    </div>
  )

  const handleFileChange = (e, reqName) => {
    const file = e.target.files[0];
    if (file) setDocumentFiles(prev => ({...prev, [reqName]: file }));
  };

  const validatePassword = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) return alert("Please select a Solo Parent Category first.");
    if (!validatePassword(formData.password)) {
      setPasswordError("Password must be 8+ chars, 1 uppercase, 1 lowercase, 1 number.");
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
        const data = await response.json();
        return { reqName, downloadURL: data.secure_url };
      });

      const uploadedResults = await Promise.all(uploadPromises);
      uploadedResults.forEach(result => { uploadedDocs[result.reqName] = result.downloadURL; });

      const fullName = `${formData.firstName} ${formData.middleInitial}. ${formData.lastName}`;
      await setDoc(doc(db, 'pending_users', user.uid), {
        name: fullName,...formData, category: selectedCategory, documents: uploadedDocs,
        role: 'soloparent', status: 'pending', denyReason: '', registrationDate: new Date().toISOString()
      });

      alert(`Registration submitted successfully! Please wait for staff approval.`);
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register. ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container} className="anim-slide-up">
      <button onClick={onClose} style={{
        position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.05)',
        border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
        color: '#1e3a8a', fontSize: '18px', transition: 'all 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
      >✕</button>

      <h2 style={styles.title}>Solo Parent Registration</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>

          {/* CATEGORY */}
          <div style={styles.fullWidth}>
            <select
              style={{...styles.input, appearance: 'none'}}
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setDocumentFiles({}); }}
              required
            >
              <option value="" disabled>-- Select Solo Parent Category --</option>
              {soloParentCategories.map(cat => (
                <option key={cat.code} value={cat.code}> Code {cat.code.toUpperCase()} - {cat.title} </option>
              ))}
            </select>
          </div>

          <FloatingInput id="firstName" label="First Name" required />
          <FloatingInput id="lastName" label="Last Name" required />
          <FloatingInput id="middleInitial" label="M.I." />
          <FloatingInput id="dob" label="Date of Birth" type="date" required />

          <div style={styles.fullWidth}><FloatingInput id="address" label="Home Address" required /></div>

          <FloatingInput id="contact" label="Contact Number" required />
          <FloatingInput id="email" label="Email Address" type="email" required />

          <FloatingInput id="occupation" label="Occupation" />
          <FloatingInput id="childrenCount" label="No. of Children" type="number" />

          {/* PASSWORD */}
          <div style={{...styles.formGroup,...styles.fullWidth}}>
            <input
              type={showPassword? "text" : "password"}
              style={{...styles.input, paddingRight: '40px', borderColor: passwordError? '#dc2626' : (focused['password']? '#2563eb' : '#e2e8f0')}}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              onFocus={() => setFocused({...focused, password: true})}
              onBlur={() => setFocused({...focused, password: formData.password!== ''})}
              required
            />
            <label style={{
             ...styles.label,
              top: (focused['password'] || formData.password)? '-8px' : '14px',
              fontSize: (focused['password'] || formData.password)? '11px' : '14px',
              color: passwordError? '#dc2626' : (focused['password']? '#2563eb' : '#64748b'),
            }}>Password</label>
            <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '14px', cursor: 'pointer', fontSize: '18px' }} > {showPassword? '👁️' : '🔒'} </span>
            {passwordError && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', fontWeight: 'bold' }}> {passwordError} </div>}
          </div>

          {/* UPLOAD */}
          <div style={styles.fullWidth}>
            <label style={{...styles.label, position: 'static', background: 'none', fontSize: '13px', color: '#1e3a8a', marginBottom: '8px', display: 'block'}}> Upload Requirements for: {activeCategoryObj?.title || 'Select Category First'} </label>
            {activeCategoryObj && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '8px'}}>
                {activeCategoryObj.requirements.map((req, idx) => (
                  <div key={idx} style={styles.fileBox}>
                    <span style={{fontSize: '11px', color: '#1e3a8a', display: 'block', marginBottom: '6px', fontWeight: 'bold'}}>{req}</span>
                    <input type="file" accept="image/*,application/pdf" style={{width: '100%', fontSize: '10px'}} onChange={(e) => handleFileChange(e, req)} required />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={isSubmitting}
          onMouseOver={(e) =>!isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {isSubmitting? 'Uploading Documents...' : 'Submit Registration'}
        </button>

        <Link to="/login" style={styles.linkText}>Already have an account? Login here</Link>
      </form>
    </div>
  )
}
export default PublicRegisterPage;