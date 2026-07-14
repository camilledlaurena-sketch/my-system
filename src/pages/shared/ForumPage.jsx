import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// SHARED COMMUNITY FORUM PAGE
// ==========================================
function ForumPage() {
  const navigate = useNavigate();
  const { userRole, userData, currentUser } = useAuth();

  // Role-Based Access Control configuration
  const canPost = userRole === 'soloparent';
  const canModerate = ['admin', 'staff'].includes(userRole);
  
  // Only the author or a moderator can delete a post/reply
  const canDelete = (authorId) => {
    return canModerate || authorId === currentUser?.uid;
  };

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replies, setReplies] = useState([]);

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');
  const [newReplyBody, setNewReplyBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Threads in real-time
  useEffect(() => {
    const q = query(collection(db, 'forum_threads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadData = [];
      snapshot.forEach(doc => threadData.push({ id: doc.id, ...doc.data() }));
      setThreads(threadData);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Replies in real-time when a thread is selected
  useEffect(() => {
    if (!selectedThread) return;
    
    const q = query(collection(db, 'forum_threads', selectedThread.id, 'replies'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reps = [];
      snapshot.forEach(doc => reps.push({ id: doc.id, ...doc.data() }));
      setReplies(reps);
    });
    return () => unsubscribe();
  }, [selectedThread]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!canPost) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'forum_threads'), {
        title: newThreadTitle,
        body: newThreadBody,
        authorId: currentUser.uid,
        authorName: userData?.name || 'Solo Parent',
        createdAt: new Date().toISOString()
      });
      setNewThreadTitle('');
      setNewThreadBody('');
    } catch (error) {
      console.error("Error creating thread:", error);
      alert("Failed to create thread.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async (e) => {
    e.preventDefault();
    if (!canPost || !selectedThread) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'forum_threads', selectedThread.id, 'replies'), {
        body: newReplyBody,
        authorId: currentUser.uid,
        authorName: userData?.name || 'Solo Parent',
        createdAt: new Date().toISOString()
      });
      setNewReplyBody('');
    } catch (error) {
      console.error("Error creating reply:", error);
      alert("Failed to post reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteThread = async (threadId, threadAuthorId) => {
    if (!canDelete(threadAuthorId)) return;
    if (!window.confirm("Are you sure you want to delete this thread?")) return;
    
    try {
      await deleteDoc(doc(db, 'forum_threads', threadId));
      if (selectedThread && selectedThread.id === threadId) {
        setSelectedThread(null);
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
      alert("Failed to delete thread.");
    }
  };

  const handleDeleteReply = async (replyId, replyAuthorId) => {
    if (!canDelete(replyAuthorId)) return;
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    
    try {
      await deleteDoc(doc(db, 'forum_threads', selectedThread.id, 'replies', replyId));
    } catch (error) {
      console.error("Error deleting reply:", error);
      alert("Failed to delete reply.");
    }
  };

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    container: { maxWidth: '800px', width: '100%' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { color: '#1e3a8a', fontSize: '28px', fontWeight: '900', margin: 0 },
    backBtn: { background: '#e2e8f0', color: '#334155', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    
    card: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
    metaText: { fontSize: '13px', color: '#64748b', marginBottom: '10px' },
    threadTitle: { margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold' },
    threadBody: { color: '#334155', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 },
    
    formGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', minHeight: '100px', resize: 'vertical', fontFamily: 'Arial' },
    submitBtn: { background: '#fbbf24', color: '#1e3a8a', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '15px' },
    
    deleteBtn: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: 0, marginTop: '10px' },
    viewBtn: { background: '#f1f5f9', color: '#1e3a8a', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    
    replyCard: { background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '10px', borderLeft: '4px solid #1e3a8a' },
    replyBody: { color: '#334155', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap', margin: '5px 0' },
  };

  // ==========================================
  // RENDER: THREAD DETAIL VIEW
  // ==========================================
  if (selectedThread) {
    return (
      <div style={styles.body} className="anim-fade-in">
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <button style={styles.backBtn} className="hover-btn" onClick={() => setSelectedThread(null)}>← Back to Threads</button>
            <h2 style={styles.title}>Discussion</h2>
          </div>

          {/* Original Post */}
          <div style={styles.card} className="anim-slide-up">
            <div style={styles.metaText}>
              <strong>{selectedThread.authorName}</strong> • {formatDate(selectedThread.createdAt)}
            </div>
            <h3 style={styles.threadTitle}>{selectedThread.title}</h3>
            <p style={styles.threadBody}>{selectedThread.body}</p>
            {canDelete(selectedThread.authorId) && (
              <button style={styles.deleteBtn} className="hover-btn" onClick={() => handleDeleteThread(selectedThread.id, selectedThread.authorId)}>
                Delete Thread
              </button>
            )}
          </div>

          {/* Replies Section */}
          <h3 style={{ color: '#1e3a8a', margin: '30px 0 15px 0', fontSize: '20px' }}>Replies ({replies.length})</h3>
          
          {replies.map((reply) => (
            <div key={reply.id} style={styles.replyCard} className="anim-slide-up">
              <div style={styles.metaText}>
                <strong>{reply.authorName}</strong> • {formatDate(reply.createdAt)}
              </div>
              <p style={styles.replyBody}>{reply.body}</p>
              {canDelete(reply.authorId) && (
                <button style={styles.deleteBtn} className="hover-btn" onClick={() => handleDeleteReply(reply.id, reply.authorId)}>
                  Delete Reply
                </button>
              )}
            </div>
          ))}

          {/* Reply Form (Only Solo Parents) */}
          {canPost && (
            <div style={{ ...styles.card, marginTop: '20px' }} className="anim-slide-up">
              <h4 style={{ margin: '0 0 15px 0', color: '#1e3a8a' }}>Leave a Reply</h4>
              <form onSubmit={handleCreateReply}>
                <div style={styles.formGroup}>
                  <textarea 
                    style={styles.textarea} 
                    value={newReplyBody} 
                    onChange={(e) => setNewReplyBody(e.target.value)} 
                    required 
                    placeholder="Type your reply here..." 
                  />
                </div>
                <button type="submit" style={{...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1}} className="hover-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: THREAD LIST VIEW
  // ==========================================
  return (
    <div style={styles.body} className="anim-fade-in">
      <div style={styles.container}>
        
        <div style={styles.headerRow}>
          <button style={styles.backBtn} className="hover-btn" onClick={() => navigate(-1)}>← Back</button>
          <h2 style={styles.title}>Community Forum</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        {/* Create Thread Form (Only Solo Parents) */}
        {canPost && (
          <div style={styles.card} className="anim-slide-up">
            <h3 style={{ margin: '0 0 15px 0', color: '#1e3a8a', fontSize: '18px' }}>Start a New Discussion</h3>
            <form onSubmit={handleCreateThread}>
              <div style={styles.formGroup}>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={newThreadTitle} 
                  onChange={(e) => setNewThreadTitle(e.target.value)} 
                  required 
                  placeholder="Thread Title" 
                />
              </div>
              <div style={styles.formGroup}>
                <textarea 
                  style={styles.textarea} 
                  value={newThreadBody} 
                  onChange={(e) => setNewThreadBody(e.target.value)} 
                  required 
                  placeholder="What's on your mind?" 
                />
              </div>
              <button type="submit" style={{...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1}} className="hover-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Discussion'}
              </button>
            </form>
          </div>
        )}

        {/* Thread Feed */}
        {threads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', color: '#64748b' }}>
            No discussions found. Be the first to start one!
          </div>
        ) : (
          threads.map((thread) => (
            <div key={thread.id} style={{...styles.card, display: 'flex', flexDirection: 'column'}} className="hover-card anim-slide-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={styles.metaText}>
                    <strong>{thread.authorName}</strong> • {formatDate(thread.createdAt)}
                  </div>
                  <h3 style={styles.threadTitle}>{thread.title}</h3>
                  <p style={{ ...styles.threadBody, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {thread.body}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                <button style={styles.viewBtn} className="hover-btn" onClick={() => setSelectedThread(thread)}>
                  View Discussion
                </button>
                {canDelete(thread.authorId) && (
                  <button style={styles.deleteBtn} className="hover-btn" onClick={() => handleDeleteThread(thread.id, thread.authorId)}>
                    Delete Thread
                  </button>
                )}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default ForumPage;