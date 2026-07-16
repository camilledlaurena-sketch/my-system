import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import PublicRegisterPage from './PublicRegisterPage';
import LoginPage from './LoginPage';

// ==========================================
// FRONT PAGE NAV CONFIGURATION DATA (PLACEHOLDERS)
// ==========================================
const navConfig = {
  aboutUs: {
    whoWeAre: { title: "Who We Are", videoPlaceholder: "Video coming soon" },
    missionVision: { title: "Mission & Vision", textPlaceholder: "Mission and Vision content will be placed here." }
  },
  innovations: {
    recentProjects: [
      { title: "Project Title 1", desc: "Project description coming soon." },
      { title: "Project Title 2", desc: "Project description coming soon." }
    ],
    techSolutions: { title: "Tech Solutions", textPlaceholder: "Tech Solutions content will be placed here." }
  },
  programsAndServices: ["Program 1", "Program 2", "Program 3"],
  categoriesAndCodes: [
    { code: "Code A", documents: ["Document 1", "Document 2", "Document 3"] },
    { code: "Code B", documents: ["Document 1", "Document 2", "Document 3"] },
    { code: "Code C", documents: ["Document 1", "Document 2", "Document 3"] }
  ],
  contactUs: {
    address: "Address: Naic, Cavite",
    phone: "Phone: (046) 890 2435",
    email: "Email: dswdnaiccavite@yahoo.com"
  }
};

// ==========================================
// FRONT PAGE HERO CONFIGURATION DATA
// ==========================================
const heroConfig = {
  backgroundImages: [
    "/vids/pic1.jpg",
    "/vids/pic2.jpg",
    "/vids/pic3.jpg",
    "/vids/pic4.jpg"
  ],
  posterImg: "/vids/soloparent-logo.png",
  title: "",
  subtitle: ""
};

