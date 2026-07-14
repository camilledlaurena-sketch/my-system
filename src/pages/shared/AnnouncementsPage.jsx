import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// SHARED ANNOUNCEMENTS & EVENTS PAGE
// ==========================================
function AnnouncementsPage() {
  const navigate = useNavigate();
  const { userRole, userData } = useAuth();
  
  // Determine if the user has Admin or Staff privileges
  const canManage = ['admin', 'staff'].includes(userRole);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'General Info', // General Info, Livelihood, Event, Urgent
    content: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Fetch announcements sorted by date (newest first)
      const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((document) => {
        data.push({ id: document.id, ...document.data() });
      });
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({
        title: announcement.title,
        category: announcement.category,
        content: announcement.content
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', category: 'General Info', content: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        author: userData?.name || 'MSWD Staff',
        date: editingId ? announcements.find(a => a.id === editingId).date : new Date().toISOString()
      };

      if (editingId) {
        // Update existing announcement
        await updateDoc(doc(db, 'announcements', editingId), payload);
        alert('Announcement updated successfully.');
      } else {
        // Create new announcement
        await addDoc(collection(db, 'announcements'), payload);
        alert('Announcement posted successfully.');
      }

      setShowModal(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save. ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement? This cannot be undone.')) return;
    
    try {
      await deleteDoc(doc(db, 'announcements', id));
      alert('Announcement deleted.');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete. ' + error.message);
    }
  };

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Urgent': return '#dc2626'; // Red
      case 'Event': return '#059669'; // Green
      case 'Livelihood': return '#d97706'; // Amber
      default: return '#2563eb'; // Blue
    }
  };

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    container: { maxWidth: '800px', width: '100%' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { color: '#1e3a8a', fontSize: '32px', fontWeight: '900', margin: 0 },
    backBtn: { background: '#e2e8f0', color: '#334155', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    createBtn: { background: '#1e3a8a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    
    card: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
    badge: { color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    date: { fontSize: '13px', color: '#64748b', marginTop: '8px' },
    cardTitle: { margin: '10px 0', color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold' },
    content: { color: '#475569', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 },
    
    adminControls: { display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
    editBtn: { background: '#f1f5f9', color: '#2563eb', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    deleteBtn: { background: '#fef2f2', color: '#dc2626', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    modalContent: { background: 'white', width: '100%', maxWidth: '600px', borderRadius: '12px', padding: '24px', boxSizing: 'border-box' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', minHeight: '150px', resize: 'vertical', fontFamily: 'Arial' },
    modalBtnGroup: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    submitBtn: { background: '#1e3a8a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { background: '#e2e8f0', color: '#475569', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={styles.body} className="anim-fade-in">
      <div style={styles.container}>
        
        <div style={styles.headerRow}>
          <button style={styles.backBtn} className="hover-btn" onClick={() => navigate(-1)}>← Back</button>
          <h2 style={styles.title}>📢 Announcements</h2>
          
          {/* Conditional Create Button for Admin/Staff */}
          {canManage ? (
            <button style={styles.createBtn} className="hover-btn" onClick={() => handleOpenModal()}>+ Create Post</button>
          ) : (
            <div style={{ width: '80px' }}></div>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', color: '#64748b' }}>
            No announcements at this time. Check back later!
          </div>
        ) : (
          announcements.map((post) => (
            <div key={post.id} style={styles.card} className="anim-slide-up hover-card">
              <div style={styles.cardHeader}>
                <div>
                  <span style={{...styles.badge, background: getCategoryColor(post.category)}}>{post.category}</span>
                  <div style={styles.date}>{formatDate(post.date)} • Posted by {post.author}</div>
                </div>
              </div>
              <h3 style={styles.cardTitle}>{post.title}</h3>
              <p style={styles.content}>{post.content}</p>
              
              {/* Conditional Edit/Delete Controls for Admin/Staff */}
              {canManage && (
                <div style={styles.adminControls}>
                  <button style={styles.editBtn} className="hover-btn" onClick={() => handleOpenModal(post)}>Edit</button>
                  <button style={styles.deleteBtn} className="hover-btn" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL (Only renders for Admin/Staff) */}
      {showModal && canManage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="anim-slide-up">
            <h3 style={{ margin: '0 0 20px 0', color: '#1e3a8a', fontSize: '24px' }}>
              {editingId ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input type="text" style={styles.input} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required placeholder="Enter announcement title..." />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select style={styles.input} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                  <option value="General Info">General Info</option>
                  <option value="Event">Event</option>
                  <option value="Livelihood">Livelihood Program</option>
                  <option value="Urgent">Urgent / Alert</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Content / Details</label>
                <textarea style={styles.textarea} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required placeholder="Type the full announcement details here..."></textarea>
              </div>

              <div style={styles.modalBtnGroup}>
                <button type="button" style={styles.cancelBtn} className="hover-btn" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" style={{...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1}} className="hover-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Post Announcement')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnouncementsPage;