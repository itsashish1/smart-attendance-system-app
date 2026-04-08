import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE from '../config';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const SUBJECTS = ['', 'General', 'Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'DBMS', 'Networks'];

export default function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ branch: '', semester: '', subject: '', startDate: '', endDate: '' });

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.branch) params.branch = filter.branch;
      if (filter.semester) params.semester = filter.semester;
      if (filter.subject) params.subject = filter.subject;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;
      const res = await axios.get(`${BASE}/reports/summary`, { params });
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const downloadCSV = async () => {
    try {
      const params = { ...filter };
      const res = await axios.get(`${BASE}/reports/export`, { params, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = 'attendance_report.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Export failed'); }
  };

  const safe = data.filter(d => d.status === 'safe').length;
  const warning = data.filter(d => d.status === 'warning').length;
  const danger = data.filter(d => d.status === 'danger').length;

  const statusColor = { safe: '#10b981', warning: '#f59e0b', danger: '#ef4444' };
  const statusBg = { safe: '#dcfce7', warning: '#fef3c7', danger: '#fee2e2' };

  const chartData = data.slice(0, 20).map(d => ({ name: d.student.rollNumber, pct: d.percentage }));

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Attendance Reports</h1>
          <p style={styles.sub}>Analyze and export attendance data</p>
        </div>
        <button style={styles.exportBtn} onClick={downloadCSV}>Export CSV</button>
      </div>

      {/* Filters */}
      <div style={styles.filterCard}>
        <div style={styles.filterRow}>
          <div style={styles.field}>
            <label style={styles.label}>Branch</label>
            <select style={styles.input} value={filter.branch} onChange={e => setFilter({ ...filter, branch: e.target.value })}>
              <option value="">All</option>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Semester</label>
            <select style={styles.input} value={filter.semester} onChange={e => setFilter({ ...filter, semester: e.target.value })}>
              <option value="">All</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Subject</label>
            <select style={styles.input} value={filter.subject} onChange={e => setFilter({ ...filter, subject: e.target.value })}>
              <option value="">All Subjects</option>
              {SUBJECTS.filter(Boolean).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>From Date</label>
            <input type="date" style={styles.input} value={filter.startDate} onChange={e => setFilter({ ...filter, startDate: e.target.value })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>To Date</label>
            <input type="date" style={styles.input} value={filter.endDate} onChange={e => setFilter({ ...filter, endDate: e.target.value })} />
          </div>
          <button style={styles.applyBtn} onClick={fetchReport} disabled={loading}>
            {loading ? 'Loading...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Summary chips */}
      {data.length > 0 && (
        <div style={styles.summaryRow}>
          <div style={styles.chip('#6366f1')}>Total: <strong>{data.length}</strong></div>
          <div style={styles.chip('#10b981')}>Safe (≥75%): <strong>{safe}</strong></div>
          <div style={styles.chip('#f59e0b')}>Warning (60-74%): <strong>{warning}</strong></div>
          <div style={styles.chip('#ef4444')}>Danger (&lt;60%): <strong>{danger}</strong></div>
        </div>
      )}

      {/* Bar chart */}
      {chartData.length > 0 && (
        <div style={styles.chartCard}>
          <h3 style={styles.sectionTitle}>Attendance % by Student (Top 20)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} angle={-40} textAnchor="end" />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Bar dataKey="pct" name="Attendance %" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.pct >= 75 ? '#10b981' : d.pct >= 60 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={styles.center}><div style={styles.spinner} /></div>
      ) : data.length === 0 ? (
        <div style={styles.empty}>No data found. Adjust filters or mark some attendance first.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Roll No', 'Name', 'Branch', 'Sem', 'Total', 'Present', 'Absent', 'Late', 'Percentage', 'Status'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.student.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}><span style={styles.rollBadge}>{d.student.rollNumber}</span></td>
                  <td style={styles.td}><span style={{ color: '#fff', fontWeight: 500 }}>{d.student.name}</span></td>
                  <td style={styles.td}><span style={styles.branchBadge}>{d.student.branch}</span></td>
                  <td style={styles.td}><span style={{ color: 'rgba(255,255,255,0.5)' }}>Sem {d.student.semester}</span></td>
                  <td style={styles.td}><span style={{ color: '#fff' }}>{d.total}</span></td>
                  <td style={styles.td}><span style={{ color: '#10b981', fontWeight: 600 }}>{d.present}</span></td>
                  <td style={styles.td}><span style={{ color: '#ef4444', fontWeight: 600 }}>{d.absent}</span></td>
                  <td style={styles.td}><span style={{ color: '#f59e0b', fontWeight: 600 }}>{d.late}</span></td>
                  <td style={styles.td}>
                    <div style={styles.pctBar}>
                      <div style={{ ...styles.pctFill, width: `${d.percentage}%`, background: statusColor[d.status] }} />
                      <span style={{ color: '#fff', fontSize: 12, marginLeft: 6 }}>{d.percentage}%</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ background: statusBg[d.status], color: statusColor[d.status], borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                      {d.status === 'safe' ? 'Safe' : d.status === 'warning' ? 'Warning' : 'Danger'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '32px', maxWidth: 1300, fontFamily: 'Inter, -apple-system, sans-serif', background: '#f8f9fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  h1: { margin: 0, fontSize: 32, fontWeight: 800, color: '#1f2937' },
  sub: { margin: '6px 0 0', color: '#6b7280', fontSize: 15 },
  exportBtn: { background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 10, padding: '11px 22px', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  filterCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '16px 20px', marginBottom: 20 },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#374151', fontSize: 12, fontWeight: 600 },
  input: { background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', color: '#1f2937', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' },
  applyBtn: { background: 'linear-gradient(135deg,#3b82f6,#2563eb)', border: 'none', borderRadius: 8, padding: '9px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-end', marginBottom: 0 },
  summaryRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  chip: (c) => ({ background: c + '15', border: `1.5px solid ${c}40`, color: c, borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600 }),
  chartCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px', marginBottom: 24 },
  sectionTitle: { margin: '0 0 16px', color: '#1f2937', fontSize: 16, fontWeight: 700 },
  tableWrap: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 14px', textAlign: 'left', color: ' #6b7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '11px 14px', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' },
  trEven: { background: '#f9fafb' },
  trOdd: { background: '#ffffff' },
  rollBadge: { background: '#dbeafe', color: '#1e40af', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 },
  branchBadge: { background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 },
  pctBar: { display: 'flex', alignItems: 'center', gap: 0 },
  pctFill: { height: 6, borderRadius: 3, minWidth: 2, transition: 'width 0.5s' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 },
  spinner: { width: 36, height: 36, border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: '60px 0', fontSize: 15 }
};
