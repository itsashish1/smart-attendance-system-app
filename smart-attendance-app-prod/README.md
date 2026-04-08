# 🎓 Smart Attendance System

> A full-stack college attendance management system with real-time tracking, analytics, role-based access, and CSV export.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey?logo=express)

## ✨ Features

- 🔐 **JWT Auth** — Secure login/register with role-based access (Admin & Student)
- ✅ **Bulk Attendance Marking** — Mark entire class in one click, toggle per student
- 📊 **Dashboard** — Live stats, 30-day trend chart, today's summary
- 👥 **Student Management** — Add, edit, remove students with full CRUD
- 📈 **Reports** — Filter by branch/semester/subject/date, bar chart, danger/warning/safe status
- ⬇️ **CSV Export** — Download filtered attendance report
- 🌙 **Dark UI** — Glassmorphism design with Inter font
- 📱 **Responsive** — Works on mobile and desktop

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Recharts, Axios |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Styling | Vanilla CSS (glassmorphism dark theme) |

## 📁 Project Structure

```
smart-attendance-system-app/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT auth middleware
│   ├── models/
│   │   ├── User.js          # User model (admin/student)
│   │   ├── Student.js       # Student model
│   │   └── Attendance.js    # Attendance model
│   ├── routes/
│   │   ├── auth.js          # /api/auth
│   │   ├── attendance.js    # /api/attendance
│   │   ├── students.js      # /api/students
│   │   └── reports.js       # /api/reports
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Login.js
        │   ├── Dashboard.js
        │   ├── Attendance.js
        │   ├── Students.js
        │   ├── Reports.js
        │   └── Sidebar.js
        ├── context/
        │   └── AuthContext.js
        ├── App.js
        ├── index.js
        ├── index.css
        └── config.js
```

## 🚀 Local Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### 1. Clone & Backend

```bash
git clone https://github.com/itsashish1/smart-attendance-system-app.git
cd smart-attendance-system-app/backend

# Copy env file and fill in your MongoDB URI
cp .env.example .env

npm install
npm run dev   # Starts on port 5000
```

### 2. Frontend

```bash
cd ../frontend
npm install
npm start     # Starts on port 3000
```

Open **http://localhost:3000** — register as Admin to get started.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get current user |
| GET | `/api/students` | List students (filterable) |
| POST | `/api/students` | Add student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Remove student |
| GET | `/api/attendance` | Get attendance records |
| POST | `/api/attendance` | Mark single attendance |
| POST | `/api/attendance/bulk` | Bulk mark attendance |
| GET | `/api/attendance/student/:id` | Student attendance summary |
| GET | `/api/reports/summary` | Full student report |
| GET | `/api/reports/stats` | Dashboard stats |
| GET | `/api/reports/export` | Download CSV |

## 🌐 Deployment

- **Backend**: [Render.com](https://render.com) (free tier, set env vars in dashboard)
- **Frontend**: [Vercel](https://vercel.com) (set `REACT_APP_API_URL` to your Render backend URL)
- **Database**: [MongoDB Atlas](https://cloud.mongodb.com) (free M0 cluster)

## 👤 Author

**Ashish Yadav** — [@itsashish1](https://github.com/itsashish1)

## 📄 License

MIT License
