import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE from '../config';
import { Calendar, Clock, Lock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'DBMS', 'Networks'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Timetable: Class timing from 9:00 AM to 4:00 PM (Slots: 9-10, 10-11, 11-12, 12-1, 2-3, 3-4)
const TIMETABLE = {
  'General': { startTime: '09:00', endTime: '17:00' },
  'Mathematics': { startTime: '09:00', endTime: '10:00' },
  'Physics': { startTime: '10:00', endTime: '11:00' },
  'Chemistry': { startTime: '11:00', endTime: '12:00' },
  'Programming': { startTime: '14:00', endTime: '15:00' },
  'Data Structures': { startTime: '15:00', endTime: '16:00' },
  'DBMS': { startTime: '16:00', endTime: '17:00' },
  'Networks': { startTime: '09:00', endTime: '10:00' }
};

export default function Dashboard() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [currentTime, setCurrentTime] = useState(new Date().toTimeString().slice(0, 5));
  const navigate = useNavigate();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isClassActive = (subject, currentT) => {
    if (!TIMETABLE[subject]) return true;
    const { startTime, endTime } = TIMETABLE[subject];
    return currentT >= startTime && currentT <= endTime;
  };

  const handleClassClick = (classInfo) => {
    if (!isClassActive(classInfo.subject, currentTime)) {
      alert(`Class is not active now. ${classInfo.subject} class is from ${TIMETABLE[classInfo.subject].startTime} to ${TIMETABLE[classInfo.subject].endTime}`);
      return;
    }
    localStorage.setItem('selectedClass', JSON.stringify({ ...classInfo, date, time: currentTime }));
    navigate('/attendance');
  };

  return (
    <div className="page-container">
      {/* HERO SECTION */}
      <div className="module-hero">
        <h1>Dashboard</h1>
        <p>Select a class and section to mark attendance</p>
      </div>

      {/* DATE & TIME SELECTOR */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <Calendar size={18} /> Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text)',
              background: '#ffffff'
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <Clock size={18} /> Current Time
          </label>
          <div style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text)',
            background: '#ffffff'
          }}>
            {currentTime}
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
          {date}
        </div>
      </div>

      {/* CLASSES & SECTIONS */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>Classes by Branch & Section</h2>
        {BRANCHES.map(branch => (
          <div key={branch} style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {branch} Branch
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[3, 4].map(sem =>
                SECTIONS.map(section => {
                  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
                  const classInfo = { branch, semester: sem, section, subject, date };
                  const isActive = isClassActive(subject, currentTime);
                  const timing = TIMETABLE[subject];

                  return (
                    <div
                      key={`${branch}-${sem}-${section}`}
                      onClick={() => handleClassClick(classInfo)}
                      className="card"
                      style={{
                        cursor: isActive ? 'pointer' : 'not-allowed',
                        padding: '1.2rem',
                        border: isActive ? '2px solid var(--border)' : '2px solid #cbd5e1',
                        transition: 'all 0.3s',
                        background: isActive ? '#ffffff' : '#f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '160px',
                        opacity: isActive ? 1 : 0.6
                      }}
                      onMouseEnter={(e) => {
                        if (isActive) {
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isActive) {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.boxShadow = 'var(--shadow)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div>
                        <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {branch} • Sem {sem} • Sec {section}
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: 0, marginBottom: '0.5rem' }}>
                          {subject}
                        </h3>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          {timing.startTime} - {timing.endTime}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: isActive ? 'var(--success)' : 'var(--danger)',
                        fontWeight: 600,
                        marginTop: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {isActive ? (
                          <>
                            <Check size={14} /> Active Now
                          </>
                        ) : (
                          <>
                            <Lock size={14} /> Not Active
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
