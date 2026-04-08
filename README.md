# Smart Attendance Management System

A modern, responsive attendance management system for educational institutions built with **React**, **Node.js**, **Express**, and **MongoDB**.

## Features

✅ **Dashboard with Class Selection**
- 4-column layout showing all classes organized by branch and section
- 7 sections per class (A-G) for large batches
- Real-time timetable integration
- Visual indicators for active/inactive classes

✅ **Time-Based Attendance Marking**
- Attendance can only be marked during scheduled class hours
- Automatic window closure after class time
- Real-time status updates showing current time and class timing
- Prevents unauthorized attendance marking

✅ **Student Management**
- 336+ students seeded across all branches/semesters/sections
- Organized by sections within each class
- Quick marking options (Present, Late, Absent)
- Bulk actions for marking entire classes

✅ **Authentication**
- User login/registration with JWT
- Role-based access (Student, Faculty, Admin)
- Secure token-based API

✅ **Professional UI**
- Clean, modern design matching college system standards
- Responsive layout (Desktop, Tablet, Mobile)
- Real-time timetable status indicators
- Intuitive student list with section grouping

## Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- Lucide React (Icons)
- CSS3 with responsive design

**Backend:**
- Node.js
- Express.js
- MongoDB/Mongoose
- JWT Authentication
- Bcrypt (Password hashing)

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- Git

### Frontend Setup

```bash
cd smart-attendance-app-prod/frontend
npm install
npm start
# Opens on http://localhost:3002
```

### Backend Setup

```bash
cd smart-attendance-app-prod/backend
npm install
node seed.js  # Seed database with mock students
npm start
# Server runs on http://localhost:5000
```

## Database Seeding

The system comes with 336 pre-seeded students:
- **6 Branches:** CSE, IT, ECE, EEE, ME, CE
- **2 Semesters:** 3, 4
- **7 Sections:** A, B, C, D, E, F, G
- **4 Students per section**

Run `node seed.js` in backend folder to populate the database.

## Default Timetable

| Subject | Start Time | End Time |
|---------|-----------|----------|
| Mathematics | 09:00 | 10:00 |
| Physics | 10:00 | 11:00 |
| Chemistry | 11:00 | 12:00 |
| Programming | 14:00 | 15:00 |
| Data Structures | 15:00 | 16:00 |
| DBMS | 16:00 | 17:00 |
| Networks | 09:00 | 10:00 |
| General | 09:00 | 17:00 |

## Project Structure

```
smart-attendance-app-prod/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Class selection with timetable
│   │   │   ├── Attendance.js     # Attendance marking interface
│   │   │   ├── Login.js          # Authentication
│   │   │   ├── Navbar.js         # Top navigation
│   │   │   └── ...
│   │   ├── App.js
│   │   ├── config.js             # API configuration
│   │   └── index.css             # Global styles
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── Student.js
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   └── ...
│   ├── routes/
│   │   ├── students.js
│   │   ├── attendance.js
│   │   ├── auth.js
│   │   └── ...
│   ├── controllers/
│   ├── middleware/
│   ├── seed.js
│   ├── server.js
│   └── package.json
└── README.md
```

## How to Use

1. **Register/Login**
   - Create an account or login with existing credentials

2. **Dashboard**
   - Select date and view available classes
   - Only classes within current time are clickable
   - Green "Active Now" badge shows class timing

3. **Mark Attendance**
   - Click on a class to open the attendance page
   - Select or deselect students as Present/Late/Absent
   - All students in your section are visible by default
   - Use "Mark All Present" or "Mark All Absent" buttons for bulk operations

4. **Save**
   - Click "Save Attendance" button to submit
   - System confirms successful submission

## License

MIT License - feel free to use this project for personal and educational purposes.

---

**Built with ❤️ for educational institutions**
