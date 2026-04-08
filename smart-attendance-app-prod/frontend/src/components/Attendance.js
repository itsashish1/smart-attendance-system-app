import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE from '../config';
import { CheckCircle2, Circle, ArrowLeft, AlertCircle, Lock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'DBMS', 'Networks'];

// Timetable: Class timing
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

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('General');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toTimeString().slice(0, 5));

  // Get selected class from localStorage
  useEffect(() => {
    const classData = localStorage.getItem('selectedClass');
    if (classData) {
      const parsed = JSON.parse(classData);
      setSelectedClass(parsed);
      setDate(parsed.date || new Date().toISOString().split('T')[0]);
      setSubject(parsed.subject || 'General');
    }
  }, []);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchStudents(); }, [selectedClass]);
  useEffect(() => { fetchExisting(); }, [date, subject]);

  const fetchStudents = async () => {
    setFetching(true);
    try {
      const params = {};
      // If a class is selected, filter by that branch and semester
      if (selectedClass) {
        params.branch = selectedClass.branch;
        params.semester = selectedClass.semester;
      }
      const res = await axios.get(`${BASE}/students`, { params });
      setStudents(res.data);
      // Default everyone absent
      const defaults = {};
      res.data.forEach(s => { defaults[s._id] = 'absent'; });
      setAttendance(prev => ({ ...defaults, ...prev }));
    } catch (err) { console.error(err); }
    finally { setFetching(false); }
  };

  const fetchExisting = async () => {
    if (!date) return;
    try {
      const res = await axios.get(`${BASE}/attendance`, { params: { date, subject } });
      const map = {};
      res.data.forEach(r => { if (r.student) map[r.student._id] = r.status; });
      setAttendance(prev => ({ ...prev, ...map }));
    } catch (err) {}
  };

  const setStatus = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id] = status; });
    setAttendance(updated);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const submitAttendance = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const records = students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'absent' }));
      await axios.post(`${BASE}/attendance/bulk`, { records, date, subject });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert('Error saving attendance'); }
    finally { setLoading(false); }
  };

  const statusColor = { present: '#10b981', absent: '#ef4444', late: '#f59e0b' };

  // Check if class is currently active
  const isClassActive = () => {
    if (!TIMETABLE[subject]) return true;
    const { startTime, endTime } = TIMETABLE[subject];
    return currentTime >= startTime && currentTime <= endTime;
  };

  const classStatus = TIMETABLE[subject];
  const activeNow = isClassActive();

  const filteredStudents = students;

  const groupedBySection = {};
  filteredStudents.forEach(s => {
    const section = s.section || 'Unknown';
    if (!groupedBySection[section]) groupedBySection[section] = [];
    groupedBySection[section].push(s);
  });

  const sortedSections = Object.keys(groupedBySection).sort();

  // Auto-expand all sections
  useEffect(() => {
    const expanded = {};
    sortedSections.forEach(section => { expanded[section] = true; });
    setExpandedSections(expanded);
  }, [sortedSections.length > 0]);

  const present = filteredStudents.filter(s => attendance[s._id] === 'present').length;
  const absent = filteredStudents.filter(s => attendance[s._id] === 'absent').length;
  const late = filteredStudents.filter(s => attendance[s._id] === 'late').length;

  return (
    <div className="page-container">
      {/* HERO SECTION */}
      <div className="module-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          {selectedClass && (
            <Link to="/dashboard" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
              <ArrowLeft size={20} /> Back to Dashboard
            </Link>
          )}
        </div>
        <h1>Mark Attendance</h1>
        {selectedClass ? (
          <p style={{ color: 'var(--success)', fontWeight: 600 }}>
            {selectedClass.subject} • {selectedClass.branch} • Semester {selectedClass.semester} • Section {selectedClass.section}
          </p>
        ) : (
          <p>Mark student attendance for today's session. Click checkboxes to mark present, absent, or late.</p>
        )}
      </div>

      {/* TIMETABLE STATUS */}
      {selectedClass && classStatus && (
        <div style={{
          background: activeNow ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `2px solid ${activeNow ? 'var(--success)' : 'var(--danger)'}`,
          borderRadius: 'var(--radius)',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {activeNow ? (
            <>
              <Check size={24} color="var(--success)" strokeWidth={3} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>Attendance Window Open</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Class is active from {classStatus.startTime} to {classStatus.endTime} • Current time: {currentTime}
                </div>
              </div>
            </>
          ) : (
            <>
              <AlertCircle size={24} color="var(--danger)" strokeWidth={2.5} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: '0.25rem' }}>Attendance Window Closed</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {selectedClass.subject} class is from {classStatus.startTime} to {classStatus.endTime} • Current time: {currentTime}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* RESTRICTED ACCESS */}
      {selectedClass && classStatus && !activeNow && (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: '#f1f5f9',
          borderRadius: 'var(--radius)',
          marginBottom: '2rem'
        }}>
          <Lock size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text)', marginTop: 0, marginBottom: '0.5rem' }}>Attendance Not Available</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Attendance can only be marked during class hours
          </p>
          <p style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Class timing: {classStatus.startTime} - {classStatus.endTime}
          </p>
          <Link to="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, marginTop: '1rem', display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
        </div>
      )}

      {/* DATE & SUBJECT SELECTORS */}
      {activeNow && (
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <input 
            type="date" 
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} 
            value={date} 
            onChange={e => setDate(e.target.value)} 
          />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <select style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} value={subject} onChange={e => setSubject(e.target.value)}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      )}

      {/* ACTION BUTTONS */}
      {activeNow && (
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary" style={{ background: 'var(--success)' }} onClick={() => markAll('present')} disabled={!activeNow}>✓ Mark All Present</button>
        <button className="btn-primary" style={{ background: 'var(--danger)' }} onClick={() => markAll('absent')} disabled={!activeNow}>✗ Mark All Absent</button>
        {saved && <div style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Saved successfully!</div>}
      </div>
      )}

      {/* MAIN CONTENT */}
      {activeNow && (
        fetching ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <h2>No students found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          sortedSections.map(section => (
            <div key={section} className="card" style={{ marginBottom: '1.5rem', padding: 0, overflow: 'hidden' }}>
              <div 
                className="section-header" 
                onClick={() => toggleSection(section)}
                style={{ background: 'var(--primary)', color: 'white', padding: '1rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Section {section}</h3>
                </div>
                <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>({groupedBySection[section].length} students) {expandedSections[section] ? '▼' : '▶'}</span>
              </div>
              {expandedSections[section] && (
                <div>
                  {groupedBySection[section].map((s, idx) => {
                    const status = attendance[s._id] || 'absent';
                    return (
                      <div 
                        key={s._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.5rem',
                          borderTop: '1px solid var(--border)',
                          background: idx % 2 === 0 ? 'white' : '#f9fafb',
                          transition: 'all 0.2s',
                          hover: { background: '#f0f4f8' }
                        }}
                        className="student-row"
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>{s.rollNumber}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{s.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.branch} · Sem {s.semester}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: status === 'present' ? 'var(--success)' : 'var(--text-muted)' }}>
                            {status === 'present' ? <CheckCircle2 size={22} color="var(--success)" strokeWidth={2.5} /> : <Circle size={22} color="#d1d5db" />}
                            <span>Present</span>
                            <input
                              type="checkbox"
                              checked={status === 'present'}
                              onChange={() => setStatus(s._id, status === 'present' ? 'absent' : 'present')}
                              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            />
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: status === 'late' ? 'var(--warning)' : 'var(--text-muted)' }}>
                            {status === 'late' ? <CheckCircle2 size={22} color="var(--warning)" strokeWidth={2.5} /> : <Circle size={22} color="#d1d5db" />}
                            <span>Late</span>
                            <input
                              type="checkbox"
                              checked={status === 'late'}
                              onChange={() => setStatus(s._id, status === 'late' ? 'absent' : 'late')}
                              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )
      )}

      {activeNow && filteredStudents.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
          <button 
            className="btn-primary"
            onClick={submitAttendance} 
            disabled={loading || !activeNow}
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            {loading ? 'Saving...' : `Save Attendance for ${filteredStudents.length} Students`}
          </button>
        </div>
      )}
    </div>
  );
}


const styles = {
  // All styles moved to index.css
};
