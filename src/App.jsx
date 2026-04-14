import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Trophy,
  Target,
  Flame,
  Home as HomeIcon,
  Users,
  User,
  MessageSquare,
  LogOut,
  ChevronRight,
  Clock,
  Upload,
  Check,
  CheckCircle,
  XCircle,
  Lock,
  Award,
  Video,
  ShieldCheck,
  Bell,
  Zap,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  ShieldAlert,
  Globe,
  Phone,
  Mail,
  MapPin,
  Camera,
  Edit3,
  Save,
  BarChart3,
  CheckCircle2,
  MinusCircle,
  Activity,
  Hourglass,
  RefreshCw
} from 'lucide-react';

console.log('App.jsx: Module loaded');
import { supabase } from './lib/supabaseClient';
import logoImg from './assets/logo.png';

// --- Constants ---
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

// --- Helpers ---
const getEmbedUrl = (url) => {
  if (!url) return null;
  // Handle Google Drive links
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/\/d\/(.+?)\//)?.[1] || url.match(/id=(.+?)(&|$)/)?.[1];
    if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

const getAvatarInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
  return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
};

const HEALTH_QUOTES = [
  "Health is a state of body. Wellness is a state of being.",
  "Your body hears everything your mind says.",
  "The first wealth is health.",
  "A healthy outside starts from the inside.",
  "Keep your vitality. A life without health is like a river without water.",
  "Exercise is king. Nutrition is queen. Put them together and you've got a kingdom.",
  "The human body is the best picture of the human soul.",
  "To ensure good health: eat lightly, breathe deeply, live moderately, cultivate cheerfulness.",
  "Success is nothing without health.",
  "Take care of your body. It's the only place you have to live."
];

// --- Components ---

// --- Components ---

const RulesContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Submission Deadlines */}
    <div style={{ padding: '20px', background: 'var(--hb-cream)', borderRadius: '20px', border: '1px solid rgba(159, 64, 34, 0.1)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '16px', background: 'var(--accent)', borderRadius: '2px' }} />
        Submission Deadlines
      </h3>
      <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <li>All tasks must be submitted by <strong>11:59 PM</strong> every day, with no exceptions.</li>
        <li>Late submissions will automatically result in <strong>0 points</strong>.</li>
        <li>Missing a day does not end your challenge; you just need to get back on track the following morning.</li>
      </ul>
    </div>

    {/* Proof Standards */}
    <div style={{ padding: '20px', background: 'var(--hb-cream)', borderRadius: '20px', border: '1px solid rgba(159, 64, 34, 0.1)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '16px', background: 'var(--accent)', borderRadius: '2px' }} />
        Proof Standards
      </h3>
      <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <li>All proof must be submitted as <strong>photos</strong>.</li>
        <li>Videos are not required for any task.</li>
        <li>Every submitted photo must be clear.</li>
        <li>Proof must be taken on the <strong>actual day</strong> you are making the submission.</li>
        <li>Pre-taken, recycled, or blurry photos are not accepted and will be rejected.</li>
        <li>Do not reuse the same photo on different days.</li>
      </ul>
    </div>

    {/* Scoring & Moderation */}
    <div style={{ padding: '20px', background: 'var(--hb-cream)', borderRadius: '20px', border: '1px solid rgba(159, 64, 34, 0.1)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '16px', background: 'var(--accent)', borderRadius: '2px' }} />
        Scoring & Moderation
      </h3>
      <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <li>Each fully completed task with valid photo proof earns <strong>10 points</strong> per day.</li>
        <li>All decisions made by the moderators are final.</li>
        <li>If the backend team rejects or partially credits a submission, their decision stands.</li>
      </ul>
    </div>

    {/* Bonus Section Header */}
    <div style={{ margin: '8px 0', textAlign: 'center' }}>
      <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', color: 'var(--accent)', margin: 0 }}>Bonus Point Opportunities</h2>
    </div>

    {/* Social Media Bonus */}
    <div style={{ padding: '20px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '20px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#B8860B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '16px', background: '#B8860B', borderRadius: '2px' }} />
        Social Media Bonus (+5 Points)
      </h3>
      <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <li>Share your progress with others to earn extra points!</li>
        <li>Upload a story while you are completing a task and tag <strong>@hopwith_hb</strong> to claim this bonus.</li>
      </ul>
    </div>

    {/* Health Assessment Bonus */}
    <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(159, 64, 34, 0.05) 0%, rgba(159, 64, 34, 0.1) 100%)', borderRadius: '20px', border: '1px solid var(--accent)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '16px', background: 'var(--accent)', borderRadius: '2px' }} />
        The HB+ Health Assessment Bonus (+100 Points)
      </h3>
      <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <li>This is the <strong>biggest bonus</strong> in the game!</li>
        <li>You earn 50 points for completing the Physical Assessment and 50 points for the Nutrition Assessment.</li>
        <li><strong>Booking Window:</strong> You must book your slot between Day 5 (17th April, Friday) and Day 14 (26th April, Sunday).</li>
        <li><strong>Completion Deadline:</strong> You must complete the assessment before Day 15 (last date to take the assessment is Day 14 - 26th April, Sunday).</li>
        <li><strong style={{ color: '#c0392b' }}>Warning:</strong> If you miss Day 14, you forfeit the entire bonus, so do not sleep on this!</li>
      </ul>
    </div>

    <p style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--text-tertiary)', textAlign: 'center', margin: '0' }}>
      Note: Refer to the shared Playbook for Detailed breakdown and explanation.
    </p>
  </div>
);

const RulesGatekeeper = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        style={{ background: 'white', width: '100%', maxWidth: '500px', maxHeight: '90vh', borderRadius: '32px', padding: '32px', overflowY: 'auto', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <ShieldCheck size={40} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', margin: 0 }}>Operational Protocols</h2>
          <p style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>Please review and accept our guidelines to proceed</p>
        </div>

        <RulesContent />

        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '20px' }}>
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ width: '24px', height: '24px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              I strictly agree to follow all Rules & Guidelines for the HB+ 21-Day Challenge.
            </span>
          </label>
          <button
            disabled={!agreed}
            onClick={onAccept}
            style={{ 
              width: '100%', 
              padding: '20px', 
              background: agreed ? 'var(--text-primary)' : '#ccc', 
              color: 'white', 
              borderRadius: '16px', 
              border: 'none', 
              fontWeight: '900', 
              cursor: agreed ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.3s'
            }}
          >
            Accept & Initialize Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TaskCard = ({ task, onAction, isLocked, isHistory, minimal = false }) => {
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const fileInputRef = useRef(null);
  const nativeCameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoUrl = getEmbedUrl(task.video_url);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image only (JPG/PNG).');
      return;
    }

    setLocalFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    setCurrentQuote(HEALTH_QUOTES[Math.floor(Math.random() * HEALTH_QUOTES.length)]);
    setIsUploading(true);
    try {
      await onAction(task, localFile);
    } catch (err) {
      console.error(err);
    }
    setIsUploading(false);
    setLocalFile(null);
    setLocalPreview(null);
  };

  const startCamera = async (mode = facingMode) => {
    // Stop any existing stream first
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } },
        audio: false
      });
      setCameraStream(stream);
      setShowCamera(true);
    } catch (err) {
      console.error('Camera access error:', err);
      // Fallback for some browsers that don't support 'ideal' well
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setCameraStream(stream);
        setShowCamera(true);
      } catch (e2) {
        alert('Camera access denied or not available.');
      }
    }
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCamera, cameraStream]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setLocalFile(file);
      setLocalPreview(URL.createObjectURL(file));
      stopCamera();
    }, 'image/jpeg', 0.92);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }
    setCameraStream(null);
    setShowCamera(false);
  };

  const statusBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.2s',
    border: '1px solid rgba(0,0,0,0.1)'
  };

  const getStatusButton = () => {
    if (isUploading) {
      return (
        <div className="status-badge" style={{ ...statusBadgeStyle, width: '100%', backgroundColor: '#fcfaf5', color: '#9f4022' }}>
          <Clock size={18} style={{ marginRight: '8px' }} /> Uploading...
        </div>
      );
    }

    if (localFile) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
            <img src={localPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setLocalFile(null); setLocalPreview(null); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #eee', background: 'white', fontWeight: 'bold' }}>Cancel</button>
            <button onClick={handleConfirm} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#9f4022', color: 'white', fontWeight: 'bold' }}>Confirm</button>
          </div>
        </div>
      );
    }

    if (isLocked) return <div style={{ color: 'rgba(0,0,0,0.2)', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', width: '100%' }}>Locked · Available Day {task.day}</div>;

    // Lock historical tasks — clients cannot upload for past days
    if (isHistory && (task.status === 'pending' || task.status === 'retry' || !task.status)) {
      return (
        <div style={{ ...statusBadgeStyle, backgroundColor: 'rgba(210, 116, 64, 0.05)', color: '#d27440', border: '1px solid rgba(210, 116, 64, 0.2)' }}>
          <Clock size={16} style={{ marginRight: '8px' }} /> Protocol Expired
        </div>
      );
    }

    switch (task.status) {
      case 'pending':
      case 'retry':
        return (
          <>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
            <input type="file" ref={nativeCameraRef} style={{ display: 'none' }} accept="image/*" capture="environment" onChange={handleFileChange} />
            {task.rejection_comment && (
              <p style={{ margin: '0 0 12px 0', padding: '10px 14px', background: 'rgba(210, 116, 64, 0.08)', color: '#d27440', borderRadius: '12px', fontSize: '11px', fontWeight: '600', borderLeft: '3px solid #d27440' }}>
                INSTRUCTION: {task.rejection_comment}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {task.proof_mode === 'checkbox' ? (
                <button
                  className="status-badge"
                  style={{ ...statusBadgeStyle, width: '100%', backgroundColor: '#6f8e7c', color: 'white', border: 'none', cursor: 'pointer' }}
                  onClick={() => onAction(task, null)}
                >
                  <CheckCircle size={18} style={{ marginRight: '8px' }} /> Confirm Task completeion
                </button>
              ) : (
                <>
                  {(task.proof_mode === 'capture' || task.proof_mode === 'both' || !task.proof_mode) && (
                    <button
                      className="status-badge"
                      style={{ ...statusBadgeStyle, width: '100%', backgroundColor: '#53372b', color: 'white', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        // Improved detection for Phone, Tab (iPad), and Android devices
                        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        
                        if (isTouchDevice || isMobile) {
                          nativeCameraRef.current?.click();
                        } else {
                          startCamera();
                        }
                      }}
                    >
                      <Camera size={18} style={{ marginRight: '8px' }} /> Take Photo
                    </button>
                  )}
                  {(task.proof_mode === 'upload' || task.proof_mode === 'both' || !task.proof_mode) && (
                    <button
                      className="status-badge"
                      style={{ ...statusBadgeStyle, width: '100%', backgroundColor: 'white', color: '#53372b', border: '1px solid #53372b', cursor: 'pointer' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={18} style={{ marginRight: '8px' }} /> Upload from Gallery
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        );
      case 'under-review':
        return (
          <div className="status-badge" style={{ ...statusBadgeStyle, width: '100%', backgroundColor: '#f5f2e9', color: '#53372b', border: '1px solid #53372b' }}>
            <Clock size={18} style={{ marginRight: '8px' }} /> Under Review
          </div>
        );
      case 'approved':
        return (
          <div className="status-badge" style={{ ...statusBadgeStyle, width: '100%', backgroundColor: '#fcfaf5', color: '#6f8e7c', border: '1px solid #6f8e7c' }}>
            <CheckCircle size={18} style={{ marginRight: '8px' }} /> Approved (+{task.points} pts)
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
      {/* In-Browser Camera Modal - works on both mobile & desktop */}
      {showCamera && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '600px', position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              📷 Camera Mode
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: '16px', padding: '24px', width: '100%', maxWidth: '600px', flexShrink: 0 }}>
            <button
              onClick={switchCamera}
              style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RefreshCw size={20} /> Flip
            </button>
            <button
              onClick={stopCamera}
              style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              style={{ flex: 2, padding: '16px', background: '#9f4022', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Camera size={20} /> Capture Photo
            </button>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 100,
              background: 'rgba(255, 255, 255, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '24px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: '60px',
                height: '60px',
                border: '3px solid var(--hb-cream)',
                borderTop: '3px solid var(--accent)',
                borderRadius: '50%',
                marginBottom: '24px'
              }}
            />
            <p style={{
              fontSize: '18px',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              maxWidth: '280px',
              lineHeight: '1.4',
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: '800'
            }}>
              "{currentQuote}"
            </p>
            <p style={{
              marginTop: '16px',
              fontSize: '10px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--accent)',
              opacity: 0.8
            }}>
              Encrypting Protocol...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {videoUrl && (
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
          <iframe
            src={videoUrl}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay"
            title={task.title}
          />
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {!minimal && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '4px', color: 'var(--text-primary)' }}>{task.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{task.description || 'Follow the protocol above and upload your proof below.'}</p>
            </div>
            {task.points && <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>+{task.points} pts</span>}
          </div>
        )}
        {getStatusButton()}
      </div>
    </div>
  );
};
// --- Pages ---
// --- Pages ---

const HomePage = ({ tasks = [], flashCards = [], currentDay, selectedDay, onSelectDay, onUpload, onFlashcardAction, profile }) => {
  const isIndependent = !profile?.team_name || profile?.team_name === 'Independent';
  const weekNum = Math.ceil(selectedDay / 7);
  const weekTitles = ["Foundation", "Commitment", "Ascension", "Mastery"];

  const isHistory = selectedDay < currentDay;
  const isLocked = selectedDay > currentDay;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      {isIndependent ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--hb-cream)', borderRadius: '32px', border: '1px solid rgba(159, 64, 34, 0.1)', marginTop: '40px' }}>
          <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 25px rgba(159, 64, 34, 0.1)' }}>
            <ShieldAlert size={40} color="var(--accent)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--text-primary)', marginBottom: '16px' }}>Protocol Access Pending</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 24px' }}>
            Operative <strong>{profile?.name}</strong>, your account is currently in the <em>Independent</em> queue. Administrative assignment to a Tactical Unit is required to unlock your 21-day protocols.
          </p>
          <div style={{ background: 'rgba(159, 64, 34, 0.05)', padding: '16px', borderRadius: '16px', border: '1px dashed var(--accent)', display: 'inline-block' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              📡 Awaiting Satellite Uplink...
            </p>
          </div>
        </div>
      ) : (
        <>
          {flashCards.length > 0 && (
            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Active Wildcard Opportunities</p>
              {flashCards.map(card => {
                const [isMediaReady, setIsMediaReady] = useState(false);
                const [checkCount, setCheckCount] = useState(0);
                const videoUrl = getEmbedUrl(card.video_url);
                const imageUrl = card.image_url;

                // Smart Detection: Check if Google has generated a thumbnail yet
                useEffect(() => {
                  if (!videoUrl || isMediaReady) return;

                  const fileId = card.video_url.match(/\/d\/(.+?)\//)?.[1] || card.video_url.match(/id=(.+?)(&|$)/)?.[1];
                  if (!fileId) {
                    setIsMediaReady(true);
                    return;
                  }

                  const checkThumbnail = () => {
                    const img = new Image();
                    // Google Drive thumbnails are only generated once the video is ready/near-ready
                    img.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                    img.onload = () => {
                      if (img.width > 32) { // Google returns a tiny 1x1 or 32x32 pixel if not ready
                        setIsMediaReady(true);
                      } else {
                        retry();
                      }
                    };
                    img.onerror = () => retry();
                  };

                  const retry = () => {
                    if (checkCount < 30) { // Check for max 5 minutes (10s intervals)
                      setTimeout(() => setCheckCount(c => c + 1), 10000);
                    } else {
                      setIsMediaReady(true); // Fallback to show it anyway
                    }
                  };

                  checkThumbnail();
                }, [videoUrl, checkCount]);

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{ padding: '0', borderLeft: '4px solid var(--accent)', background: 'var(--card-bg)', overflow: 'hidden', boxShadow: '0 15px 30px rgba(83, 55, 43, 0.08)' }}
                  >
                    {/* Media Section with Smart Detection */}
                    {videoUrl ? (
                      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#1a1411' }}>
                        <AnimatePresence>
                          {!isMediaReady && (
                            <motion.div
                              exit={{ opacity: 0, scale: 1.1 }}
                              transition={{ duration: 0.8 }}
                              style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, #1a1411 0%, #2a201b 50%, #1a1411 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
                                color: 'white', zIndex: 3, textAlign: 'center', padding: '20px'
                              }}
                            >
                              <div style={{ position: 'relative' }}>
                                <Video size={48} className="animate-pulse" style={{ color: 'var(--accent)' }} />
                                <div style={{ position: 'absolute', top: -5, right: -5, width: '12px', height: '12px', background: '#FFC107', borderRadius: '50%', border: '2px solid #1a1411' }}></div>
                              </div>
                              <div>
                                <p style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>Syncing Wildcard Protocol</p>
                                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', maxWidth: '220px', margin: '0 auto', lineHeight: '1.4' }}>
                                  {checkCount > 0 ? `Still processing... (Retry #${checkCount})` : 'Waiting for Google to finalize the stream...'}
                                </p>
                              </div>
                              <button
                                onClick={() => setIsMediaReady(true)}
                                style={{ marginTop: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: '20px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}
                              >
                                I'll wait
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <iframe
                          src={videoUrl}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', zIndex: 1 }}
                          allow="autoplay; fullscreen"
                          title="Protocol Video"
                        />
                      </div>
                    ) : imageUrl && (
                      <div style={{ width: '100%', height: '270px', background: '#f5f5f5', overflow: 'hidden' }}>
                        <img src={imageUrl} alt="Broadcast" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    {/* Content Section */}
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ color: 'var(--accent)', marginTop: '4px' }}>
                          {videoUrl ? <Video size={20} /> : <MessageSquare size={20} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '16px', color: '#53372b', fontWeight: '800', lineHeight: '1.4' }}>{card.text}</p>
                          {card.description && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(83, 55, 43, 0.6)', fontWeight: '500' }}>{card.description}</p>}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', background: 'rgba(159, 64, 34, 0.08)', padding: '4px 8px', borderRadius: '6px' }}>
                              +{card.points || 50} Wildcard Points
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                          <Clock size={14} />
                          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
                            {card.deadline ? `EXPIRING: ${new Date(card.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No Deadline'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <button
                            onClick={() => onFlashcardAction(card.id, 'reject')}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', fontWeight: '700', fontSize: '12px', cursor: 'pointer', padding: '4px 0' }}
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => onFlashcardAction(card.id, 'interested')}
                            style={{ background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '12px', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(159, 64, 34, 0.2)', whiteSpace: 'nowrap' }}
                          >
                            Accept Wildcard
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', fontWeight: '800', marginBottom: '8px' }}>Week {weekNum} — {weekTitles[weekNum - 1]}</h2>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--text-primary)', margin: '0' }}>Day {selectedDay} of 21</h1>
            {/* Dynamic Date Display */}
            <p style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {(() => {
                const now = new Date();
                const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (currentDay - selectedDay));
                return targetDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
              })()}
            </p>
          </div>

          <h1 className="section-title">21-Day Progress</h1>
          <div className="day-grid">
            {Array.from({ length: 21 }, (_, i) => i + 1).map(d => (
              <div key={d} onClick={() => onSelectDay(d)} style={{ cursor: 'pointer' }}>
                <div className={`day-card ${d < currentDay ? 'completed' : (d === currentDay ? 'active' : 'locked')} ${d === selectedDay ? 'selected' : ''}`}>
                  {d < currentDay ? <CheckCircle size={14} /> : (d > currentDay ? <Lock size={14} color="#CBD5E0" /> : <span>{d}</span>)}
                </div>
              </div>
            ))}
          </div>

          <h1 className="section-title" style={{ marginTop: '40px' }}>{isLocked ? "Protocols Locked" : (isHistory ? "Protocol History" : "Active Protocols")}</h1>
          <div className="task-list-grid">
            {isLocked ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
                <Lock size={48} style={{ margin: '0 auto 24px', color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Locked Experience</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>This sequence launches on Day {selectedDay}.</p>
              </div>
            ) : (
              tasks.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.5, gridColumn: '1/-1', padding: '40px' }}>No protocols established for this day yet.</p>
              ) : (
                tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAction={onUpload}
                    isHistory={isHistory}
                    isLocked={isLocked}
                  />
                ))
              )
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

const BoardPage = ({ leaderboard = [], profile, currentDay }) => {
  const [category, setCategory] = useState('Individual');
  const [timeframe, setTimeframe] = useState('Overall');
  const [lbDay, setLbDay] = useState(currentDay || 1);
  const [lbWeek, setLbWeek] = useState(Math.ceil((currentDay || 1) / 7));
  const [pointsData, setPointsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [hasError, setHasError] = useState(false);

  const [refreshTick, setRefreshTick] = useState(0);
  const categories = ['Individual', 'Teams'];
  const timeframes = ['Daily', 'Weekly', 'Overall'];

  // --- Realtime Sync for "Live" Leaderboard ---
  useEffect(() => {
    // Listen for any submission changes to refresh the points log in real-time
    const subChannel = supabase.channel('board-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        console.log('Board: Realtime submission change detected, syncing points...');
        setRefreshTick(t => t + 1);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'manual_awards' }, () => {
        console.log('Board: Realtime manual award detected, syncing points...');
        setRefreshTick(t => t + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subChannel);
    };
  }, []);

  // Sync selectors when currentDay is resolved
  useEffect(() => {
    if (currentDay) {
      setLbDay(currentDay);
      setLbWeek(Math.ceil(currentDay / 7));
    }
  }, [currentDay]);


  // Fetch when day/week or refresh tick changes
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const [subsRes, awardsRes] = await Promise.all([
          supabase.from('submissions')
            .select('user_id, tasks(points, day, week), flashcards(points, week)')
            .eq('status', 'approved'),
          supabase.from('manual_awards')
            .select('user_id, points, day, week')
        ]);
        if (cancelled) return;

        const subs = subsRes.data || [];
        const awards = awardsRes.data || [];
        const up = {};
        const get = (uid) => { if (!up[uid]) up[uid] = { daily: 0, weekly: 0, overall: 0 }; return up[uid]; };

        subs.forEach(s => {
          if (s.tasks) {
            const p = s.tasks.points || 0;
            get(s.user_id).overall += p;  // Always count toward overall
            if (s.tasks.day === lbDay) get(s.user_id).daily += p;
            if (s.tasks.week === lbWeek) get(s.user_id).weekly += p;
          }
          if (s.flashcards) {
            const p = s.flashcards.points || 0;
            get(s.user_id).overall += p;  // Always count toward overall
            if (s.flashcards.week === lbWeek) get(s.user_id).weekly += p;
          }
        });
        awards.forEach(a => {
          const p = a.points || 0;
          get(a.user_id).overall += p;    // Always count toward overall
          if (a.day === lbDay) get(a.user_id).daily += p;
          if (a.week === lbWeek) get(a.user_id).weekly += p;
        });

        setPointsData(up);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        if (!cancelled) setHasError(true);
      }
      if (!cancelled) setIsLoading(false);
    };
    run();
    return () => { cancelled = true; };
  }, [lbDay, lbWeek, refreshTick]);

  const displayData = useMemo(() => {
    try {
      const getPoints = (user) => {
        // Always recalculate from submissions data — never trust profiles.points (can be double-counted)
        if (timeframe === 'Overall') return pointsData[user.id]?.overall || 0;
        if (timeframe === 'Weekly') return pointsData[user.id]?.weekly || 0;
        if (timeframe === 'Daily') return pointsData[user.id]?.daily || 0;
        return 0;
      };
      if (category === 'Teams') {
        const teamScores = {};
        leaderboard.forEach(u => {
          const team = u.team_name || 'Independent';
          if (team === 'Independent') return;
          teamScores[team] = (teamScores[team] || 0) + getPoints(u);
        });
        return Object.entries(teamScores)
          .map(([name, pts]) => ({ name, points: pts, type: 'team' }))
          .sort((a, b) => b.points - a.points);
      } else {
        return leaderboard
          .map(u => ({ ...u, points: getPoints(u), type: 'user' }))
          .sort((a, b) => b.points - a.points);
      }
    } catch (e) {
      console.error('displayData error:', e);
      return [];
    }
  }, [leaderboard, category, timeframe, pointsData]);


  return (
    <div className="page-container leaderboard-container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px', fontStyle: 'italic' }}>
          Leaderboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '500' }}>
          Real-time performance hierarchy
        </p>
      </div>

      <div className="category-row">
        <div className="premium-tab-container">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`premium-tab ${category === cat ? 'active' : ''}`}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>{cat}</span>
              {category === cat && (
                <div
                  className="tab-indicator"
                  style={{
                    position: 'absolute',
                    inset: '4px',
                    zIndex: 1,
                    background: 'var(--accent)',
                    opacity: 0.1,
                    borderRadius: '8px'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="timeframe-row">
        <div className="premium-tab-container" style={{ background: 'transparent' }}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`premium-tab ${timeframe === tf ? 'active' : ''}`}
              style={{
                color: timeframe === tf ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: '11px',
                minWidth: '80px',
                padding: '8px 16px'
              }}
            >
              {tf}
              {timeframe === tf && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    right: '20%',
                    height: '2px',
                    background: 'var(--accent)',
                    borderRadius: '2px'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Day / Week Sub-selectors — plain conditional (no AnimatePresence to avoid shared layout crashes) */}
      {timeframe === 'Daily' && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
          {Array.from({ length: 21 }, (_, i) => i + 1).map(d => (
            <button key={d} onClick={() => setLbDay(d)} style={{ minWidth: '52px', padding: '10px 6px', borderRadius: '12px', border: lbDay === d ? '2px solid var(--accent)' : '1px solid var(--border-color)', background: lbDay === d ? 'rgba(159,64,34,0.08)' : 'var(--card-bg)', color: lbDay === d ? 'var(--accent)' : 'var(--text-tertiary)', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', flexShrink: 0 }}>
              D{d}
            </button>
          ))}
        </div>
      )}
      {timeframe === 'Weekly' && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3].map(w => (
            <button key={w} onClick={() => setLbWeek(w)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: lbWeek === w ? '2px solid var(--accent)' : '1px solid var(--border-color)', background: lbWeek === w ? 'rgba(159,64,34,0.08)' : 'var(--card-bg)', color: lbWeek === w ? 'var(--accent)' : 'var(--text-tertiary)', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              Week {w}
            </button>
          ))}
        </div>
      )}

      {/* Context label + Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {timeframe === 'Daily' && `Leaderboard for Day ${lbDay}`}
          {timeframe === 'Weekly' && `Leaderboard for Week ${lbWeek}`}
          {timeframe === 'Overall' && 'Global All-Time Standings'}
        </p>
        <button
          onClick={() => setRefreshTick(t => t + 1)}
          style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '4px 12px', fontSize: '10px', fontWeight: '800', cursor: 'pointer', color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {isLoading ? '...' : '↻ Sync'}
        </button>
      </div>

      {hasError && (
        <div style={{ padding: '12px 16px', background: 'rgba(210,116,64,0.08)', border: '1px solid rgba(210,116,64,0.2)', borderRadius: '12px', color: '#d27440', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
          ⚠ Could not load point data. Check console for details, or click ↻ Sync.
        </div>
      )}


      <div
        className="leaderboard-list"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {displayData.map((item, idx) => {
          const rank = idx + 1;
          const isMe = item.type === 'user' && item.id === profile?.id;
          const isDenied = item.is_allowed === false;
          const key = item.type === 'user' ? item.id : `team-${item.name}`;

          return (
            <div
              key={key}
              style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '0' }}
            >
              {/* Main card row */}
              <div
                className={`ranking-card glass-card ${isMe ? 'me' : ''}`}
                onClick={() => item.type === 'team' ? setExpandedTeam(expandedTeam === item.name ? null : item.name) : null}
                style={{
                  borderLeft: isDenied ? '4px solid #666' : (rank <= 3 ? `4px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}` : '1px solid var(--border-color)'),
                  marginBottom: '0',
                  boxShadow: rank === 1 && !isDenied ? '0 0 20px rgba(255, 215, 0, 0.15)' : '',
                  opacity: isDenied ? 0.6 : 1,
                  filter: isDenied ? 'grayscale(1)' : 'none',
                  cursor: item.type === 'team' ? 'pointer' : 'default',
                  borderRadius: expandedTeam === item.name ? '20px 20px 0 0' : '20px'
                }}
              >
                <div className="rank-badge">
                  {isDenied ? <XCircle size={18} color="#666" /> : (
                    rank === 1 ? <Trophy size={22} color="#FFD700" /> :
                      rank === 2 ? <Trophy size={20} color="#C0C0C0" /> :
                        rank === 3 ? <Trophy size={20} color="#CD7F32" /> :
                          <span style={{ opacity: 0.4, fontStyle: 'italic', fontSize: '18px' }}>
                            {rank.toString().padStart(2, '0')}
                          </span>
                  )}
                </div>

                <div className="avatar-circle" style={{
                  borderRadius: item.type === 'team' ? '12px' : '50%',
                  background: isDenied ? '#333' : (isMe ? 'var(--accent)' : 'var(--card-bg)'),
                  color: isMe || isDenied ? 'white' : 'var(--text-primary)',
                  backgroundImage: item.avatar_url && !isDenied ? `url(${item.avatar_url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {!item.avatar_url || isDenied ? (item.type === 'team' ? <Users size={18} /> : getAvatarInitials(item.name)) : ''}
                </div>

                <div className="name-stack" style={{ flex: 1, minWidth: '0', overflow: 'hidden' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: isDenied ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                    {item.role === 'captain' && (<Award size={14} color="var(--accent)" style={{ flexShrink: 0 }} />)}
                    {isMe && (<span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>You</span>)}
                    {isDenied && (<span style={{ fontSize: '9px', background: 'linear-gradient(90deg, #d27440, #a04022)', color: 'white', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em', boxShadow: '0 4px 10px rgba(210, 116, 64, 0.3)' }}>DQ 🏃‍♂️💨</span>)}
                  </h4>
                  <p style={{ opacity: 0.5, fontSize: '12px' }}>
                    {item.type === 'user' ? (item.team_name || 'Independent') : `${leaderboard.filter(u => u.team_name === item.name).length} members · tap to view`}
                  </p>
                </div>

                <div className="points-display" style={{ flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ color: isDenied ? '#666' : (rank <= 3 ? 'var(--text-primary)' : 'var(--accent)') }}>
                    {isDenied ? 'DQ' : item.points.toLocaleString()}
                  </span>
                  {!isDenied && <span className="points-label">pts</span>}
                </div>

                {/* Expand chevron for teams */}
                {item.type === 'team' && (
                  <div style={{ marginLeft: '8px', color: 'rgba(83,55,43,0.3)', fontSize: '16px', transition: 'transform 0.2s', transform: expandedTeam === item.name ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>▾</div>
                )}
              </div>

              {/* Expanded Member List — stable component to avoid React/Framer IIFE crash */}
              {item.type === 'team' && expandedTeam === item.name && (
                <TeamExpandedList
                  teamName={item.name}
                  leaderboard={leaderboard}
                  profile={profile}
                />
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Stable Sub-component for Team Expansion ---
const TeamExpandedList = ({ teamName, leaderboard, profile }) => {
  const members = (leaderboard || [])
    .filter(u => u.team_name === teamName)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div
      style={{ overflow: 'hidden', background: 'rgba(83,55,43,0.03)', borderTop: '1px solid rgba(83,55,43,0.08)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px', borderRadius: '0 0 20px 20px', border: '1px solid var(--border-color)' }}
    >
      {members.map((m, mi) => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: m.id === profile?.id ? 'rgba(159,64,34,0.06)' : 'white', borderRadius: '12px', border: m.id === profile?.id ? '1px solid rgba(159,64,34,0.15)' : '1px solid transparent' }}>
          <span style={{ width: '20px', fontSize: '11px', fontWeight: '900', color: mi === 0 ? '#c99d5d' : 'rgba(83,55,43,0.3)', textAlign: 'center' }}>#{mi + 1}</span>
          <div style={{ width: '30px', height: '30px', minWidth: '30px', borderRadius: '50%', background: m.id === profile?.id ? 'var(--accent)' : 'rgba(83,55,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', color: m.id === profile?.id ? 'white' : 'var(--accent)', backgroundImage: m.avatar_url ? `url(${m.avatar_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {!m.avatar_url && (m.name?.[0] || '?').toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{m.name}</span>
              {m.id === profile?.id && <span style={{ fontSize: '8px', background: 'var(--accent)', color: 'white', padding: '1px 5px', borderRadius: '8px', fontWeight: '900' }}>YOU</span>}
              {m.role === 'captain' && <span style={{ fontSize: '8px', background: 'rgba(255,215,0,0.15)', color: '#B8860B', padding: '1px 5px', borderRadius: '8px', fontWeight: '900' }}>⚑</span>}
            </div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>{m.points || 0} <span style={{ fontSize: '9px', fontWeight: '600', opacity: 0.6 }}>pts</span></div>
        </div>
      ))}
    </div>
  );
};

const TeamPage = ({ profile, leaderboard = [], clan }) => {
  const myTeamName = profile?.team_name || 'Independent';
  const isIndependent = myTeamName === 'Independent';
  const teamMembers = isIndependent
    ? leaderboard.filter(u => u.id === profile?.id) // Only show self if independent
    : leaderboard.filter(u => u.team_name === myTeamName);
  const totalTeamPoints = teamMembers.reduce((acc, curr) => acc + (curr.points || 0), 0);

  // Calculate Team Rank
  const teamScores = Array.from(new Set(leaderboard.map(u => u.team_name)))
    .map(name => ({
      name,
      points: leaderboard.filter(u => u.team_name === name).reduce((acc, curr) => acc + (curr.points || 0), 0)
    }))
    .sort((a, b) => b.points - a.points);

  const teamRank = teamScores.findIndex(s => s.name === myTeamName) + 1;
  const [selectedMember, setSelectedMember] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    if (selectedMember) fetchMemberLogs(selectedMember.id);
  }, [selectedMember]);

  const fetchMemberLogs = async (uid) => {
    setIsLoadingLogs(true);
    try {
      const [subsRes, awardsRes] = await Promise.all([
        supabase.from('submissions')
          .select('*, tasks(title, points, day, week), flashcards(text, points)')
          .eq('user_id', uid)
          .order('created_at', { ascending: false }),
        supabase.from('manual_awards')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
      ]);

      const combined = [
        ...(subsRes.data || []).map(s => ({ ...s, type: 'submission' })),
        ...(awardsRes.data || []).map(a => ({
          id: a.id,
          created_at: a.created_at,
          status: 'approved',
          type: 'award',
          points: a.points,
          reason: a.reason,
          tasks: { title: `Award: ${a.reason || 'Admin Grant'}`, points: a.points }
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setLogs(combined);
    } catch (e) {
      console.error(e);
    }
    setIsLoadingLogs(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'var(--card-bg)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(83, 55, 43, 0.1)',
              overflow: 'hidden',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: clan?.logo_url ? `url(${clan.logo_url})` : 'none'
            }}
          >
            {!clan?.logo_url && <Users size={32} color="var(--accent)" opacity={0.3} />}
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>{myTeamName}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Your team needs you. No weak links.</p>
        </div>
      </div>

      <div className="team-stats-grid">
        <div className="stat-card">
          <Trophy size={28} color="#964b29" />
          <div className="stat-value">{totalTeamPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-card">
          <Users size={28} color="#964b29" />
          <div className="stat-value">#{teamRank}</div>
          <div className="stat-label">Team Rank</div>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Members</h2>
      <div className="members-list">
        {teamMembers.sort((a, b) => (b.points || 0) - (a.points || 0)).map(member => {
          const contributionPercent = totalTeamPoints > 0 ? Math.round(((member.points || 0) / totalTeamPoints) * 100) : 0;
          return (
            <motion.div 
              key={member.id} 
              className="ranking-card" 
              onClick={() => setSelectedMember(member)}
              whileHover={{ scale: 1.01, backgroundColor: '#fcfaf5' }}
              whileTap={{ scale: 0.99 }}
              style={{ padding: '16px 24px', cursor: 'pointer', transition: 'background-color 0.2s' }}
            >
              <div className="avatar-circle" style={{ 
                width: '44px', 
                height: '44px', 
                border: member.role === 'captain' ? '2px solid #FFD700' : 'none', 
                backgroundColor: member.role === 'captain' ? '#B8860B' : 'var(--card-bg)',
                backgroundImage: member.avatar_url ? `url(${member.avatar_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {!member.avatar_url && (member.role === 'captain' ? <Award size={20} color="white" /> : member.name?.split(' ').map(n => n[0]).join('').toUpperCase())}
              </div>
              <div className="name-stack">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {member.name}
                  {member.role === 'captain' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(159, 64, 34, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      <Award size={10} color="var(--accent)" />
                      <span style={{ fontSize: '9px', color: 'var(--accent)', fontWeight: '900', letterSpacing: '0.05em' }}>CAPTAIN</span>
                    </div>
                  )}
                </h4>
                <p style={{ fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>{member.email}</p>
                <p style={{ fontWeight: 'bold' }}>{member.points || 0} pts</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div className="member-progress-bar">
                    <div className="member-progress-fill" style={{ width: `${contributionPercent}%` }}></div>
                  </div>
                  <span className="member-percent">{contributionPercent}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.3, background: 'rgba(53, 55, 43, 0.05)', padding: '6px 10px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.05em' }}>AUDIT</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedMember && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(53, 55, 43, 0.4)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ 
                width: '100%', 
                maxWidth: '480px', 
                maxHeight: '80vh', 
                background: 'white', 
                borderRadius: '32px', 
                position: 'relative', 
                zIndex: 1, 
                padding: '32px', 
                overflowY: 'auto',
                boxShadow: '0 30px 60px rgba(83, 55, 43, 0.2)'
              }}
            >
              <button 
                onClick={() => setSelectedMember(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: '#f5f2e9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} color="#53372b" />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #53372b 0%, #9f4022 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white', backgroundImage: selectedMember.avatar_url ? `url(${selectedMember.avatar_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  {!selectedMember.avatar_url && selectedMember.name?.[0].toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', margin: 0, fontFamily: 'var(--font-heading)' }}>{selectedMember.name}</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9f4022', fontWeight: 'bold' }}>{selectedMember.points || 0} TOTAL POINTS</p>
                </div>
              </div>

              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '20px' }}>PROTOCOL AUDIT LOG</h3>

              {isLoadingLogs ? (
                <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Syncing audit trail...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {logs.length > 0 ? logs.map((log) => {
                    const status = log.status || 'pending';
                    const colors = { approved: '#6f8e7c', 'under-review': '#c99d5d', retry: '#d27440', rejected: '#c0392b' };
                    return (
                      <div key={log.id} style={{ padding: '16px', background: '#f5f2e9', borderRadius: '20px', border: '1px solid rgba(83, 55, 43, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>
                            {log.tasks?.title || (log.flashcards?.text ? `WILDCARD: ${log.flashcards.text}` : 'Log Entry')}
                          </div>
                          <div style={{ fontSize: '11px', color: '#53372b', opacity: 0.6, marginTop: '2px' }}>
                            {new Date(log.created_at).toLocaleDateString()} · {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: '900', color: colors[status] || '#53372b' }}>
                            {status === 'approved' ? `+${log.points || log.tasks?.points || log.flashcards?.points || 0}` : (log.points || log.tasks?.points || log.flashcards?.points || 0)}
                          </div>
                          <div style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', color: colors[status] || '#53372b', opacity: 0.8 }}>{status.replace('-', ' ')}</div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.3, fontStyle: 'italic' }}>No protocol entries found.</div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CaptainDashboard = ({ profile, leaderboard = [] }) => {
  const [teamSubmissions, setTeamSubmissions] = useState([]);
  const myTeamName = profile?.team_name || 'Independent';
  const teamMembers = leaderboard.filter(u => u.team_name === myTeamName);

  useEffect(() => {
    fetchTeamSubmissions();
  }, [teamMembers]);

  const fetchTeamSubmissions = async () => {
    const memberIds = teamMembers.map(m => m.id);
    if (memberIds.length === 0) return;
    const { data } = await supabase.from('submissions').select('*').in('user_id', memberIds);
    setTeamSubmissions(data || []);
  };

  const getMemberStatus = (memberId) => {
    const subs = teamSubmissions.filter(s => s.user_id === memberId && (s.status === 'approved' || s.status === 'under-review'));
    return subs.length;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px' }}>
            <Award size={16} color="#FFD700" />
            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8860B' }}>Captain's Console</span>
          </div>
          <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>{myTeamName} Command</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Monitor your squad. Drive them to excellence.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ background: 'var(--hb-cream)', border: '1px solid rgba(159, 64, 34, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#53372b', opacity: 0.6, marginBottom: '12px' }}>TEAM READINESS</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent)' }}>
            {Math.round((teamMembers.filter(m => getMemberStatus(m.id) > 0).length / teamMembers.length) * 100) || 0}%
          </div>
          <p style={{ fontSize: '11px', marginTop: '4px' }}>Members with active protocols</p>
        </div>
        <div className="card" style={{ background: 'var(--hb-cream)', border: '1px solid rgba(159, 64, 34, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#53372b', opacity: 0.6, marginBottom: '12px' }}>SQUAD SIZE</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent)' }}>{teamMembers.length}</div>
          <p style={{ fontSize: '11px', marginTop: '4px' }}>Elite operatives active</p>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Squad Performance</h2>
      <div className="members-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {teamMembers.map(member => (
          <div key={member.id} className="ranking-card" style={{ padding: '20px 24px' }}>
            <div className="avatar-circle" style={{ width: '44px', height: '44px', backgroundColor: member.role === 'captain' ? 'var(--accent)' : 'var(--card-bg)' }}>
              {member.name?.[0].toUpperCase()}
            </div>
            <div className="name-stack">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {member.name}
                {member.id === profile.id && <span style={{ fontSize: '10px', color: 'var(--accent)' }}>(You)</span>}
                {member.role === 'captain' && <Award size={12} color="var(--accent)" />}
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{getMemberStatus(member.id)} Protocols Completed</span>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {member.id !== profile.id && (
                <button
                  disabled={getMemberStatus(member.id) > 0}
                  style={{
                    background: getMemberStatus(member.id) > 0 ? 'rgba(0,0,0,0.05)' : 'var(--accent)',
                    border: 'none',
                    color: getMemberStatus(member.id) > 0 ? 'rgba(0,0,0,0.2)' : 'white',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: getMemberStatus(member.id) > 0 ? 'default' : 'pointer'
                  }}
                >
                  <Bell size={12} /> NUDGE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProfilePage = ({ profile, onUpdate, onLogout, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate({ name });
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSaving(true);
    await onUpdate({ avatar: file });
    setIsSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              background: 'var(--card-bg)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              border: profile?.role === 'captain' ? '4px solid #FFD700' : '4px solid white',
              boxShadow: profile?.role === 'captain' ? '0 0 30px rgba(255, 215, 0, 0.3)' : '0 15px 35px rgba(83, 55, 43, 0.1)',
              color: 'var(--text-primary)',
              backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              overflow: 'hidden'
            }}
          >
            {!profile?.avatar_url && (profile?.name?.[0] || 'A')}
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(160, 64, 34, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <Camera size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>

        <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'center',
                  border: 'none',
                  borderBottom: '2px solid var(--accent)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  width: '200px'
                }}
              />
              <button onClick={handleSave} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                <Save size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ position: 'relative' }}>
                <h1 style={{ fontSize: '32px', margin: 0, color: profile?.role === 'captain' ? '#B8860B' : 'var(--text-primary)' }}>{profile?.name || 'Client'}</h1>
                {profile?.role === 'captain' && (
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    right: '-35px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    <Award size={14} />
                    <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.1em' }}>TEAM CAPTAIN</span>
                  </div>
                )}
              </div>
              <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', opacity: 0.4, cursor: 'pointer' }}>
                <Edit3 size={20} />
              </button>
            </div>
          )}
          <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '8px' }}>{profile?.email}</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginTop: '4px', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{
          textAlign: 'center',
          background: profile?.role === 'captain' ? 'rgba(255, 215, 0, 0.05)' : 'var(--card-bg)',
          border: profile?.role === 'captain' ? '1px solid rgba(255, 215, 0, 0.2)' : '1px solid var(--border-color)',
          boxShadow: profile?.role === 'captain' ? '0 10px 20px rgba(255, 215, 0, 0.1)' : 'none'
        }}>
          <Target size={24} color={profile?.role === 'captain' ? '#B8860B' : 'var(--accent)'} style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: profile?.role === 'captain' ? '#B8860B' : 'var(--text-primary)' }}>{profile?.points || 0}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Career Points</div>
        </div>
        <div className="card" style={{
          textAlign: 'center',
          background: profile?.role === 'captain' ? 'rgba(255, 215, 0, 0.05)' : 'var(--card-bg)',
          border: profile?.role === 'captain' ? '1px solid rgba(255, 215, 0, 0.2)' : '1px solid var(--border-color)',
          boxShadow: profile?.role === 'captain' ? '0 10px 20px rgba(255, 215, 0, 0.1)' : 'none'
        }}>
          <Flame size={24} color="#FF6B6B" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: profile?.role === 'captain' ? '#B8860B' : 'var(--text-primary)' }}>{profile?.streak || 0}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Day Streak</div>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--card-bg)', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '16px' }}>Account Security & Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => onNavigate('habit-tracker')}
            style={{
              width: '100%',
              padding: '16px',
              background: 'white',
              color: '#9f4022',
              border: '1px solid rgba(159, 64, 34, 0.2)',
              borderRadius: '16px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(159, 64, 34, 0.05)'
            }}
          >
            <Activity size={20} /> Habit Tracker
          </button>
          <button
            onClick={() => setIsRulesOpen(true)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'white',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
              marginBottom: '4px'
            }}
          >
            <ShieldCheck size={20} /> Rules & Guidelines
          </button>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(159, 64, 34, 0.05)',
              color: 'var(--accent)',
              border: '1px solid rgba(159, 64, 34, 0.1)',
              borderRadius: '16px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={20} /> Sign Out of Account
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isRulesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: 'white',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '80vh',
                borderRadius: '24px',
                padding: '32px',
                position: 'relative',
                overflowY: 'auto',
                boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
              }}
            >
              <button
                onClick={() => setIsRulesOpen(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--hb-cream)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <ShieldCheck size={40} color="var(--accent)" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', margin: 0 }}>Rules & Guidelines</h2>
                <p style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>Maintain these standards for elite status</p>
              </div>

              <RulesContent />

              <button
                onClick={() => setIsRulesOpen(false)}
                style={{ width: '100%', marginTop: '32px', padding: '16px', background: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                I Understand the Protocol
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSaving && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'white', padding: '12px 24px', borderRadius: '40px', fontSize: '12px', fontWeight: 'bold', zIndex: 5000, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          Updating Profile...
        </div>
      )}
    </motion.div>
  );
};

const PointsLogPage = ({ profile }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberLogs, setMemberLogs] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const statusConfig = {
    approved: { label: 'Earned', color: '#6f8e7c', bg: 'rgba(111,142,124,0.12)', icon: '✓' },
    'under-review': { label: 'Reviewing', color: '#c99d5d', bg: 'rgba(201,157,93,0.12)', icon: '⏳' },
    retry: { label: 'Try Again', color: '#d27440', bg: 'rgba(210,116,64,0.10)', icon: '↩' },
    rejected: { label: 'Rejected', color: '#c0392b', bg: 'rgba(192,57,43,0.10)', icon: '✕' },
    pending: { label: 'Pending', color: 'rgba(83,55,43,0.3)', bg: 'rgba(83,55,43,0.05)', icon: '○' },
  };

  useEffect(() => {
    if (profile?.id) fetchTeamData();
  }, [profile?.id]);

  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      const myTeamName = profile.team_name;
      const isRealTeam = myTeamName && myTeamName !== 'Independent';
      let myTeam = [];

      if (isRealTeam) {
        // Real named team: fetch everyone in this team from DB
        const { data: members } = await supabase
          .from('profiles')
          .select('id, name, points, avatar_url, role, team_name')
          .eq('team_name', myTeamName);
        myTeam = members || [];
      } else {
        // 'Independent' or unassigned: show only this user's own log
        myTeam = [{ id: profile.id, name: profile.name, points: profile.points, avatar_url: profile.avatar_url, role: profile.role, team_name: myTeamName }];
      }

      setTeamMembers(myTeam);
      if (myTeam.length === 0) { setIsLoading(false); return; }

      const memberIds = myTeam.map(m => m.id);

      // Parallel fetch: Submissions and Manual Awards
      const [subsRes, awardsRes] = await Promise.all([
        supabase.from('submissions')
          .select('*, tasks(title, points, day, week), flashcards(text, points)')
          .in('user_id', memberIds)
          .order('created_at', { ascending: false }),
        supabase.from('manual_awards')
          .select('*')
          .in('user_id', memberIds)
          .order('created_at', { ascending: false })
      ]);

      const subs = subsRes.data || [];
      const awards = awardsRes.data || [];

      const grouped = {};

      // Add submissions to the logs
      subs.forEach(s => {
        if (!grouped[s.user_id]) grouped[s.user_id] = [];
        grouped[s.user_id].push({ ...s, type: 'submission' });
      });

      // Add manual awards to the logs (transform to sub-like layout)
      awards.forEach(a => {
        if (!grouped[a.user_id]) grouped[a.user_id] = [];
        grouped[a.user_id].push({
          id: a.id,
          created_at: a.created_at,
          status: 'approved',
          type: 'award',
          points: a.points,
          reason: a.reason,
          // virtual task object for compatibility with renderer
          tasks: { title: `Award: ${a.reason || 'Admin Grant'}`, points: a.points }
        });
      });

      // Sort combined logs by date
      Object.keys(grouped).forEach(uid => {
        grouped[uid].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      });

      setMemberLogs(grouped);
    } catch (e) {
      console.error('Team log error:', e);
    }
    setIsLoading(false);
  };

  const teamTotal = teamMembers.reduce((acc, m) => acc + (m.points || 0), 0);
  const myTeamName = profile?.team_name || '—';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '8px' }}>
          <BarChart3 size={16} />
          <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Team Audit</span>
        </div>
        <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', margin: '0 0 6px 0' }}>Points Log</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{myTeamName} · {teamMembers.length} members</p>
      </div>

      {/* Team Total Banner */}
      <div style={{ background: 'linear-gradient(135deg, #53372b 0%, #9f4022 100%)', borderRadius: '20px', padding: '20px 24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Team Total Points</div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: 'white', fontFamily: 'var(--font-heading)' }}>{teamTotal}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Active Members</div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: 'white', fontFamily: 'var(--font-heading)' }}>{teamMembers.length}</div>
        </div>
      </div>

      {/* Member Cards */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.4, fontWeight: 'bold' }}>Loading team data...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {teamMembers
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .map((member, idx) => {
              const subs = memberLogs[member.id] || [];
              const earned = subs.filter(s => s.status === 'approved').reduce((a, s) => a + (s.points || s.tasks?.points || s.flashcards?.points || 0), 0);
              const pending = subs.filter(s => s.status === 'under-review').length;
              const retries = subs.filter(s => s.status === 'retry').length;
              const isOpen = expanded === member.id;
              const isMe = member.id === profile?.id;

              return (
                <motion.div key={member.id} layout style={{ borderRadius: '20px', overflow: 'hidden', border: isMe ? '2px solid var(--accent)' : '1px solid rgba(83,55,43,0.08)', background: 'var(--card-bg)' }}>
                  {/* Member Header Row */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : member.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', cursor: 'pointer' }}
                  >
                    {/* Rank */}
                    <div style={{ width: '28px', textAlign: 'center', fontWeight: '900', fontSize: '13px', color: idx === 0 ? '#c99d5d' : 'rgba(83,55,43,0.3)' }}>
                      #{idx + 1}
                    </div>

                    {/* Avatar */}
                    <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '50%', background: isMe ? 'var(--accent)' : 'rgba(83,55,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px', color: isMe ? 'white' : 'var(--accent)', backgroundImage: member.avatar_url ? `url(${member.avatar_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      {!member.avatar_url && (member.name?.[0] || '?').toUpperCase()}
                    </div>

                    {/* Name + Stats */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>{member.name}</span>
                        {isMe && <span style={{ fontSize: '9px', background: 'var(--accent)', color: 'white', padding: '2px 7px', borderRadius: '10px', fontWeight: '900' }}>YOU</span>}
                        {member.role === 'captain' && <span style={{ fontSize: '9px', background: 'rgba(255,215,0,0.15)', color: '#B8860B', padding: '2px 7px', borderRadius: '10px', fontWeight: '900' }}>⚑ CAPTAIN</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '3px' }}>
                        <span style={{ fontSize: '10px', color: '#6f8e7c', fontWeight: '700' }}>✓ {earned} pts</span>
                        {pending > 0 && <span style={{ fontSize: '10px', color: '#c99d5d', fontWeight: '700' }}>⏳ {pending}</span>}
                        {retries > 0 && <span style={{ fontSize: '10px', color: '#d27440', fontWeight: '700' }}>↩ {retries}</span>}
                        <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '700', marginLeft: 'auto' }}>
                          {teamTotal > 0 ? Math.round((earned / teamTotal) * 100) : 0}% contribution
                        </span>
                      </div>
                    </div>

                    {/* Total Points */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>{member.points || 0}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: '600' }}>pts</div>
                    </div>

                    {/* Expand chevron */}
                    <div style={{ color: 'rgba(83,55,43,0.3)', fontSize: '16px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</div>
                  </div>

                  {/* Expanded Submission Log */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ borderTop: '1px solid rgba(83,55,43,0.08)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(83,55,43,0.02)' }}>
                          {subs.length === 0 ? (
                            <p style={{ textAlign: 'center', opacity: 0.4, fontSize: '12px', padding: '12px 0', margin: 0 }}>No submissions yet</p>
                          ) : (
                            subs.map(sub => {
                              const cfg = statusConfig[sub.status] || statusConfig.pending;
                              const title = sub.tasks?.title || (sub.flashcards?.text ? `WILDCARD: ${sub.flashcards.text}` : 'Unknown');
                              const pts = sub.points || sub.tasks?.points || sub.flashcards?.points || 0;
                              const dayLabel = sub.tasks?.day ? `Day ${sub.tasks.day}` : 'Wildcard';
                              return (
                                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'white', borderRadius: '12px', border: `1px solid ${cfg.color}18` }}>
                                  <div style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '8px', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '12px' }}>
                                    {cfg.icon}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: '0 0 1px 0', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
                                    <p style={{ margin: 0, fontSize: '9px', color: 'var(--text-secondary)', fontWeight: '600' }}>{dayLabel} · {new Date(sub.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                    {sub.rejection_comment && <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#d27440', fontStyle: 'italic' }}>"{sub.rejection_comment}"</p>}
                                  </div>
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: sub.status === 'approved' ? '#6f8e7c' : 'rgba(83,55,43,0.25)' }}>
                                      {sub.status === 'approved' ? `+${pts}` : pts}
                                    </div>
                                    <div style={{ fontSize: '8px', fontWeight: '700', color: cfg.color, textTransform: 'uppercase' }}>{cfg.label}</div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
        </div>
      )}
    </motion.div>
  );
};




// --- Habit Tracker Page ---
// --- Habit Tracker Page ---
// --- Habit Tracker Page ---
// --- Habit Tracker Page ---
const HabitTrackerPage = ({ profile, currentDay, onUpload }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Navigation State
  const initialWeek = Math.min(3, Math.ceil(currentDay / 7) || 1);
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  const [viewDay, setViewDay] = useState(currentDay);

  const isIndependent = !profile?.team_name || profile?.team_name === 'Independent';

  useEffect(() => {
    if (isIndependent) {
      setIsLoading(false);
      return;
    }
    fetchAllData();
    const subChannel = supabase.channel('habit-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions', filter: `user_id=eq.${profile.id}` }, () => {
        fetchAllData();
      })
      .subscribe();
    return () => supabase.removeChannel(subChannel);
  }, [profile.id, isIndependent]);

  const fetchAllData = async () => {
    try {
      const { data: tasksData } = await supabase.from('tasks').select('*').order('day', { ascending: true });
      const { data: subsData } = await supabase.from('submissions').select('*').eq('user_id', profile.id);
      setAllTasks(tasksData || []);
      setAllSubmissions(subsData || []);
    } catch (error) {
      console.error('Habit tracker fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeDayTasks = allTasks.filter(t => t.day === viewDay);
  const activeTitles = [...new Set(activeDayTasks.map(t => t.title))];

  const getHabitStatus = (title, day) => {
    const task = allTasks.find(t => t.title === title && t.day === day);
    if (!task) return 'none';
    const sub = allSubmissions.find(s => s.task_id === task.id);
    return sub?.status || 'pending';
  };

  const getStatusColor = (idx) => {
    const colors = ['#9f4022', '#6f8e7c', '#c99d5d', '#d27440', '#53372b', '#FF6B6B'];
    return colors[idx % colors.length];
  };

  const renderApprovedBadge = (color) => (
    <div className="scribble-container">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#9f4022',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(159, 64, 34, 0.2)'
        }}
      >
        <Check size={18} color="white" strokeWidth={3} />
      </motion.div>
    </div>
  );

  const weekStart = (selectedWeek - 1) * 7 + 1;
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ paddingBottom: '120px' }}>
      <AnimatePresence>
        {selectedProtocol && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProtocol(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(83, 55, 43, 0.4)', backdropFilter: 'blur(8px)' }}
            />
            <div style={{ position: 'fixed', inset: 0, zIndex: 5001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', pointerEvents: 'none' }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  maxHeight: '90vh',
                  background: 'white',
                  borderRadius: '32px',
                  padding: '32px',
                  boxShadow: '0 30px 60px rgba(83, 55, 43, 0.2)',
                  position: 'relative',
                  pointerEvents: 'auto',
                  overflowY: 'auto'
                }}
              >
                <button
                  onClick={() => setSelectedProtocol(null)}
                  style={{ position: 'absolute', top: '24px', right: '24px', background: '#f5f2e9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={20} color="#53372b" />
                </button>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#9f4022', letterSpacing: '0.1em' }}>PROTOCOL INTELLIGENCE</span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: '#1a1a1a', margin: '4px 0' }}>{selectedProtocol.title}</h2>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <div style={{ background: '#ede0d0', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#53372b' }}>DAY {selectedProtocol.day}</div>
                    <div style={{ background: 'rgba(116, 116, 64, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#747440' }}>{selectedProtocol.points} PTS</div>
                  </div>
                </div>

                <div style={{ background: '#f5f2e9', padding: '20px', borderRadius: '20px', marginBottom: '24px', border: '1px solid rgba(83, 55, 43, 0.05)' }}>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#53372b' }}>{selectedProtocol.description}</p>
                </div>

                <TaskCard
                  task={selectedProtocol}
                  minimal={true}
                  onAction={(task, file) => {
                    onUpload(task, file);
                    setSelectedProtocol(null);
                  }}
                  isLocked={selectedProtocol.day > currentDay}
                  isHistory={selectedProtocol.day < currentDay}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      {isIndependent ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#ede0d0', borderRadius: '40px', border: '1px solid #c6c6c6', marginTop: '40px' }}>
          <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 10px 25px rgba(83, 55, 43, 0.05)' }}>
            <ShieldAlert size={40} color="#9f4022" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: '#53372b', marginBottom: '16px' }}>Tracker Locked</h2>
          <p style={{ color: '#53372b', opacity: 0.7, fontSize: '16px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
            Alignment with a Tactical Unit is required to unlock your operational consistency grid.
          </p>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '56px', marginBottom: '12px', color: '#53372b' }}>Consistency Grid</h1>
            <p style={{ color: '#53372b', opacity: 0.6, fontSize: '18px', fontWeight: '500', maxWidth: '600px', margin: '0 auto' }}>Track your evolution through focused daily protocols.</p>

            <div className="premium-tab-container" style={{ marginTop: '40px' }}>
              {[1, 2, 3].map(w => {
                const isLockedWeek = currentDay < (w - 1) * 7 + 1;
                return (
                  <button
                    key={w}
                    disabled={isLockedWeek}
                    onClick={() => {
                      if (isLockedWeek) return;
                      setSelectedWeek(w);
                      setViewDay((w - 1) * 7 + 1);
                    }}
                    className={`premium-tab ${selectedWeek === w ? 'active' : ''} ${isLockedWeek ? 'locked' : ''}`}
                    style={{ position: 'relative', color: selectedWeek === w ? 'white' : '#53372b' }}
                  >
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Week {w}
                      {isLockedWeek && <Lock size={12} />}
                    </span>
                    {selectedWeek === w && (
                      <motion.div
                        layoutId="weekTab"
                        className="tab-indicator"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        style={{ position: 'absolute', inset: 0, background: '#9f4022' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '120px' }}>
              <div className="loader" style={{ width: '48px', height: '48px', border: '3px solid #ede0d0', borderTop: '3px solid #9f4022', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : (
            <div className="habit-tracker-container">
              <div className="habit-table-wrapper">
                <table className="habit-table">
                  <thead>
                    <tr>
                      <th className="habit-col">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '0.1em' }}>PROTOCOLS FOR</span>
                          <span style={{ fontSize: '16px', color: '#9f4022', fontFamily: 'var(--font-heading)' }}>DAY {viewDay}</span>
                        </div>
                      </th>
                      {weekDays.map(d => (
                        <th
                          key={d}
                          onClick={() => setViewDay(d)}
                          style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            color: d === currentDay ? '#9f4022' : (viewDay === d ? '#1a1a1a' : '#c6c6c6'),
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}>
                            <span style={{ fontSize: '15px', fontWeight: viewDay === d ? '900' : '700' }}>{d}</span>
                            {d === currentDay && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#9f4022', marginTop: '6px' }} />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {activeTitles.length > 0 ? activeTitles.map((title, idx) => {
                        return (
                          <motion.tr
                            key={title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <td
                              className="habit-name-cell"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const t = allTasks.find(task => task.title === title && task.day === viewDay);
                                if (t) {
                                  const sub = allSubmissions.find(s => s.task_id === t.id);
                                  setSelectedProtocol({ ...t, status: sub?.status || 'pending', rejection_comment: sub?.rejection_comment });
                                }
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{title}</span>
                                <ChevronRight size={14} opacity={0.3} />
                              </div>
                            </td>
                            {weekDays.map(d => {
                              const status = getHabitStatus(title, d);
                              const isToday = d === currentDay;
                              const isLocked = d > currentDay;
                              const isApproved = status === 'approved';
                              const isSelectedDay = d === viewDay;

                              return (
                                <td
                                  key={d}
                                  className={`habit-status-cell ${isToday ? 'is-today' : ''} ${isLocked ? 'is-future' : ''} ${isApproved ? 'is-approved' : ''}`}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', position: 'relative' }}>
                                    {isApproved && renderApprovedBadge()}
                                    {status === 'under-review' && (
                                      <motion.div
                                        animate={{ rotate: [0, 180, 180, 360, 360] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.5, 0.9, 1] }}
                                        style={{ color: '#9f4022' }}
                                      >
                                        <Hourglass size={16} />
                                      </motion.div>
                                    )}
                                    {status === 'pending' && !isLocked && <div className="task-dot" style={{ background: '#747440', width: '6px', height: '6px' }} />}
                                    {isLocked && <Lock size={12} style={{ opacity: 0.1 }} />}
                                  </div>
                                </td>
                              );
                            })}
                          </motion.tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={8} style={{ padding: '80px', textAlign: 'center', color: '#53372b', opacity: 0.4, fontStyle: 'italic' }}>
                            Zero protocols detected for Day {viewDay}.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isLoading && (
            <div style={{
              marginTop: '60px',
              background: 'linear-gradient(135deg, #53372b 0%, #9f4022 100%)',
              color: 'white',
              padding: '48px',
              borderRadius: '40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 25px 60px rgba(159, 64, 34, 0.2)'
            }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Total Approved</p>
                <div style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>{allSubmissions.filter(s => s.status === 'approved').length}</div>
              </div>
              <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Active Streak</p>
                <div className="streak-highlight" style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', color: '#fff !important' }}>{profile?.streak || 0} Days</div>
              </div>
              <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Total Prowess</p>
                <div style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>{profile?.points || 0} pts</div>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [flashCards, setFlashCards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showRulesGatekeeper, setShowRulesGatekeeper] = useState(false);
  const [clan, setClan] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeAlert, setActiveAlert] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const alertTimerRef = useRef(null);

  useEffect(() => {
    // 1. Initial Session Check — with bad_jwt auto-recovery
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      // Detect expired/corrupt JWT and auto-clear it
      if (error?.message?.includes('JWT') || error?.code === 'bad_jwt' || error?.code === 'token_expired') {
        console.warn('Bad JWT detected — clearing session and redirecting to login.');
        supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        setSession(null);
        setIsInitializing(false);
        return;
      }
      setSession(session);
      if (session) {
        initUser(session.user).then(() => setIsInitializing(false));
      } else {
        setIsInitializing(false);
      }
    });

    // 2. Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) initUser(session.user);
      else {
        setProfile(null);
        setTasks([]);
      }
    });

    // 3. Realtime Subscriptions
    const flashChannel = supabase.channel('flash').on('postgres_changes', { event: '*', schema: 'public', table: 'flashcards' }, fetchData).subscribe();
    const taskChannel = supabase.channel('tasks').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchData).subscribe();
    const subChannel = supabase.channel('subs').on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, fetchData).subscribe();
    const profilesChannel = supabase.channel('profiles-all').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, fetchData).subscribe();
    const settingsChannel = supabase.channel('settings').on('postgres_changes', { event: '*', schema: 'public', table: 'challenge_settings' }, fetchChallengeSettings).subscribe();

    // NEW: Realtime Alert Monitor
    const alertChannel = supabase.channel('system-alerts').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'flashcards',
      filter: 'type=eq.alert'
    }, (payload) => {
      console.log('Incoming Urgent Alert:', payload);
      handleNewAlert(payload.new.text);
    }).subscribe();

    fetchChallengeSettings();
    fetchCurrentAlert();

    // 4. Polling Fallback: Refresh data every 30 seconds to ensure consistency
    const pollInterval = setInterval(() => {
      verifyUserExistence();
      fetchData();
      fetchChallengeSettings();
    }, 20000); // 20s backup (Realtime handles the speed)

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(flashChannel);
      supabase.removeChannel(taskChannel);
      supabase.removeChannel(subChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(alertChannel);
      clearInterval(pollInterval);
    };
  }, []);

  const handleNewAlert = (alertData) => {
    // alertData can be coming from fetch or realtime
    if (!alertData || !alertData.text) return;

    // Check if it's already dismissed by the user
    const dismissedId = localStorage.getItem('last_dismissed_alert');
    if (dismissedId === alertData.id?.toString()) return;

    // Check if it's actually alive
    if (new Date(alertData.deadline) < new Date()) return;

    setActiveAlert(alertData);

    // Auto-clear logic: the timer should match the remaining deadline or 60s max for non-persistent UI?
    // User wants it to "stay", so we only auto-clear when it hits the deadline.
    const remainingMs = new Date(alertData.deadline).getTime() - Date.now();

    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => {
      setActiveAlert(null);
    }, Math.min(remainingMs, 3600000)); // Max 1 hour auto-refresh check
  };

  const verifyUserExistence = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
    if (!data) {
      console.warn('Security Protocol: User record not found. Finalizing termination.');
      handleLogout();
    }
  };

  const fetchCurrentAlert = async () => {
    const { data } = await supabase
      .from('flashcards')
      .select('*')
      .eq('type', 'alert')
      .gt('deadline', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (data?.[0]) {
      handleNewAlert(data[0]);
    }
  };

  // 4. Identity-Based Realtime Listener
  useEffect(() => {
    if (!session?.user?.id) return;

    const profileChannel = supabase.channel(`profile-${session.user.id}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` },
        () => {
          console.log('Realtime Team/Point Update Received');
          initUser(session.user);
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [session?.user?.id]);

  // Re-fetch data whenever profile or selectedDay changes
  useEffect(() => {
    if (session && profile) {
      fetchData();
    }
  }, [session, profile, selectedDay]);

  const fetchChallengeSettings = async () => {
    try {
      const { data, error } = await supabase.from('challenge_settings').select('start_date').eq('id', 1).single();
      if (error) throw error;
      const start = new Date(data.start_date);
      const now = new Date();

      // Calendar Day Calculation: Compare local dates (Year/Month/Day)
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const diffTime = nowDateOnly.getTime() - startDateOnly.getTime();
      const day = Math.max(1, Math.min(28, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));

      setCurrentDay(day);
      // Default to current day on first load
      if (selectedDay === 1) setSelectedDay(day);
    } catch (e) {
      console.error('Settings Error:', e);
    }
  };

  const initUser = async (user) => {
    setAuthError(null);

    // 1. Domain Check: Only block @hbplus.fit if they aren't explicitly marked as admin in metadata or DB
    // (Admin check is deferred until we see the profile role)

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id);
    const profileData = data?.[0];

    if (profileData) {
      // 2. Deactivation Check
      if (profileData.is_allowed === false) {
        await supabase.auth.signOut();
        setAuthError('PROTOCOL TERMINATED: You have been DISQUALIFIED! 🚫 Looks like the system couldn’t handle your intensity. (Don’t worry, we still believe in you! 😉)');
        return;
      }

      // 3. Domain Restriction (Skip for admins)
      const isInternalDomain = user.email?.toLowerCase().endsWith('@hbplus.fit');
      const isAdmin = profileData.role === 'admin' || profileData.is_admin === true;

      if (isInternalDomain && !isAdmin) {
        await supabase.auth.signOut();
        setAuthError('The @hbplus.fit domain is reserved for Administrative personnel on this platform.');
        return;
      }

      if (!profileData.email) await supabase.from('profiles').update({ email: user.email }).eq('id', user.id);
      setProfile({ ...profileData, email: user.email });
      
      // Check for rules acceptance via localStorage
      const acceptedRules = localStorage.getItem(`rules_accepted_${user.id}`);
      if (acceptedRules !== 'true') {
        setShowRulesGatekeeper(true);
      }
      
      fetchClanData(profileData.team_name);
    } else {
      // New User logic: Check domain before creating profile
      if (user.email?.toLowerCase().endsWith('@hbplus.fit')) {
        await supabase.auth.signOut();
        setAuthError('New accounts cannot be created with an @hbplus.fit domain via this portal.');
        return;
      }

      const { data: nP } = await supabase.from('profiles').insert([{
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name || user.email.split('@')[0],
        team_name: 'Independent',
        points: 0,
        streak: 1,
        is_allowed: true,
        created_at: new Date().toISOString()
      }]).select().single();
      if (nP) {
        setProfile(nP);
        setShowRulesGatekeeper(true); // Always show for new users
        fetchClanData('Independent');
      }
    }
  };

  const fetchClanData = async (teamName) => {
    if (!teamName || teamName === 'Independent') {
      setClan(null);
      return;
    }
    const { data } = await supabase.from('clans').select('*').eq('name', teamName).single();
    if (data) setClan(data);
  };

  const handleFlashcardAction = async (cardId, action) => {
    console.log('Action Triggered:', action, cardId);
    if (!session?.user) return;

    try {
      if (action === 'interested') {
        const { error: insErr } = await supabase.from('submissions').insert({
          user_id: session.user.id,
          flashcard_id: cardId,
          status: 'pending'
        });
        if (insErr) throw insErr;
        setSuccessMessage('Challenge accepted!');
      } else {
        // Permanent Dismissal: Save as 'rejected' so it disappears forever for this user
        await supabase.from('submissions').upsert({
          user_id: session.user.id,
          flashcard_id: cardId,
          status: 'rejected',
          updated_at: new Date()
        }, { onConflict: 'user_id,flashcard_id' });

        setSuccessMessage('Broadcast dismissed.');
      }

      // Optimistically update local state for immediate response
      setFlashCards(prev => prev.filter(f => f.id !== cardId));
      fetchData();
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (e) {
      console.error('Fatal interaction error:', e);
      alert(`System Error: ${e.message}`);
    }
  };

  const fetchData = async () => {
    if (!session?.user) return;

    // Safety: Verify profile still exists during every data fetch
    const { data: pCheck } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
    if (!pCheck) {
      handleLogout();
      return;
    }
    try {
      const day = selectedDay;
      const wk = Math.ceil(day / 7);

      // 1. Fetch Tasks & Submissions
      const { data: tD } = await supabase.from('tasks').select('*').eq('week', wk).eq('day', day);
      const { data: sD } = await supabase.from('submissions').select('*').eq('user_id', session.user.id);

      const safeTasks = tD || [];
      const safeSubs = sD || [];

      const mergedTasks = safeTasks.map(t => {
        const sub = safeSubs.find(s => s.task_id === t.id);
        return {
          ...t,
          status: sub?.status || 'pending',
          rejection_comment: sub?.rejection_comment || null
        };
      });

      // 2. Fetch Flashcards (Targeted + 24 HOUR VALIDITY + DEADLINE)
      const now = new Date();
      const { data: fD } = await supabase
        .from('flashcards')
        .select('*')
        .or(`target_user_id.is.null,target_user_id.eq.${session.user.id}`)
        .neq('type', 'alert')
        .order('created_at', { ascending: false });

      let safeFlashcards = (fD || []).filter(f => {
        if (!f.deadline) return true; // No deadline = always show
        return new Date(f.deadline) > now;
      });
      const interestedFlashcardIds = safeSubs.filter(s => s.flashcard_id).map(s => s.flashcard_id);

      const flashcardTasks = safeFlashcards
        .filter(f => interestedFlashcardIds.includes(f.id))
        .map(f => ({
          id: `fc-${f.id}`,
          flashcard_id: f.id,
          title: `WILDCARD: ${f.text}`,
          description: f.description,
          points: f.points || 50,
          proof_mode: f.proof_mode || 'both',
          status: safeSubs.find(s => s.flashcard_id === f.id)?.status || 'pending'
        }));

      setTasks([...mergedTasks, ...flashcardTasks]);
      setFlashCards(safeFlashcards.filter(f => !interestedFlashcardIds.includes(f.id)));

      const { data: bD } = await supabase.from('profiles').select('*').order('points', { ascending: false });
      setLeaderboard(bD || []);
    } catch (e) {
      console.error('Fetch data failure', e);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUploadAction = async (task, file) => {
    if (!session?.user) return;
    try {
      let fUrl = null;
      const taskKey = task.flashcard_id ? `f-${task.flashcard_id}` : `t-${task.id}`;

      if (file) {
        let fileToUpload = file;

        // --- Image Compression Protocol ---
        if (file.type.startsWith('image/')) {
          console.log(`[Compression] Original: ${(file.size / 1024).toFixed(2)} KB`);
          const options = {
            maxSizeMB: 0.058, // Target ~60KB
            maxWidthOrHeight: 1200,
            useWebWorker: true
          };
          try {
            fileToUpload = await imageCompression(file, options);
            console.log(`[Compression] Final: ${(fileToUpload.size / 1024).toFixed(2)} KB`);
          } catch (cErr) {
            console.error('[Compression] Failed, using original', cErr);
          }
        }

        const fName = `${session.user.id}/${taskKey}-${Date.now()}`;
        const { error: uE } = await supabase.storage.from('proofs').upload(fName, fileToUpload);
        if (!uE) fUrl = supabase.storage.from('proofs').getPublicUrl(fName).data.publicUrl;
      }

      const upsertData = {
        user_id: session.user.id,
        status: task.proof_mode === 'checkbox' ? 'approved' : 'under-review',
        file_url: fUrl,
        updated_at: new Date()
      };

      let result;
      if (task.flashcard_id) {
        upsertData.flashcard_id = task.flashcard_id;
        result = await supabase.from('submissions').upsert(upsertData, { onConflict: 'user_id,flashcard_id' });
      } else {
        upsertData.task_id = task.id;
        result = await supabase.from('submissions').upsert(upsertData, { onConflict: 'user_id,task_id' });
      }

      // --- AUTO-AWARD POINTS FOR CHECKBOX TASKS ---
      if (task.proof_mode === 'checkbox' && !result.error) {
        const { data: currentProfile, error: pErr } = await supabase.from('profiles').select('points').eq('id', session.user.id).single();
        if (!pErr && currentProfile) {
          const newPoints = (currentProfile.points || 0) + (task.points || 0);
          await supabase.from('profiles').update({ points: newPoints }).eq('id', session.user.id);
          
          // 2. Update Ledger
          const { error: ldErr } = await supabase.from('point_ledger').insert({
            user_id: session.user.id,
            points: task.points || 0,
            source_type: 'task',
            source_id: task.id.toString(),
            reason: `Self-declaration: ${task.title}`,
            day: currentDay,
            week: Math.ceil(currentDay / 7)
          });

          if (ldErr) {
            console.error('Ledger Error:', ldErr);
          }

          console.log(`Auto-awarded ${task.points} points for self-declaration task.`);
        } else {
          console.error('Failed to fetch profile for auto-award:', pErr);
        }
      }

      if (result.error) {
        console.error('DB Upsert Error:', result.error);
        alert(`Upload Link Failed: Please make sure you ran the SQL for 'unique' constraints. Error: ${result.error.message}`);
        return;
      }

      setSuccessMessage('Proof submitted for review!');
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error('Upload system fatal error:', e);
      alert(`System Error: ${e.message}`);
    }
  };

  const handleUpdateProfile = async ({ name, avatar }) => {
    if (!session?.user) return;
    try {
      let updates = {};
      if (name) updates.name = name;

      if (avatar) {
        let avatarToUpload = avatar;

        // --- Avatar Compression Protocol ---
        if (avatar.type.startsWith('image/')) {
          const options = {
            maxSizeMB: 0.05, // Avatars can be even smaller
            maxWidthOrHeight: 400, // No need for high res avatars
            useWebWorker: true
          };
          try {
            avatarToUpload = await imageCompression(avatar, options);
            console.log(`[Avatar] Compressed to ${(avatarToUpload.size / 1024).toFixed(2)} KB`);
          } catch (e) {
            console.error('Avatar compression failed', e);
          }
        }

        const fName = `avatars/${session.user.id}-${Date.now()}`;
        const { error: uE } = await supabase.storage.from('proofs').upload(fName, avatarToUpload);
        if (!uE) {
          const fUrl = supabase.storage.from('proofs').getPublicUrl(fName).data.publicUrl;
          updates.avatar_url = fUrl;
        } else {
          console.error('Avatar upload failed', uE);
        }
      }

      const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id);
      if (error) throw error;

      setProfile(prev => ({ ...prev, ...updates }));
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error('Profile update failed:', e);
      alert(`Update Failed: ${e.message}`);
    }
  };


  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--hb-cream)', gap: '24px' }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={logoImg} alt="HB+" style={{ width: '80px', height: 'auto' }} />
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div className="loader" style={{ width: '24px', height: '24px', border: '2px solid rgba(159, 64, 34, 0.1)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', opacity: 0.6 }}>Synchronizing Protocol...</p>
        </div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="login-screen">
        {/* Left Side: Visual Narrative */}
        <aside className="login-aside">
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop"
            alt="Luxury Wellness"
          />
          <div className="login-aside-overlay">
            <div className="login-aside-text">
              <h2>Elevate Your <br />Performance.</h2>
              <p style={{ opacity: 0.8, fontSize: '18px', fontWeight: '300' }}>The science of wellness, <br />refined for the modern achiever.</p>
            </div>
          </div>
        </aside>

        {/* Right Side: Authentication */}
        <main className="login-main">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="login-card"
          >
            <div className="login-logo" style={{ overflow: 'hidden', padding: 0 }}>
              <img src={logoImg} alt="HB+" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h1>Members Only</h1>
            <p>Welcome back. Please authenticate with your Google account to access your personalized protocol dashboard.</p>

            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="glass-card"
                  style={{
                    background: 'rgba(159, 64, 34, 0.1)',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    textAlign: 'left'
                  }}
                >
                  {authError.includes('DISQUALIFIED') ? <span style={{ fontSize: '24px' }}>🤪</span> : <ShieldAlert size={24} />}
                  <span style={{ lineHeight: '1.4' }}>{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleGoogleLogin}
              className="google-login-btn"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign In with Google
            </button>

            <div className="login-footer">
              HB+ PERFORMANCE SYSTEMS
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout-root">
      
      <AnimatePresence>
        {showRulesGatekeeper && (
          <RulesGatekeeper onAccept={() => {
            if (session?.user?.id) {
              localStorage.setItem(`rules_accepted_${session.user.id}`, 'true');
            }
            setShowRulesGatekeeper(false);
          }} />
        )}
      </AnimatePresence>

      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)} />}

      <nav className={`bottom-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-logo-section">
          <div className="logo-box" onClick={() => { setPage('home'); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>
            <img src={logoImg} alt="HB+" />
          </div>
        </div>

        <div className="nav-items-container">
          <button className={`nav-item ${page === 'home' ? 'active' : ''}`} onClick={() => { setPage('home'); setIsMenuOpen(false); }}>
            <HomeIcon size={20} /> <span>Home</span>
          </button>
          <button className={`nav-item ${page === 'board' ? 'active' : ''}`} onClick={() => { setPage('board'); setIsMenuOpen(false); }}>
            <Trophy size={20} /> <span>Leaderboard</span>
          </button>
          <button className={`nav-item ${page === 'team' ? 'active' : ''}`} onClick={() => { setPage('team'); setIsMenuOpen(false); }}>
            <Users size={20} /> <span>Team Hub</span>
          </button>
          {profile?.role === 'captain' && (
            <button className={`nav-item ${page === 'captain-dashboard' ? 'active' : ''}`} onClick={() => { setPage('captain-dashboard'); setIsMenuOpen(false); }}>
              <Award size={20} /> <span>Captain Console</span>
            </button>
          )}
          <button
            className={`nav-item ${page === 'profile' ? 'active' : ''}`}
            onClick={() => { setPage('profile'); setIsMenuOpen(false); }}
            style={profile?.role === 'captain' && page === 'profile' ? {
              background: 'rgba(255, 215, 0, 0.1)',
              color: '#B8860B',
              borderLeft: '4px solid #FFD700'
            } : profile?.role === 'captain' ? {
              color: '#B8860B'
            } : {}}
          >
            <User size={20} color={profile?.role === 'captain' ? '#B8860B' : 'currentColor'} /> <span>My Account</span>
          </button>

          {/* Mobile-only About Button */}
          <button className="nav-item mobile-only-btn" onClick={() => setIsAboutOpen(true)}>
            <Globe size={20} /> <span>About Us</span>
          </button>
        </div>

        {/* Social & Contact Section (Sidebar Footer - Hidden on Mobile) */}
        <div className="desktop-only-contact" style={{
          marginTop: 'auto',
          padding: '32px 24px',
          borderTop: '1px solid rgba(83, 55, 43, 0.15)',
          background: 'rgba(83, 55, 43, 0.02)',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <ContactSection logoImg={logoImg} />
        </div>

        <div className="logout-container">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={20} /> <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Persistent Branding Header / Lifestyle Test CTA (Responsive) */}
        <div className="header-cta-container">
          <button
            onClick={() => window.open('https://onboarding.hbplus.fit/', '_blank')}
            className="cta-lifestyle-btn"
          >
            Take the Lifestyle Test
          </button>
        </div>
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)', background: 'var(--success-bg)', color: 'var(--success-text)', padding: '16px 32px', borderRadius: '16px', zIndex: 3000, fontWeight: '700', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* High-End Center Modal Broadcast (System Signal) */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  background: '#1a1a1a',
                  width: '100%',
                  maxWidth: '450px',
                  borderRadius: '0', // Sharp/Premium look or very small radius
                  padding: '48px',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center',
                  color: 'white',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                }}
              >
                <button
                  onClick={() => {
                    localStorage.setItem('last_dismissed_alert', activeAlert.id?.toString());
                    setActiveAlert(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'white',
                    color: 'black',
                    border: 'none',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  <X size={16} />
                </button>

                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'white',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }}>
                    <img src={logoImg} alt="HB+" style={{ width: '40px' }} />
                  </div>

                  <div style={{ width: '40px', height: '2px', background: '#a04022', margin: '0 auto 24px' }} />

                  <p style={{
                    fontSize: '22px',
                    fontFamily: "'Bodoni Moda', serif",
                    fontStyle: 'italic',
                    lineHeight: '1.5',
                    color: 'white',
                    fontWeight: '500',
                    margin: 0,
                    letterSpacing: '-0.01em'
                  }}>
                    "{activeAlert.text}"
                  </p>
                </div>

                <div style={{ marginTop: '40px' }}>
                  <button
                    onClick={() => {
                      localStorage.setItem('last_dismissed_alert', activeAlert.id?.toString());
                      setActiveAlert(null);
                    }}
                    style={{
                      background: '#a04022',
                      color: 'white',
                      border: 'none',
                      padding: '16px 48px',
                      fontWeight: '900',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 10px 20px rgba(160, 64, 34, 0.3)',
                      borderRadius: '4px'
                    }}
                  >
                    Acknowledge Signal
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage
            tasks={tasks}
            flashCards={flashCards}
            currentDay={currentDay}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onUpload={handleUploadAction}
            onFlashcardAction={handleFlashcardAction}
            profile={profile}
          />}
          {page === 'board' && <BoardPage key="board" leaderboard={leaderboard} profile={profile} currentDay={currentDay} />}
          {page === 'log' && <PointsLogPage key="log" profile={profile} />}
          {page === 'habit-tracker' && <HabitTrackerPage key="habit-tracker" profile={profile} currentDay={currentDay} onUpload={handleUploadAction} />}
          {page === 'team' && <TeamPage key="team" profile={profile} leaderboard={leaderboard} clan={clan} />}
          {page === 'captain-dashboard' && <CaptainDashboard key="captain" profile={profile} leaderboard={leaderboard} />}
          {page === 'profile' && <ProfilePage key="profile" profile={profile} onUpdate={handleUpdateProfile} onLogout={handleLogout} onNavigate={setPage} />}
        </AnimatePresence>

        {/* About Us Side Drawer (Mobile) */}
        <AnimatePresence>
          {isAboutOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAboutOpen(false)}
                className="overlay"
                style={{ zIndex: 4000 }}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '300px',
                  height: '100%',
                  background: 'var(--nav-bg)',
                  zIndex: 4001,
                  padding: '40px 24px',
                  boxShadow: '10px 0 30px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', margin: 0 }}>About Us</h2>
                  <button
                    onClick={() => setIsAboutOpen(false)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <X size={24} />
                  </button>
                </div>

                <ContactSection logoImg={logoImg} />

                <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '10px', opacity: 0.5, fontWeight: 'bold', letterSpacing: '0.1em' }}>
                  PROTOCOL VERSION 2.1.0
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Helper Sub-components ---
const ContactSection = ({ logoImg }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        onClick={() => window.open('https://hbplus.fit/hophome', '_blank')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          padding: '16px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(160, 64, 34, 0.08)',
          border: '1px solid rgba(160, 64, 34, 0.05)',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', borderRadius: '10px' }}>
          <img src={logoImg} style={{ width: '24px', mixBlendMode: 'screen' }} />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '900', color: '#a04022', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hop Studio</span>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 4px' }}>
        {/* Address Row */}
        <motion.div
          whileHover={{ x: 3 }}
          onClick={() => window.open('https://www.google.com/maps?ll=20.315335,85.820627&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=3221341388707029373', '_blank')}
          style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{ width: '24px', display: 'flex', justifyContent: 'center', paddingTop: '2px' }}>
            <MapPin size={16} color="#a04022" />
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(83, 55, 43, 0.7)', fontWeight: '600', lineHeight: '1.5' }}>
            HaSel Health and Wellness Pvt Ltd<br />Samanta Vihar, CS Pur, BBSR
          </span>
        </motion.div>

        {/* Phone Row */}
        <motion.div
          whileHover={{ x: 3 }}
          onClick={() => window.open('https://wa.me/917848094954', '_blank')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
            <Phone size={16} color="#a04022" />
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(83, 55, 43, 0.7)', fontWeight: '600' }}>+91 7848094954</span>
        </motion.div>

        {/* Email Row */}
        <motion.div
          whileHover={{ x: 3 }}
          onClick={() => {
            copyToClipboard('info@hbplus.fit');
            window.location.href = 'mailto:info@hbplus.fit';
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
            <Mail size={16} color="#a04022" />
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(83, 55, 43, 0.7)', fontWeight: '600' }}>info@hbplus.fit</span>
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: '20px', color: '#53372b', padding: '10px 4px', marginTop: '5px' }}>
        {[
          { Icon: Instagram, url: 'https://www.instagram.com/hopwith_hb/' },
          { Icon: Facebook, url: 'https://www.facebook.com/hbplus.fit' },
          { Icon: Linkedin, url: 'https://www.linkedin.com/company/hbplus/' },
          { Icon: Youtube, url: 'https://www.youtube.com/@hbplusofficial' },
          { Icon: Globe, url: 'https://hbplus.fit/' }
        ].map(({ Icon, url }, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3, color: '#a04022' }}
            onClick={() => window.open(url, '_blank')}
            style={{ cursor: 'pointer', opacity: 0.6 }}
          >
            <Icon size={20} />
          </motion.div>
        ))}
      </div>
    </>
  );
};