// ==========================================
// LANDING PAGE COMPONENT
// ==========================================
function LandingPage() {
  const navigate = useNavigate();
  const { userRole, userData } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroConfig.backgroundImages.length);
    }, 4000); // 4 seconds bawat image
    return () => clearInterval(interval);
  }, []);

  const [showDropdown, setShowDropdown] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero Modal & Login States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Securely redirect based on AuthContext state
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

  const handleRegister = async (e) => {
    e.preventDefault();
    alert("Register clicked! Email: " + email); // pang test muna
    setShowRegisterModal(false);
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

  const toggleDropdown = (menuName) => {
    if (showDropdown === menuName) {
      setShowDropdown(null);
    } else {
      setShowDropdown(menuName);
      setExpandedCode(null);
    }
  };

  const styles = {
    body: { fontFamily: 'Poppins, sans-serif', background: '#f4f7fc', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'auto', overflowY: 'auto' },
    header: {
      background: '#ffffff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderBottom: '4px solid #fbbf24', position: 'relative', zIndex: 10, flexWrap: 'wrap', flexDirection: 'row'
    },
    logoTitle: { color: '#1e3a8a', margin: 0, fontSize: '24px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', minWidth: 'max-content' },
    navContainer: { display: 'flex', gap: '35px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: 1, flexDirection: 'row' },
    mobileMenuBtn: { display: 'none', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#1e3a8a' },
    navItem: { position: 'relative', cursor: 'pointer', color: '#1e3a8a', fontWeight: 'bold', fontSize: '14px', padding: '10px 12px', userSelect: 'none' },
    dropdownMenu: { position: 'absolute', top: '100%', left: '0', background: '#1e3a8a', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '10px 0', minWidth: '300px', display: 'flex', flexDirection: 'column', textAlign: 'left', zIndex: 100 },
    dropdownMenuRight: { position: 'absolute', top: '100%', right: '0', background: '#1e3a8a', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '10px 0', minWidth: '300px', display: 'flex', flexDirection: 'column', textAlign: 'left', zIndex: 100 },
    dropdownSection: { padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' },
    videoPlaceholder: { background: '#94a3b8', height: '120px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', fontSize: '14px', marginTop: '10px', fontWeight: 'bold' },
    placeholderText: { fontSize: '13px', margin: '5px 0 0 0', color: '#cbd5e1' },
    cardContainer: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
    imageCardPlaceholder: { background: '#f1f5f9', padding: '15px', borderRadius: '6px', color: '#334155' },
    eventCard: { background: 'rgba(255,255,255,0.1)', padding: '15px', margin: '10px 15px', borderRadius: '6px', color: '#ffffff' },
    dropdownItem: { padding: '12px 20px', color: '#ffffff', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' },
    accordionContent: { marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' },
    navButtons: { display: 'flex', gap: '10px', minWidth: 'max-content' },
    navItemWhite: { color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', position: 'relative', padding: '15px 0', transition: 'opacity 0.2s' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0', zIndex: 1, position: 'relative' },
    heroTitle: { color: '#1e3a8a', fontSize: '48px', fontWeight: '900', marginBottom: '20px' },
    heroSub: { color: '#475569', fontSize: '18px', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' },
    btnGroup: { display: 'flex', gap: '20px', justifyContent: 'center' },
    btnPrimary: { background: '#fbbf24', color: '#1e3a8a', padding: '15px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    btnSecondary: { background: '#ffffff', color: '#1e3a8a', padding: '15px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '2px solid #1e3a8a', cursor: 'pointer', fontSize: '18px' },
    infoBox: { background: '#f8fafc', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #fbbf24', margin: '10px', textAlign: 'left', color: '#334155', fontSize: '14px', lineHeight: '1.6' }
  };

  return (
    <div style={styles.body} className="anim-fade-in landing-page-wrapper">

      <style>{`
      @media (max-width: 900px) {
        header { flex-direction: row !important; padding: 10px 15px !important; justify-content: center !important; flex- }
        .nav-item-dropdown { position: static !important; width: 100% !important; min-width: 100% !important; }
        .hover-underline-link:hover { text-decoration: underline !important; }
      }
    
      /* Hide the scrollbar exclusively for the Landing Page wrapper */
      .landing-page-wrapper::-webkit-scrollbar { display: none; }
      .landing-page-wrapper { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>

      {/* ===== HEADER PUTI ===== */}
      <header style={{
        background: '#ffffff',
        padding: '12px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>


        {/* KALIWA: Logo + Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={heroConfig.posterImg}
            alt="Solo Parent Logo"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
          <div>
            <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: '900' }}>SOLO PARENT SYSTEM</h3>
            <p style={{ margin: 0, color: '#b45309', fontSize: '11px', fontWeight: '700' }}>DEPARTMENT OF SOCIAL WELFARE AND DEVELOPMENT</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '10px' }}>Republic of the Philippines</p>
          </div>
        </div>

        {/* KAN: Buttons lang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            padding: '8px 18px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            background: '#fff',
            color: '#1e3a8a',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer'
          }} onClick={() => setShowLoginModal(true)}>
            Log In
          </button>

          <button style={{
            padding: '8px 18px',
            border: 'none',
            borderRadius: '6px',
            background: '#d97706',
            color: '#fff',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer'
          }} onClick={() => setShowRegisterModal(true)}>
            Register
          </button>
        </div>
      </header>

      <nav style={{
        background: 'linear-gradient(90deg, #1e40af 0%, #2563eb 100%)', /* DARK BLUE GAYA SA PIC MO */
        padding: '0 60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50px',
        gap: '50px',
        position: 'relative',
        zIndex: 50,
      }} onClick={() => setShowDropdown(null)}>

        <div style={styles.navItemWhite} onClick={() => navigate('/')}>
          Home
        </div>

        <div style={styles.navItemWhite} onClick={(e) => { e.stopPropagation(); toggleDropdown('about') }}>
          About Us ▼
          {showDropdown === 'about' && (
            <div style={styles.dropdownMenu} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
              <div style={styles.dropdownSection}>
                <strong>{navConfig.aboutUs.whoWeAre.title}</strong>
                <div style={styles.videoPlaceholder}>{navConfig.aboutUs.whoWeAre.videoPlaceholder}</div>
              </div>
              <div style={styles.dropdownSection}>
                <strong>{navConfig.aboutUs.missionVision.title}</strong>
                <p style={styles.placeholderText}>{navConfig.aboutUs.missionVision.textPlaceholder}</p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.navItemWhite} onClick={(e) => { e.stopPropagation(); toggleDropdown('innov') }}>
          Innovations ▼
          {showDropdown === 'innov' && (
            <div style={styles.dropdownMenuRight} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
              <div style={styles.dropdownSection}>
                <strong>Recent Projects</strong>
                <div style={styles.cardContainer}>
                  {navConfig.innovations.recentProjects.map((proj, i) => (
                    <div key={i} style={styles.imageCardPlaceholder}>
                      <strong style={{ color: '#1e3a8a' }}>{proj.title}</strong>
                      <p style={{ fontSize: '12px', margin: '5px 0 0' }}>{proj.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.dropdownSection}>
                <strong>{navConfig.innovations.techSolutions.title}</strong>
                <p style={styles.placeholderText}>{navConfig.innovations.techSolutions.textPlaceholder}</p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.navItemWhite} onClick={(e) => { e.stopPropagation(); toggleDropdown('programs') }}>
          Programs and Services ▼
          {showDropdown === 'programs' && (
            <div style={styles.dropdownMenu} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
              {navConfig.programsAndServices.map((prog, i) => (
                <div key={i} style={styles.dropdownItem}>{prog}</div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.navItemWhite} onClick={(e) => { e.stopPropagation(); toggleDropdown('categories') }}>
          Categories and Codes ▼
          {showDropdown === 'categories' && (
            <div style={styles.dropdownMenuRight} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
              {navConfig.categoriesAndCodes.map((cat, i) => (
                <div key={i} style={{ ...styles.dropdownItem, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div onClick={() => setExpandedCode(expandedCode === cat.code ? null : cat.code)} style={{ cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    {cat.code} <span style={{ fontSize: '16px' }}>{expandedCode === cat.code ? '−' : '+'}</span>
                  </div>
                  {expandedCode === cat.code && (
                    <div style={styles.accordionContent}>
                      <div style={{ fontSize: '12px', marginBottom: '5px', color: '#fbbf24', fontWeight: 'bold' }}>Required Documents:</div>
                      {cat.documents.map((doc, j) => (
                        <div key={j} style={{ fontSize: '12px', marginLeft: '10px', marginBottom: '4px' }}>• {doc}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.navItemWhite} onClick={(e) => { e.stopPropagation(); toggleDropdown('contact') }}>
          Contact Us ▼
          {showDropdown === 'contact' && (
            <div style={{ ...styles.dropdownMenuRight, minWidth: '200px' }} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
              <div style={styles.dropdownSection}>
                <strong>{navConfig.contactUs.address}</strong>
                <p style={styles.placeholderText}>{navConfig.contactUs.phone}</p>
                <p style={styles.placeholderText}>{navConfig.contactUs.email}</p>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* HERO SECTION */}
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          {heroConfig.backgroundImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
            />
          ))}
        </div>


  {/* DITO NA YUNG CONTENT PARA MAGSCROLL */ }
  <div style={{ padding: '60px', background: '#fff', minHeight: '100vh' }}>
    <h2 style={{ textAlign: 'center', color: '#1e3a8a', fontSize: '32px', marginBottom: '20px' }}>Programs and Services</h2>
    <p style={{ textAlign: 'center', color: '#555' }}>Ilagay mo dito lahat ng sections mo. About, Contact, etc.</p>

    <br /><br /><br /><br /><br /> {/* TEST LANG TO PARA MAKITA NATIN SCROLL */}
    <p>Scroll test...</p>
    <br /><br /><br /><br /><br />

  </div>

</main>
    
    { showLoginModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} onClick={() => setShowLoginModal(false)}>
        <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()} className="anim-slide-up">
          <h2 style={{ color: '#1e3a8a', margin: '0 0 20px 0', fontSize: '24px', fontWeight: '900', textAlign: 'center' }}>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a', fontWeight: 'bold', fontSize: '14px' }}>Email Address</label>
              <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '15px', background: '#f8fafc' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '15px', background: '#f8fafc', paddingRight: '40px' }}
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
            <button type="submit" style={{ background: '#fbbf24', color: '#1e3a8a', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '5px' }} className="hover-btn">Login Securely</button>
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#475569' }}>
              No account? <span style={{ color: '#1e3a8a', fontWeight: 'bold', cursor: 'pointer' }}
                className="hover-underline-link"
                onClick={() => { setShowLoginModal(false); setShowRegisterModal(true); }}>Register</span>
            </div>
          </form>
          <button style={{
            position: 'absolute', top: '15px', right: '15px', background: 'none',
            border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b'
          }}
            onClick={() => setShowLoginModal(false)}>✕</button>
        </div>
      </div>
    )
}

{showRegisterModal && (
  <div 
    style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', zIndex: 100,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '40px 20px', overflowY: 'auto'
    }}
    onClick={() => setShowRegisterModal(false)}
  >
    <div 
      style={{ width: '100%', maxWidth: '550px' }} 
      onClick={(e) => e.stopPropagation()}
    >
      <PublicRegisterPage />
    </div>
  </div>
)}  {/* <-- ITO YUNG KULANG SAYO */}


</div>
);
}

export default LandingPage;