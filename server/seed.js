import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Club from './models/Club.model.js';
import Faculty from './models/Faculty.model.js';
import Announcement from './models/Announcement.model.js';
import Event from './models/Event.model.js';
import Post from './models/Post.model.js';
import SupportTicket from './models/SupportTicket.model.js';
import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Clearing old data...');

    // Clear existing data
    await User.deleteMany();
    await Club.deleteMany();
    await Faculty.deleteMany();
    await Announcement.deleteMany();
    await Event.deleteMany();
    await Post.deleteMany();
    await SupportTicket.deleteMany();

    console.log('Creating Users...');
    const adminUser = await User.create({
      name: 'System Admin', email: 'admin@college.edu', password: 'password123', role: 'admin', department: 'IT',
    });

    const student1 = await User.create({
      name: 'Harshit Jaiswal', email: 'harshit@college.edu', password: 'password123', role: 'club_admin', department: 'CSE', year: '3rd Year',
    });
    
    const student2 = await User.create({
      name: 'Aisha Sharma', email: 'aisha@college.edu', password: 'password123', role: 'student', department: 'ECE', year: '2nd Year',
    });

    const student3 = await User.create({
      name: 'Rohan Gupta', email: 'rohan@college.edu', password: 'password123', role: 'student', department: 'MECH', year: '4th Year',
    });

    const teacher1 = await User.create({
      name: 'Dr. Anita Desai', email: 'anita@college.edu', password: 'password123', role: 'faculty', department: 'CSE',
    });

    console.log('Creating Faculty Directory...');
    await Faculty.insertMany([
      { name: 'Dr. Varuna Tyagi', email: 'varuna.tyagi@college.edu', department: 'Journalism & Mass Comm', designation: 'Professor', subjects: ['Media Ethics', 'Reporting'], cabin: 'Block C - 101', officeHours: 'Mon-Wed 10AM - 1PM', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Dr. Neeraj Sharma', email: 'neeraj.sharma@college.edu', department: 'Journalism & Mass Comm', designation: 'Associate Professor', subjects: ['Digital Media', 'Ad & PR'], cabin: 'Block C - 105', officeHours: 'Tue-Thu 2PM - 4PM', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop' },
      
      { name: 'Dr. Meena Bhandari', email: 'meena.bhandari@college.edu', department: 'Basic & Applied Sciences', designation: 'Professor', subjects: ['Applied Physics', 'Quantum Mechanics'], cabin: 'Block B - 201', officeHours: 'Mon-Fri 9AM - 11AM', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' },
      { name: 'Dr. Pawan Kumar', email: 'pawan.kumar@college.edu', department: 'Basic & Applied Sciences', designation: 'Professor', subjects: ['Organic Chemistry', 'Nanotechnology'], cabin: 'Block B - 202', officeHours: 'Wed-Fri 1PM - 3PM', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Dr. Diwakar Padalia', email: 'diwakar.padalia@college.edu', department: 'Basic & Applied Sciences', designation: 'Associate Professor', subjects: ['Applied Mathematics'], cabin: 'Block B - 205', officeHours: 'Mon-Thu 3PM - 5PM', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      
      { name: 'Dr. Sandeep Kumar', email: 'sandeep.kumar@college.edu', department: 'Engineering & Technology', designation: 'Professor', subjects: ['Software Engineering', 'System Design'], cabin: 'Block A - 301', officeHours: 'Tue & Thu 10AM - 12PM', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop' },
      { name: 'Dr. Ankur Gupta', email: 'ankur.gupta@college.edu', department: 'Engineering & Technology', designation: 'Associate Professor', subjects: ['Data Structures', 'Database Systems'], cabin: 'Block A - 305', officeHours: 'Mon & Wed 2PM - 4PM', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
      { name: 'Dr. Vicky Kapoor', email: 'vicky.kapoor@college.edu', department: 'Engineering & Technology', designation: 'Assistant Professor', subjects: ['Operating Systems', 'Computer Networks'], cabin: 'Block A - 310', officeHours: 'Fri 10AM - 1PM', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
      
      { name: 'Dr. Sangeeta Sharma', email: 'sangeeta.sharma@college.edu', department: 'Management & Commerce', designation: 'Professor', subjects: ['Corporate Finance', 'Business Law'], cabin: 'Block D - 401', officeHours: 'Mon-Wed 11AM - 1PM', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&auto=format&fit=crop' },
      { name: 'Dr. Sunil Kumar', email: 'sunil.kumar@college.edu', department: 'Management & Commerce', designation: 'Associate Professor', subjects: ['Marketing Management'], cabin: 'Block D - 407', officeHours: 'Thu-Fri 2PM - 4PM', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
    ]);

    console.log('Creating Clubs...');
    const munClub = await Club.create({ name: 'MUN Club', description: 'Model United Nations Club.', category: 'social', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1541872511475-4ceb02f8dcab?q=80&w=800&auto=format&fit=crop' });
    const chetnaSociety = await Club.create({ name: 'Chetna Society', description: 'Art, Film & Literature Society.', category: 'cultural', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800&auto=format&fit=crop' });
    const economicSociety = await Club.create({ name: 'Economic Society', description: 'Economics and thought discussions.', category: 'social', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop' });
    const scienceClub = await Club.create({ name: 'Dr. APJ Abdul Kalam Science Club', description: 'Explore, Experiment, Express.', category: 'technical', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop' });
    const sportsClub = await Club.create({ name: 'Sports Club', description: 'Organizes inter-college sports tournaments.', category: 'sports', coordinator: student2._id, createdBy: adminUser._id, members: [student1._id, student2._id], coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop' });
    const techNexusClub = await Club.create({ name: 'Tech Nexus Club', description: 'Coding and technology club.', category: 'technical', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop' });
    const managementSociety = await Club.create({ name: 'Management Society', description: 'Management and business activities.', category: 'social', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop' });
    const mediaverseClub = await Club.create({ name: 'Mediaverse Club', description: 'Voices of our campus.', category: 'social', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop' });
    const environmentClub = await Club.create({ name: 'Environment Club', description: 'Eco-sustainable future initiatives.', category: 'social', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop' });
    const diaClub = await Club.create({ name: 'DIA Club', description: 'Art and craft activities.', category: 'cultural', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a47?q=80&w=800&auto=format&fit=crop' });
    const culturalClub = await Club.create({ name: 'Cultural Club', description: 'Theatre, dance, and music showcasing.', category: 'cultural', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1507676184212-d0330a156f95?q=80&w=800&auto=format&fit=crop' });
    const roopantrClub = await Club.create({ name: 'Roopantr Club', description: 'Fashion and arts society.', category: 'cultural', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop' });
    const rhetoricClub = await Club.create({ name: 'Rhetoric Club', description: 'Language and speaking club.', category: 'social', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1543326727-cf68a5482acc?q=80&w=800&auto=format&fit=crop' });
    const healthSociety = await Club.create({ name: 'Health Society', description: 'Health and wellness awareness.', category: 'social', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop' });

    console.log('Creating Events...');
    
    // Setting event date to 17th February, 2026, 1:30 PM
    const eventDate = new Date('2026-02-17T08:00:00Z'); // 1:30 PM IST is 8:00 AM UTC
    const endDate = new Date('2026-02-17T11:00:00Z');   // Assuming 3 hours
    
    await Event.insertMany([
      { title: 'National Museum Visit', description: 'A visit to the National Museum, New Delhi.', category: 'workshop', club: munClub._id, organizer: adminUser._id, venue: 'National Museum, New Delhi', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=800&auto=format&fit=crop' },
      { title: 'Chetna Art, Film & Literature Festival', description: 'Festival showcasing arts, films and literature.', category: 'workshop', club: chetnaSociety._id, organizer: adminUser._id, venue: 'Multipurpose Hall', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1474932430478-367d16b99031?q=80&w=800&auto=format&fit=crop' },
      { title: 'ThinkTalk Series: Dialogues@Campus', description: 'Interactive dialogues and discussions.', category: 'seminar', club: economicSociety._id, organizer: adminUser._id, venue: 'A-208, A-Block, 2nd Floor', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop' },
      { title: 'Explore, Experiment, Express', description: 'Science experiments and project showcases.', category: 'competition', club: scienceClub._id, organizer: adminUser._id, venue: 'B003', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=800&auto=format&fit=crop' },
      { title: 'Kabaddi', description: 'Inter-club Kabaddi matches.', category: 'competition', club: sportsClub._id, organizer: adminUser._id, venue: 'Basketball court', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1518605368461-1ee067cd1fd2?q=80&w=800&auto=format&fit=crop' },
      { title: 'Rapid Code Camp', description: 'Coding marathon and code building camp.', category: 'workshop', club: techNexusClub._id, organizer: adminUser._id, venue: 'B-504, B- Block, Basement', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop' },
      { title: 'Guess the Brand – Blindfold Edition “Brand Masters”', description: 'Fun brand guessing game.', category: 'competition', club: managementSociety._id, organizer: adminUser._id, venue: 'C 414', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop' },
      { title: 'Voices of our campus', description: 'Campus journalism and media speaking.', category: 'seminar', club: mediaverseClub._id, organizer: adminUser._id, venue: 'Sunken Garden', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop' },
      { title: 'Workshop on Battling With Plastic for Eco-sustainable Future', description: 'Awareness on plastic use and sustainable alternatives.', category: 'workshop', club: environmentClub._id, organizer: adminUser._id, venue: 'C 301', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop' },
      { title: 'Rang Chhap: A Block Printing Activity', description: 'Learn traditional block printing.', category: 'workshop', club: diaClub._id, organizer: adminUser._id, venue: 'C101', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a47?q=80&w=800&auto=format&fit=crop' },
      { title: 'RangManch: The Theatre Showcase', description: 'Theatrical performances and plays.', category: 'competition', club: culturalClub._id, organizer: adminUser._id, venue: 'Music Room, C Block, Basement', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1507676184212-d0330a156f95?q=80&w=800&auto=format&fit=crop' },
      { title: 'Denim themed fashion show', description: 'Fashion show showcasing denim trends.', category: 'competition', club: roopantrClub._id, organizer: adminUser._id, venue: 'C115', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop' },
      { title: 'Multilingual Workshop - Chinese', description: 'Introduction to Chinese language and culture.', category: 'workshop', club: rhetoricClub._id, organizer: adminUser._id, venue: 'A-215, 2nd Floor, A-Block', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1543326727-cf68a5482acc?q=80&w=800&auto=format&fit=crop' },
      { title: 'Obesity: A Growing Health Challenge', description: 'Health awareness seminar and discussion.', category: 'seminar', club: healthSociety._id, organizer: adminUser._id, venue: 'B 301, 3rd Floor, B- Block', startDate: eventDate, endDate: endDate, status: 'upcoming', isPublished: true, registeredParticipants: [], image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop' }
    ]);

    console.log('Creating Announcements...');
    await Announcement.insertMany([
      { title: 'Mid-Term Examination Schedule', content: 'The date sheet for mid-term exams has been published on the portal. Exams start from the 15th of next month.', category: 'exam', priority: 'high', author: adminUser._id, isPinned: true },
      { title: 'Campus Wi-Fi Maintenance', content: 'The campus Wi-Fi network will be down for scheduled maintenance tonight between 2 AM and 4 AM.', category: 'general', priority: 'medium', author: adminUser._id },

      { title: 'Diwali Holidays Announced', content: 'The college will remain closed for Diwali celebrations from October 30 to November 3.', category: 'holiday', priority: 'low', author: adminUser._id },
      { title: 'Library Book Return Notice', content: 'Students are requested to return all overdue library books by the end of this week to avoid late fines.', category: 'academic', priority: 'medium', author: adminUser._id }
    ]);


    console.log('Creating Forum Posts & Replies...');
    const post1 = await Post.create({
      title: 'Looking for a teammate for the Annual Hackathon!',
      content: 'Hey everyone, I am mainly a backend developer (Node.js/Express) looking for someone who is good with React to team up for the upcoming hackathon. Let me know if interested!',
      category: 'general', author: student1._id, views: 45, upvotes: [student2._id, student3._id],
      replies: [
        { content: 'I am interested! I have been working with React and Tailwind for the past year.', author: student2._id },
        { content: 'Check your DM, I sent you my portfolio.', author: student3._id }
      ]
    });
    
    await Post.create({
      title: 'How to prepare for Data Structures exam?',
      content: 'Can seniors please share some tips on how to prepare for Dr. John Doe\'s Data Structures midterm? What topics are usually heavily tested?',
      category: 'academic', author: student2._id, views: 120, upvotes: [student1._id],
      replies: [
        { content: 'Focus heavily on Trees and Graphs. He loves asking dynamic programming questions on trees.', author: student3._id, isAccepted: true },
        { content: 'Make sure to practice previous year question papers. They are available in the library.', author: student1._id }
      ]
    });

    await Post.create({
      title: 'Lost my ID card near the cafeteria',
      content: 'If anyone finds a blue lanyard with an ID card belonging to Aisha Sharma, please let me know or drop it at the security desk.',
      category: 'help', author: student2._id, views: 15, upvotes: []
    });

    console.log('Creating Support Tickets...');
    await SupportTicket.create({
      subject: 'Wi-Fi not connecting in Hostel Room 204',
      description: 'Since yesterday, the campus Wi-Fi is not showing up in my laptop. My phone connects fine but the laptop drops the connection.',
      category: 'technical', priority: 'high', status: 'in_progress', raisedBy: student3._id,
      replies: [
        { message: 'We have registered your complaint. Our IT technician will visit your room today between 4 PM - 6 PM.', repliedBy: adminUser._id, isAdminReply: true },
        { message: 'Thank you, I will be in my room.', repliedBy: student3._id, isAdminReply: false }
      ]
    });

    await SupportTicket.create({
      subject: 'Correction in Marksheet',
      description: 'My name is misspelled on the 2nd-semester marksheet. It says "Harsht" instead of "Harshit". Please advise the process to correct it.',
      category: 'academic', priority: 'medium', status: 'open', raisedBy: student1._id,
      replies: []
    });

    console.log('✅ Entire Demo DB Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    fs.writeFileSync('seed-error.log', err.stack || err.message || JSON.stringify(err));
    process.exit(1);
  }
};

seedDB();
