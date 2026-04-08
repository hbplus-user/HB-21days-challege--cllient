import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Save
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

const TaskCard = ({ task, onAction, isLocked, isHistory }) => {
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const fileInputRef = useRef(null);
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

  const statusBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '700',
    width: '100%',
    transition: 'all 0.2s',
    border: '1px solid rgba(0,0,0,0.1)'
  };

  const getStatusButton = () => {
    if (isUploading) {
      return (
        <div className="status-badge" style={{ ...statusBadgeStyle, backgroundColor: '#fcfaf5', color: '#9f4022' }}>
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
    
    // New: Lock historical tasks
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
            {task.rejection_comment && (
              <p style={{ margin: '0 0 12px 0', padding: '10px 14px', background: 'rgba(210, 116, 64, 0.08)', color: '#d27440', borderRadius: '12px', fontSize: '11px', fontWeight: '600', borderLeft: '3px solid #d27440' }}>
                INSTRUCTION: {task.rejection_comment}
              </p>
            )}
            <button className="status-badge" style={{ ...statusBadgeStyle, backgroundColor: '#53372b', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
              <Upload size={18} style={{ marginRight: '8px' }} /> {task.status === 'retry' ? 'Try Again (Image)' : 'Upload Proof'}
            </button>
          </>
        );
      case 'under-review':
        return (
          <div className="status-badge" style={{ ...statusBadgeStyle, backgroundColor: '#f5f2e9', color: '#53372b', border: '1px solid #53372b' }}>
            <Clock size={18} style={{ marginRight: '8px' }} /> Under Review
          </div>
        );
      case 'approved':
        return (
          <div className="status-badge" style={{ ...statusBadgeStyle, backgroundColor: '#fcfaf5', color: '#6f8e7c', border: '1px solid #6f8e7c' }}>
            <CheckCircle size={18} style={{ marginRight: '8px' }} /> Approved (+{task.points} pts)
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '4px', color: 'var(--text-primary)' }}>{task.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{task.description || 'Follow the protocol above and upload your proof below.'}</p>
          </div>
          {task.points && <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>+{task.points} pts</span>}
        </div>
        {getStatusButton()}
      </div>
    </div>
  );
};
// --- Pages ---
// --- Pages ---

const HomePage = ({ tasks = [], flashCards = [], currentDay, selectedDay, onSelectDay, onUpload, onFlashcardAction }) => {
  const weekNum = Math.ceil(selectedDay / 7);
  const weekTitles = ["Foundation", "Commitment", "Ascension"];

  const isHistory = selectedDay < currentDay;
  const isLocked = selectedDay > currentDay;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
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
    </motion.div>
  );
};

const BoardPage = ({ leaderboard = [], profile, currentDay }) => {
  const [category, setCategory] = useState('Individual'); // 'Individual' | 'Teams'
  const [timeframe, setTimeframe] = useState('Overall'); // 'Daily' | 'Weekly' | 'Overall'
  const [pointsData, setPointsData] = useState({}); // { userId: { daily: 0, weekly: 0, overall: 0 } }
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['Individual', 'Teams'];
  const timeframes = ['Daily', 'Weekly', 'Overall'];

  const getAvatarInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  useEffect(() => {
    fetchDetailedPoints();
  }, []);

  const fetchDetailedPoints = async () => {
    setIsLoading(true);
    try {
      const { data: subs, error } = await supabase
        .from('submissions')
        .select(`
                user_id,
                status,
                task_id,
                flashcard_id,
                tasks(points, day, week),
                flashcards(points, created_at)
            `)
        .eq('status', 'approved');

      if (error) throw error;

      const currentWeek = Math.ceil(currentDay / 7);
      const userPoints = {};

      // Helper to check if a date string is from "today" in challenge context
      // Actually, for flashcards, we'll check if they match the 'currentDay' date
      // But simplified: we just check if tasks match daily/weekly columns

      subs.forEach(s => {
        const uid = s.user_id;
        if (!userPoints[uid]) userPoints[uid] = { daily: 0, weekly: 0, overall: 0 };

        let pts = 0;
        let isDaily = false;
        let isWeekly = false;

        if (s.tasks) {
          pts = s.tasks.points || 0;
          if (s.tasks.day === currentDay) isDaily = true;
          if (s.tasks.week === currentWeek) isWeekly = true;
        } else if (s.flashcards) {
          pts = s.flashcards.points || 0;
          // For flashcards, if it was created within last 24h, we count as daily for now
          // Or we can just sum them to overall. Let's assume they are daily if created "today"
          const createdDate = new Date(s.flashcards.created_at).toDateString();
          const todayDate = new Date().toDateString();
          if (createdDate === todayDate) isDaily = true;

          // Weekly check
          const diffTime = Math.abs(new Date() - new Date(s.flashcards.created_at));
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 7) isWeekly = true;
        }

        userPoints[uid].overall += pts;
        if (isDaily) userPoints[uid].daily += pts;
        if (isWeekly) userPoints[uid].weekly += pts;
      });

      setPointsData(userPoints);
    } catch (err) {
      console.error('Points Fetch Error:', err);
    }
    setIsLoading(false);
  };

  const displayData = useMemo(() => {
    const timeframeKey = timeframe.toLowerCase();

    // We use pointsData for daily/weekly, and leaderboard (profiles) for overall (most accurate)

    if (category === 'Teams') {
      const teamScores = {};
      leaderboard.forEach(u => {
        const team = u.team_name || 'Independent';
        if (team === 'Independent') return;

        const userPeriodPoints = pointsData[u.id]?.[timeframeKey] || 0;
        // Fallback for Overall if pointsData doesn't have it (shouldn't happen)
        const actualPoints = timeframe === 'Overall' ? (u.points || 0) : userPeriodPoints;

        teamScores[team] = (teamScores[team] || 0) + actualPoints;
      });
      return Object.entries(teamScores)
        .map(([name, points]) => ({ name, points, type: 'team' }))
        .sort((a, b) => b.points - a.points);
    } else {
      return leaderboard
        .map(u => {
          const userPeriodPoints = pointsData[u.id]?.[timeframeKey] || 0;
          const actualPoints = timeframe === 'Overall' ? (u.points || 0) : userPeriodPoints;
          return { ...u, points: actualPoints, type: 'user' };
        })
        .sort((a, b) => b.points - a.points);
    }
  }, [leaderboard, category, timeframe, pointsData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container leaderboard-container"
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px', fontStyle: 'italic' }}
        >
          Leaderboard
        </motion.h1>
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
                <motion.div
                  layoutId="category-active-bg"
                  className="tab-indicator"
                  style={{
                    position: 'absolute',
                    inset: '4px',
                    zIndex: 1
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
                <motion.div
                  layoutId="timeframe-underline"
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

      <motion.div
        layout
        className="leaderboard-list"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <AnimatePresence mode="popLayout">
          {displayData.map((item, idx) => {
            const rank = idx + 1;
            const isMe = item.type === 'user' && item.id === profile?.id;
            const isDenied = item.is_allowed === false;
            const key = item.type === 'user' ? item.id : `team-${item.name}`;

            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`ranking-card glass-card ${isMe ? 'me' : ''}`}
                style={{
                  borderLeft: isDenied ? '4px solid #666' : (rank <= 3 ? `4px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}` : '1px solid var(--border-color)'),
                  marginBottom: '0',
                  boxShadow: rank === 1 && !isDenied ? '0 0 20px rgba(255, 215, 0, 0.15)' : '',
                  transform: rank === 1 && !isDenied ? 'scale(1.02)' : 'scale(1)',
                  opacity: isDenied ? 0.6 : 1,
                  filter: isDenied ? 'grayscale(1)' : 'none'
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

                <div className="name-stack" style={{
                  flex: 1,
                  minWidth: '0',
                  overflow: 'hidden'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: isDenied ? 'line-through' : 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                    {item.role === 'captain' && (
                      <Award size={14} color="var(--accent)" style={{ flexShrink: 0 }} />
                    )}
                    {isMe && (
                      <span style={{
                        fontSize: '9px',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>You</span>
                    )}
                    {isDenied && (
                      <span style={{ fontSize: '9px', background: 'linear-gradient(90deg, #d27440, #a04022)', color: 'white', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em', boxShadow: '0 4px 10px rgba(210, 116, 64, 0.3)' }}>
                        DQ 🏃‍♂️💨
                      </span>
                    )}
                  </h4>
                  <p style={{ opacity: 0.5, fontSize: '12px' }}>
                    {item.type === 'user' ? (item.team_name || 'Independent') : 'Elite Squad'}
                  </p>
                </div>

                <div className="points-display" style={{ flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ color: isDenied ? '#666' : (rank <= 3 ? 'var(--text-primary)' : 'var(--accent)') }}>
                    {isDenied ? 'DQ' : item.points.toLocaleString()}
                  </span>
                  {!isDenied && <span className="points-label">pts</span>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const TeamPage = ({ profile, leaderboard = [], clan, onLogoUpdate }) => {
  const myTeamName = profile?.team_name || 'Independent';
  const teamMembers = leaderboard.filter(u => u.team_name === myTeamName);
  const totalTeamPoints = teamMembers.reduce((acc, curr) => acc + (curr.points || 0), 0);

  // Calculate Team Rank
  const teamScores = Array.from(new Set(leaderboard.map(u => u.team_name)))
    .map(name => ({
      name,
      points: leaderboard.filter(u => u.team_name === name).reduce((acc, curr) => acc + (curr.points || 0), 0)
    }))
    .sort((a, b) => b.points - a.points);

  const teamRank = teamScores.findIndex(s => s.name === myTeamName) + 1;

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
            {profile?.role === 'captain' && (
                <>
                    <button 
                        onClick={() => document.getElementById('clan-logo-input').click()}
                        style={{ position: 'absolute', bottom: '-8px', right: '-8px', background: 'var(--accent)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 16px rgba(159, 64, 34, 0.4)', transition: 'transform 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Camera size={18} />
                    </button>
                    <input 
                        id="clan-logo-input"
                        type="file" 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={(e) => onLogoUpdate(e.target.files[0])}
                    />
                </>
            )}
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
            <div key={member.id} className="ranking-card" style={{ padding: '16px 24px' }}>
              <div className="avatar-circle" style={{ width: '44px', height: '44px', border: member.role === 'captain' ? '2px solid #FFD700' : 'none', backgroundColor: member.role === 'captain' ? '#B8860B' : 'var(--card-bg)' }}>
                {member.role === 'captain' ? <Award size={20} color="white" /> : member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
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
              <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div className="member-progress-bar">
                  <div className="member-progress-fill" style={{ width: `${contributionPercent}%` }}></div>
                </div>
                <span className="member-percent">{contributionPercent}%</span>
              </div>
            </div>
          );
        })}
      </div>
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

const ProfilePage = ({ profile, onUpdate, onLogout }) => {
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
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                }}
            >
                <ShieldCheck size={20} /> Rules & Regulations
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
                        <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', margin: 0 }}>Rules & Regulations</h2>
                        <p style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>Maintenance of High-Performance Standards</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { title: '1. Daily Submission', text: 'Proofs must be uploaded before midnight each day. Late submissions are not accepted unless specifically authorized.' },
                            { title: '2. Verification Standard', text: 'Videos and photos must clearly show the protocol execution. Reflections and low-quality media may be rejected.' },
                            { title: '3. Streak Integrity', text: 'Consecutive daily participation is required to maintain your Heat Streak. missing a day resets your streak to zero.' },
                            { title: '4. Disqualification', text: 'Any attempt to bypass security or upload fraudulent proof will result in immediate disqualification from the 21-day challenge.' },
                            { title: '5. Team Conduct', text: 'Independent and Team members must maintain professionalism. Elite Squad status is maintained through consistency.' }
                        ].map((rule, i) => (
                            <div key={i} style={{ padding: '16px', background: 'var(--hb-cream)', borderRadius: '16px', border: '1px solid rgba(83, 55, 43, 0.05)' }}>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: 'var(--accent)' }}>{rule.title}</h4>
                                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{rule.text}</p>
                            </div>
                        ))}
                    </div>

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

// --- Main App ---

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
  const [clan, setClan] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeAlert, setActiveAlert] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const alertTimerRef = useRef(null);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
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

    // 3. Realtime Subscriptions (General)
    const flashChannel = supabase.channel('flash').on('postgres_changes', { event: '*', schema: 'public', table: 'flashcards' }, fetchData).subscribe();
    const taskChannel = supabase.channel('tasks').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchData).subscribe();
    const subChannel = supabase.channel('subs').on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, fetchData).subscribe();
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
      console.log('Performing periodic auto-refresh...');
      fetchData();
      fetchChallengeSettings();
    }, 10000);

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(flashChannel);
      supabase.removeChannel(taskChannel);
      supabase.removeChannel(subChannel);
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
      const day = Math.max(1, Math.min(21, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));

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
    console.log('App: Fetching latest data snapshot (Auto-Refresh)');
    if (!session?.user || profile?.is_allowed === false) return;
    try {
      const day = selectedDay;
      const wk = Math.ceil(day / 7);

      // 1. Fetch Tasks & Submissions
      const { data: tD } = await supabase.from('tasks').select('*').eq('week', wk).eq('day', day);
      const { data: sD } = await supabase.from('submissions').select('*').eq('user_id', session.user.id);

      const safeTasks = tD || [];
      const safeSubs = sD || [];

      const mergedTasks = safeTasks.map(t => ({
        ...t,
        status: safeSubs.find(s => s.task_id === t.id)?.status || 'pending'
      }));

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
          points: f.points || 50,
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
        status: 'under-review',
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

  const handleUpdateClanLogo = async (file) => {
      if (!profile?.team_name || profile.team_name === 'Independent') return;
      setIsSaving(true);
      try {
          let fileToUpload = file;
          // Compression
          const options = { maxSizeMB: 0.08, maxWidthOrHeight: 800, useWebWorker: true };
          fileToUpload = await imageCompression(file, options);

          const fName = `clans/${profile.team_name}-${Date.now()}`;
          const { error: uE } = await supabase.storage.from('proofs').upload(fName, fileToUpload);
          if (uE) throw uE;

          const fUrl = supabase.storage.from('proofs').getPublicUrl(fName).data.publicUrl;
          const { error } = await supabase.from('clans').update({ logo_url: fUrl }).eq('name', profile.team_name);
          if (error) throw error;

          setClan(prev => ({ ...prev, logo_url: fUrl }));
          setSuccessMessage('Clan logo updated!');
          fetchData();
      } catch (e) {
          console.error('Clan logo update failed:', e);
          alert(`Update Failed: ${e.message}`);
      }
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
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

      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)} />}

      <nav className={`bottom-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-logo-section">
          <div className="logo-box">
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
          borderTop: '1px solid rgba(83, 55, 43, 0.08)',
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
          />}
          {page === 'board' && <BoardPage key="board" leaderboard={leaderboard} profile={profile} currentDay={currentDay} />}
          {page === 'team' && <TeamPage key="team" profile={profile} leaderboard={leaderboard} clan={clan} onLogoUpdate={handleUpdateClanLogo} />}
          {page === 'captain-dashboard' && <CaptainDashboard key="captain" profile={profile} leaderboard={leaderboard} />}
          {page === 'profile' && <ProfilePage key="profile" profile={profile} onUpdate={handleUpdateProfile} onLogout={handleLogout} />}
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
        <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdfbf9', borderRadius: '10px' }}>
          <img src={logoImg} style={{ width: '24px' }} />
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
