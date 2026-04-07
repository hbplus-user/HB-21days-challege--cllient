import React, { useState, useEffect, useRef } from 'react';
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
  Bell
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

// --- Components ---

const TaskCard = ({ task, onAction, isLocked, isHistory }) => {
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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
    setIsUploading(true);
    try {
        await onAction(task, localFile);
    } catch(err) {
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
    if (isHistory && !task.status) return <div style={{ color: '#d27440', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', width: '100%' }}>Protocol Expired</div>;
    
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
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
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
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>Personal Broadcasts</p>            {flashCards.map(card => {
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
                                                <p style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>Signal Syncing</p>
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
                                            +{card.points || 50} Points Challenge
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button 
                                  onClick={() => onFlashcardAction(card.id, 'reject')} 
                                  style={{ background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', padding: '8px' }}
                                >
                                  Dismiss
                                </button>
                                <button 
                                  onClick={() => onFlashcardAction(card.id, 'interested')} 
                                  style={{ background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '12px', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(159, 64, 34, 0.2)' }}
                                >
                                  Take Challenge
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}

         </div>
      )}
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
         <h2 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)', fontWeight: '800', marginBottom: '8px' }}>Week {weekNum} — {weekTitles[weekNum-1]}</h2>
         <h1 style={{ fontSize: '32px', fontFamily: 'serif', fontStyle: 'italic', color: 'var(--text-primary)' }}>Day {selectedDay} of 21</h1>
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

const BoardPage = ({ leaderboard = [], profile }) => {
  const [activeTab, setActiveTab] = useState('Overall');
  
  const getAvatarInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Climb the board. They showed up — did you?</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
         <div style={{ background: 'var(--hb-beige)', padding: '6px', borderRadius: '16px', display: 'flex', gap: '4px' }}>
            <button 
                onClick={() => setActiveTab('Overall')}
                style={{ 
                    padding: '12px 32px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    background: activeTab === 'Overall' ? '#53372b' : 'transparent', 
                    color: activeTab === 'Overall' ? 'white' : 'rgba(83, 55, 43, 0.6)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
            >
                Individual
            </button>
            <button 
                onClick={() => setActiveTab('Teams')}
                style={{ 
                    padding: '12px 32px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    background: activeTab === 'Teams' ? '#53372b' : 'transparent', 
                    color: activeTab === 'Teams' ? 'white' : 'rgba(83, 55, 43, 0.6)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
            >
                Teams
            </button>
         </div>
      </div>

      <div className="leaderboard-list">
        {activeTab === 'Teams' ? (() => {
            const teamPoints = {};
            leaderboard.forEach(u => {
                const team = u.team_name || 'Independent';
                if (team === 'Independent') return;
                teamPoints[team] = (teamPoints[team] || 0) + (u.points || 0);
            });
            const teamRanking = Object.entries(teamPoints)
                .map(([name, points]) => ({ name, points }))
                .sort((a,b) => b.points - a.points);

            return teamRanking.map((team, idx) => (
                <div key={team.name} className="ranking-card" style={{ borderLeft: '4px solid var(--accent)' }}>
                    <div className="rank-badge">#{idx + 1}</div>
                    <div className="avatar-circle" style={{ borderRadius: '12px', background: 'var(--hb-beige)' }}>
                        <Users size={18} color="var(--accent)" />
                    </div>
                    <div className="name-stack">
                        <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{team.name}</h4>
                        <p style={{ fontSize: '10px', opacity: 0.5 }}>Squad Ranking</p>
                    </div>
                    <div className="points-display" style={{ color: 'var(--accent)' }}>
                        {team.points} pts
                    </div>
                </div>
            ));
        })() : leaderboard.map((item, idx) => {
          const rank = idx + 1;
          const isMe = item.id === profile?.id;
          
          return (
            <div key={item.id} className={`ranking-card ${isMe ? 'me' : ''}`}>
              <div className="rank-badge">
                {rank === 1 && <Trophy size={20} color="#FFD700" />}
                {rank === 2 && <Trophy size={20} color="#C0C0C0" />}
                {rank === 3 && <Trophy size={20} color="#CD7F32" />}
                {rank > 3 && `#${rank}`}
              </div>
              
              <div className="avatar-circle">
                {getAvatarInitials(item.name)}
              </div>

              <div className="name-stack">
                <h4>{item.name} {isMe && <span style={{ color: 'var(--accent)', fontSize: '13px' }}>(You)</span>}</h4>
                <p style={{ fontSize: '10px', opacity: 0.5 }}>{item.email}</p>
                <p>{item.team_name || 'Independent'}</p>
              </div>

              <div className="points-display">
                {item.points || 0}
              </div>
            </div>
          );
        })}
      </div>

    </motion.div>
  );
};

const TeamPage = ({ profile, leaderboard = [] }) => {
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
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>{myTeamName}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Your team needs you. No weak links.</p>
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
        {teamMembers.sort((a,b) => (b.points||0) - (a.points||0)).map(member => {
            const contributionPercent = totalTeamPoints > 0 ? Math.round(((member.points || 0) / totalTeamPoints) * 100) : 0;
            return (
                <div key={member.id} className="ranking-card" style={{ padding: '16px 24px' }}>
                    <div className="avatar-circle" style={{ width: '44px', height: '44px', backgroundColor: member.role === 'leader' ? 'var(--accent)' : 'var(--card-bg)' }}>
                        {member.role === 'leader' ? <Award size={20} color="white" /> : member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="name-stack">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {member.name}
                            {member.role === 'leader' && <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 'bold' }}>CAPTAIN</span>}
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

const LeaderDashboard = ({ profile, leaderboard = [] }) => {
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
                <ShieldCheck size={16} />
                <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Captain's Console</span>
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
                <div className="avatar-circle" style={{ width: '44px', height: '44px', backgroundColor: member.role === 'leader' ? 'var(--accent)' : 'var(--card-bg)' }}>
                    {member.name?.[0].toUpperCase()}
                </div>
                <div className="name-stack">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {member.name} 
                        {member.id === profile.id && <span style={{ fontSize: '10px', color: 'var(--accent)' }}>(You)</span>}
                        {member.role === 'leader' && <Award size={12} color="var(--accent)" />}
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

const ProfilePage = ({ profile }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
        <div style={{ width: '100px', height: '100px', background: 'var(--card-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', border: '1px solid var(--border-color)', boxShadow: '0 10px 20px rgba(83, 55, 43, 0.05)', marginBottom: '16px', color: 'var(--text-primary)' }}>{profile?.name?.[0] || 'A'}</div>
        <h1 style={{ fontSize: '32px', marginBottom: '4px', color: 'var(--text-primary)' }}>{profile?.name || 'Client'}</h1>
        <p style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em' }}>Member Since March 2024</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div className="card" style={{ textAlign: 'center', background: 'var(--card-bg)' }}>
            <Target size={24} color="var(--accent)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{profile?.points || 0}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Career Points</div>
        </div>
        <div className="card" style={{ textAlign: 'center', background: 'var(--card-bg)' }}>
            <Flame size={24} color="#FF6B6B" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{profile?.streak || 12}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Day Streak</div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
         <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-primary)' }}>Performance Baseline</h3>
         <div className="card" style={{ background: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Protocol Completion</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent)' }}>82%</span>
            </div>
            <div className="progress-container" style={{ width: '100%', height: '8px', background: 'var(--bg-primary)' }}>
              <div className="progress-bar" style={{ width: '82%', background: 'var(--accent)' }}></div>
            </div>
         </div>
      </div>
    </motion.div>
);

// --- Main App ---

export default function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [flashCards, setFlashCards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [profile, setProfile] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) initUser(session.user);
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
    
    fetchChallengeSettings();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(flashChannel);
      supabase.removeChannel(taskChannel);
      supabase.removeChannel(subChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

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
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    if (data) {
      if (data.is_allowed === false) {
          handleLogout();
          alert('ACCESS REVOKED: You no longer have permission.');
          return;
      }
      if (!data.email) await supabase.from('profiles').update({ email: user.email }).eq('id', user.id);
      setProfile({ ...data, email: user.email });
    } else {
      const { data: nP } = await supabase.from('profiles').insert([{ 
        id: user.id, 
        email: user.email,
        name: user.user_metadata.full_name || user.email.split('@')[0], 
        team_name: 'Independent', 
        points: 0,
        streak: 1,
        is_allowed: true
      }]).select().single();
      if (nP) setProfile(nP);
    }
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
    } catch(e) { 
        console.error('Fatal interaction error:', e);
        alert(`System Error: ${e.message}`);
    }
  };

  const fetchData = async () => {
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

        // 2. Fetch Flashcards (24 HOUR VALIDITY)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: fD } = await supabase
            .from('flashcards')
            .select('*')
            .gte('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false });
        
        const safeFlashcards = fD || [];
        const interestedFlashcardIds = safeSubs.filter(s => s.flashcard_id).map(s => s.flashcard_id);
        
        const flashcardTasks = safeFlashcards
            .filter(f => interestedFlashcardIds.includes(f.id))
            .map(f => ({
                id: `fc-${f.id}`,
                flashcard_id: f.id,
                title: `CHALLENGE: ${f.text}`,
                points: f.points || 50,
                status: safeSubs.find(s => s.flashcard_id === f.id)?.status || 'pending'
            }));

        setTasks([...mergedTasks, ...flashcardTasks]);
        setFlashCards(safeFlashcards.filter(f => !interestedFlashcardIds.includes(f.id)));

        const { data: bD } = await supabase.from('profiles').select('*').order('points', { ascending: false });
        setLeaderboard(bD || []);
    } catch(e) {
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
            const fName = `${session.user.id}/${taskKey}-${Date.now()}`;
            const { error: uE } = await supabase.storage.from('proofs').upload(fName, file);
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
    } catch(e) { 
        console.error('Upload system fatal error:', e); 
        alert(`System Error: ${e.message}`);
    }
  };

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
                    <h2>Elevate Your <br/>Performance.</h2>
                    <p style={{ opacity: 0.8, fontSize: '18px', fontWeight: '300' }}>The science of wellness, <br/>refined for the modern achiever.</p>
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

               <button 
                  onClick={handleGoogleLogin}
                  className="google-login-btn"
               >
                  <svg className="google-icon" viewBox="0 0 24 24">
                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                     <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
            {profile?.role === 'leader' && (
                <button className={`nav-item ${page === 'leader-dashboard' ? 'active' : ''}`} onClick={() => { setPage('leader-dashboard'); setIsMenuOpen(false); }}>
                    <ShieldCheck size={20} /> <span>Leader Hub</span>
                </button>
            )}
            <button className={`nav-item ${page === 'profile' ? 'active' : ''}`} onClick={() => { setPage('profile'); setIsMenuOpen(false); }}>
                <User size={20} /> <span>My Account</span>
            </button>
            
            <div className="logout-container">
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                >
                    <LogOut size={20} /> <span>Sign Out</span>
                </button>
            </div>
        </div>
      </nav>

      <main className="main-content">
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)', background: 'var(--success-bg)', color: 'var(--success-text)', padding: '16px 32px', borderRadius: '16px', zIndex: 3000, fontWeight: '700', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              {successMessage}
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
          {page === 'board' && <BoardPage key="board" leaderboard={leaderboard} />}
          {page === 'team' && <TeamPage key="team" profile={profile} leaderboard={leaderboard} />}
          {page === 'leader-dashboard' && <LeaderDashboard key="leader" profile={profile} leaderboard={leaderboard} />}
          {page === 'profile' && <ProfilePage key="profile" profile={profile} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
