import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE from '../config';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];

const emptyForm = { name: '', rollNumber: '', email: '', branch: 'CSE', semester: 1, section: 'A', phone: '' };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ branch: '', semester: '' });

  useEffect(() => { fetchStudents(); }, [filter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.branch) params.branch = filter.branch;
      if (filter.semester) params.semester = filter.semester;
      const res = await axios.get(`${BASE}/students`, { params });
      setStudents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(emptyForm); setEditing(null); setError(''); setShowModal(true); };
  const openEdit = (s) => { setForm({ name: s.name, rollNumber: s.rollNumber, email: s.email, branch: s.branch, semester: s.semester, section: s.section || 'A', phone: s.phone || '' }); setEditing(s._id); setError(''); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editing) {
        await axios.put(`${BASE}/students/${editing}`, form);
      } else {
        await axios.post(`${BASE}/students`, form);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving student');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this student?')) return;
    try {
      await axios.delete(`${BASE}/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Students</h1>
          <p style={styles.sub}>{students.length} students enrolled</p>
        </div>
        <button style={styles.addBtn} onClick={openAdd}>Add Student</button>
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        <input style={{ ...styles.input, flex: 1, minWidth: 200 }} placeholder="Search by name, roll no, email..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={styles.input} value={filter.branch} onChange={e => setFilter({ ...filter, branch: e.target.value })}>
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b}>{b}</option>)}
        </select>
        <select style={styles.input} value={filter.semester} onChange={e => setFilter({ ...filter, semester: e.target.value })}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={styles.center}><div style={styles.spinner} /></div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          {students.length === 0 ? 'No students yet. Click "+ Add Student" to get started.' : 'No students match your search.'}
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Roll No', 'Name', 'Email', 'Branch', 'Semester', 'Section', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s._id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}><span style={styles.rollBadge}>{s.rollNumber}</span></td>
                  <td style={styles.td}><div style={styles.nameCell}><div style={styles.avatar}>{s.name[0]}</div>{s.name}</div></td>
                  <td style={styles.td}><span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{s.email}</span></td>
                  <td style={styles.td}><span style={styles.branchBadge}>{s.branch}</span></td>
                  <td style={styles.td}><span style={{ color: '#fff' }}>Sem {s.semester}</span></td>
                  <td style={styles.td}><span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.section}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={styles.editBtn} onClick={() => openEdit(s)}>Edit</button>
                      <button style={styles.delBtn} onClick={() => handleDelete(s._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editing ? 'Edit Student' : 'Add New Student'}</h2>
            {error && <div style={styles.errorBox}>{error}</div>}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={styles.grid2}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name *</label>
                  <input style={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ashish Yadav" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Roll Number *</label>
                  <input style={styles.input} value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} required placeholder="CS2021001" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email *</label>
                  <input style={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="ashish@college.edu" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Phone</label>
                  <input style={styles.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Branch *</label>
                  <select style={styles.input} value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Semester *</label>
                  <select style={styles.input} value={form.semester} onChange={e => setForm({ ...form, semester: parseInt(e.target.value) })}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Section</label>
                  <select style={styles.input} value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
                    {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={styles.saveBtn} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Student' : 'Add Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '32px', maxWidth: 1200, fontFamily: 'Inter, -apple-system, sans-serif', background: '#f8f9fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  h1: { margin: 0, fontSize: 32, fontWeight: 800, color: '#1f2937' },
  sub: { margin: '6px 0 0', color: '#6b7280', fontSize: 15 },
  addBtn: { background: 'linear-gradient(135deg,#3b82f6,#2563eb)', border: 'none', borderRadius: 10, padding: '11px 22px', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  input: { background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', color: '#1f2937', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' },
  tableWrap: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#6b7280', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '12px 16px', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' },
  trEven: { background: '#f9fafb' },
  trOdd: { background: '#ffffff' },
  rollBadge: { background: '#dbeafe', color: '#1e40af', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600 },
  branchBadge: { background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600 },
  nameCell: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  editBtn: { background: '#dbeafe', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: 7, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  delBtn: { background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 7, padding: '5px 10px', fontSize: 13, cursor: 'pointer' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 },
  spinner: { width: 36, height: 36, border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: '60px 0', fontSize: 15 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalTitle: { margin: '0 0 20px', color: '#1f2937', fontSize: 20, fontWeight: 700 },
  errorBox: { background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#374151', fontSize: 12, fontWeight: 600 },
  cancelBtn: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 20px', color: '#1f2937', fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  saveBtn: { background: 'linear-gradient(135deg,#3b82f6,#2563eb)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
};
