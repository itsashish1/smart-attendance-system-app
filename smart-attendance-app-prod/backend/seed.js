require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];

const fakeNames = [
  'Rajesh Kumar Singh', 'Priya Sharma', 'Arjun Patel', 'Neha Gupta', 'Vikram Reddy',
  'Anjali Verma', 'Rohit Joshi', 'Divya Nair', 'Arun Kumar', 'Sneha Desai',
  'Sameer Khan', 'Ananya Singh', 'Suresh Iyer', 'Manish Yadav', 'Swati Bhat',
  'Harsh Tyagi', 'Pooja Malik', 'Kavya Ramanathan', 'Abhinav Sharma', 'Ritika Bansal',
  'Nikhil Gupta', 'Ishita Pandey', 'Rajeev Singh', 'Shruti Verma', 'Abhishek Rao',
  'Esha Chopra', 'Akshay Kumar', 'Deepika Singh', 'Rohit Singh', 'Samara Khan',
  'Vishal Reddy', 'Megha Sharma', 'Sanjay Patel', 'Rani Verma', 'Adit Yadav',
  'Preeti Joshi', 'Nitin Desai', 'Pooja Singh', 'Varun Kumar', 'Shreya Nair',
  'Siddharth Gupta', 'Riya Sharma', 'Ashok Reddy', 'Priya Verma', 'Ankit Singh'
];

let fakeStudents = [];
let rollCounter = 1;

BRANCHES.forEach(branch => {
  [3, 4].forEach(sem => { // Semester 3 and 4
    SECTIONS.forEach(section => {
      const namesForSection = fakeNames.slice(fakeStudents.length % fakeNames.length, fakeNames.length);
      for (let i = 0; i < 4; i++) { // 4 students per section
        fakeStudents.push({
          name: namesForSection[i] || `Student ${rollCounter}`,
          rollNumber: `${branch}${sem}${section}${String(rollCounter).padStart(3, '0')}`,
          email: `student${rollCounter}@college.edu`,
          branch: branch,
          semester: sem,
          section: section,
          phone: `9876543${String(rollCounter).padStart(3, '0')}`
        });
        rollCounter++;
      }
    });
  });
});

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-attendance');
    console.log('Connected to MongoDB');
    
    // Clear existing students
    await Student.deleteMany({});
    console.log('Cleared existing students');
    
    // Insert new students
    await Student.insertMany(fakeStudents);
    console.log(`✓ Added ${fakeStudents.length} students across all branches, semesters, and sections (A-G)`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();
