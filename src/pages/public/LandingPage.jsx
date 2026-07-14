import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase'; 
import { useAuth } from '../../context/AuthContext';
import heroVideo from '../../vids/soloparent.mp4';

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
  newsAndEvents: {
    events: [
      { title: "Event Title", date: "Date: TBD", details: "Details coming soon." }
    ]
  },
  eServices: ["Service 1", "Service 2", "Service 3"],
  programsAndServices: ["Program 1", "Program 2", "Program 3"],
  categoriesAndCodes: [
    { code: "Code A", documents: ["Document 1", "Document 2", "Document 3"] },
    { code: "Code B", documents: ["Document 1", "Document 2", "Document 3"] },
    { code: "Code C", documents: ["Document 1", "Document 2", "Document 3"] }
  ],
contactUs: {
    address: "Address: TBD",
    phone: "Phone: TBD",
    email: "Email: TBD"
  }
};

// ==========================================
// FRONT PAGE HERO CONFIGURATION DATA
// ==========================================
const heroConfig = {
  videoSrc: heroVideo, 
  posterImg: "/images/soloparent-poster.jpg",
  title: "Empowering Solo Parents",
  subtitle: "Support. Benefits. Community. All here for you."
};

// ==========================================
// LANDING PAGE COMPONENT
// ==========================================
function LandingPage() {
  const navigate = useNavigate();
  const { userRole, userData } = useAuth(); 

  const [showDropdown, setShowDropdown] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero Modal & Login States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    body: { fontFamily: 'Arial, sans-serif', background: '#ffffff', height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', overflowY: 'auto' },
    header: { background: '#ffffff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderBottom: '4px solid #fbbf24', position: 'relative', zIndex: 10, flexWrap: 'wrap' },
    logoTitle: { color: '#1e3a8a', margin: 0, fontSize: '24px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', minWidth: 'max-content' },
    navContainer: { display: isMobileMenuOpen ? 'flex' : 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: 1, padding: '0 20px' },
    mobileMenuBtn: { display: 'none', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#1e3a8a' },
    navItem: { position: 'relative', cursor: 'pointer', color: '#1e3a8a', fontWeight: 'bold', fontSize: '14px', padding: '10px 0', userSelect: 'none' },
    dropdownMenu: { position: 'absolute', top: '100%', left: '0', background: '#1e3a8a', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '10px 0', minWidth: '220px', display: 'flex', flexDirection: 'column', textAlign: 'left', zIndex: 20 },
    dropdownMenuRight: { position: 'absolute', top: '100%', right: '0', background: '#1e3a8a', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '10px 0', minWidth: '300px', display: 'flex', flexDirection: 'column', textAlign: 'left', zIndex: 20 },
    dropdownSection: { padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' },
    videoPlaceholder: { background: '#94a3b8', height: '120px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', fontSize: '14px', marginTop: '10px', fontWeight: 'bold' },
    placeholderText: { fontSize: '13px', margin: '5px 0 0 0', color: '#cbd5e1' },
    cardContainer: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
    imageCardPlaceholder: { background: '#f1f5f9', padding: '15px', borderRadius: '6px', color: '#334155' },
    eventCard: { background: 'rgba(255,255,255,0.1)', padding: '15px', margin: '10px 15px', borderRadius: '6px', color: '#ffffff' },
    dropdownItem: { padding: '12px 20px', color: '#ffffff', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' },
    accordionContent: { marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' },
    navButtons: { display: 'flex', gap: '10px', minWidth: 'max-content' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 20px', textAlign: 'center', background: 'radial-gradient(circle at center, #ffffff 0%, #f0f9ff 100%)' },
    heroTitle: { color: '#1e3a8a', fontSize: '48px', fontWeight: '900', marginBottom: '20px' },
    heroSub: { color: '#475569', fontSize: '18px', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' },
    btnGroup: { display: 'flex', gap: '20px', justifyContent: 'center' },
    btnPrimary: { background: '#fbbf24', color: '#1e3a8a', padding: '15px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    btnSecondary: { background: '#ffffff', color: '#1e3a8a', padding: '15px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '2px solid #1e3a8a', cursor: 'pointer', fontSize: '18px' },
    infoBox: { background: '#f8fafc', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #fbbf24', margin: '10px', textAlign: 'left', color: '#334155', fontSize: '14px', lineHeight: '1.6' }
  };

return (
    <div style={styles.body} className="anim-fade-in landing-page-wrapper" onClick={() => setShowDropdown(null)}>
      <style>{`
        @media (max-width: 900px) {
          .mobile-nav-container { display: ${isMobileMenuOpen ? 'flex' : 'none'} !important; flex-direction: column; width: 100%; align-items: flex-start !important; margin-top: 15px; }
          .mobile-toggle-btn { display: block !important; }
          .nav-item-dropdown { position: static !important; width: 100% !important; min-width: 100% !important; }
        }
        .hover-underline-link:hover { text-decoration: underline !important; }
        
        /* Hide the scrollbar exclusively for the Landing Page wrapper */
        .landing-page-wrapper::-webkit-scrollbar { display: none; }
        .landing-page-wrapper { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <header style={styles.header} onClick={(e) => e.stopPropagation()}>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
          <h1 style={styles.logoTitle}>
            <span style={{background: '#e2e8f0', borderRadius: '4px', padding: '0 8px'}}>🖼️</span> Solo Parent Support System
          </h1>
          <button 
            className="mobile-toggle-btn" 
            style={styles.mobileMenuBtn} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
        
        <nav style={styles.navContainer} className="mobile-nav-container">
          <div style={styles.navItem} onClick={() => navigate('/')}>Home</div>
          
          <div style={styles.navItem} onClick={() => toggleDropdown('about')}>
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
          
          <div style={styles.navItem} onClick={() => toggleDropdown('innov')}>
            Innovations ▼
            {showDropdown === 'innov' && (
              <div style={styles.dropdownMenuRight} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
                <div style={styles.dropdownSection}>
                  <strong>Recent Projects</strong>
                  <div style={styles.cardContainer}>
                    {navConfig.innovations.recentProjects.map((proj, i) => (
                      <div key={i} style={styles.imageCardPlaceholder}>
                        <strong style={{color:'#1e3a8a'}}>{proj.title}</strong>
                        <p style={{fontSize:'12px', margin:'5px 0 0'}}>{proj.desc}</p>
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

          <div style={styles.navItem} onClick={() => toggleDropdown('news')}>
            News & Events
            {showDropdown === 'news' && (
              <div style={styles.dropdownMenu} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
                {navConfig.newsAndEvents.events.map((ev, i) => (
                  <div key={i} style={styles.eventCard}>
                    <strong>{ev.title}</strong>
                    <div style={{fontSize:'12px', color:'#cbd5e1', marginTop:'5px'}}>{ev.date}</div>
                    <p style={{fontSize:'12px', margin:'5px 0 0'}}>{ev.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.navItem} onClick={() => toggleDropdown('eservices')}>
            e-Services ▼
            {showDropdown === 'eservices' && (
              <div style={styles.dropdownMenu} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
                {navConfig.eServices.map((service, i) => (
                  <div key={i} style={styles.dropdownItem}>{service}</div>
                ))}
              </div>
            )}
          </div>
          
          <div style={styles.navItem} onClick={() => toggleDropdown('programs')}>
            Programs and Services ▼
            {showDropdown === 'programs' && (
              <div style={styles.dropdownMenu} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
                {navConfig.programsAndServices.map((prog, i) => (
                  <div key={i} style={styles.dropdownItem}>{prog}</div>
                ))}
              </div>
            )}
          </div>
          
          <div style={styles.navItem} onClick={() => toggleDropdown('categories')}>
            Categories and Codes ▼
            {showDropdown === 'categories' && (
              <div style={styles.dropdownMenuRight} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
                {navConfig.categoriesAndCodes.map((cat, i) => (
                  <div key={i} style={{...styles.dropdownItem, borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div 
                      onClick={() => setExpandedCode(expandedCode === cat.code ? null : cat.code)} 
                      style={{cursor:'pointer', fontWeight:'bold', display:'flex', justifyContent:'space-between'}}
                    >
                      {cat.code} <span style={{fontSize: '16px'}}>{expandedCode === cat.code ? '−' : '+'}</span>
                    </div>
                    {expandedCode === cat.code && (
                      <div style={styles.accordionContent}>
                        <div style={{fontSize:'12px', marginBottom:'5px', color:'#fbbf24', fontWeight:'bold'}}>Required Documents:</div>
                        {cat.documents.map((doc, j) => (
                          <div key={j} style={{fontSize:'12px', marginLeft:'10px', marginBottom:'4px'}}>• {doc}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.navItem} onClick={() => toggleDropdown('contact')}>
            Contact Us
            {showDropdown === 'contact' && (
              <div style={{...styles.dropdownMenuRight, minWidth: '200px'}} className="anim-slide-up nav-item-dropdown" onClick={(e) => e.stopPropagation()}>
                <div style={styles.dropdownSection}>
                  <strong>{navConfig.contactUs.address}</strong>
                  <p style={styles.placeholderText}>{navConfig.contactUs.phone}</p>
                  <p style={styles.placeholderText}>{navConfig.contactUs.email}</p>
                </div>
              </div>
            )}
          </div>
        </nav>

      </header>
      
      <main style={{ position: 'relative', flex: 1, display: 'flex', overflow: 'hidden' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroConfig.posterImg}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src={heroConfig.videoSrc} type="video/mp4" />
        </video>
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(30, 58, 138, 0.7)', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 5%' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '40px', borderRadius: '16px', maxWidth: '450px', width: '100%', color: '#ffffff', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 15px 0', lineHeight: '1.2', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>{heroConfig.title}</h2>
            <p style={{ fontSize: '18px', margin: '0 0 30px 0', lineHeight: '1.5', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>{heroConfig.subtitle}</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button style={{ background: '#fbbf24', color: '#1e3a8a', padding: '15px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', flex: 1, textAlign: 'center' }} onClick={() => setShowLoginModal(true)} className="hover-btn">Login</button>
              <button style={{ background: 'transparent', color: '#ffffff', padding: '15px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '2px solid #ffffff', cursor: 'pointer', fontSize: '16px', flex: 1, textAlign: 'center' }} onClick={() => navigate('/categories')} className="hover-btn">Register</button>
            </div>
          </div>
        </div>

        {showLoginModal && (
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
                  No account? <span style={{ color: '#1e3a8a', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' }} className="hover-underline-link" onClick={() => { setShowLoginModal(false); navigate('/categories'); }}>Register</span>
                </div>
              </form>
              <button style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }} onClick={() => setShowLoginModal(false)}>✕</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default LandingPage;