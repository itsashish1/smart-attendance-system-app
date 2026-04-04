import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Users, CalendarDays, MessageSquare, BookOpen, 
  BellRing, HelpCircle, Briefcase, ArrowRight
} from 'lucide-react';
import UpcomingEventsReminder from '../components/UpcomingEventsReminder';

const Home = () => {
  const [stats, setStats] = useState({ clubs: 0, events: 0, posts: 0, notices: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/clubs'),
      api.get('/events'),
      api.get('/forum'),
      api.get('/announcements'),
    ]).then(([clubs, events, posts, announcements]) => {
      setStats({
        clubs: clubs.data.length,
        events: events.data.length,
        posts: posts.data.length,
        notices: announcements.data.length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="home-dashboard animate-in">
      <section className="hero">

        <h1>Welcome back to CollegeBook</h1>
        <p>Your centralized dashboard for college activities, discussions, and updates.</p>
        <div className="hero-actions">
          <Link to="/events" className="btn-secondary">
            View Upcoming Events <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="stats staggered-entry" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', margin: '-4rem 2rem 3rem', position: 'relative', zIndex: 10 }}>
        <div className="card glass" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{stats.clubs}</h3>
          <p style={{ fontWeight: 600 }}>Active Clubs</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{stats.events}</h3>
          <p style={{ fontWeight: 600 }}>Upcoming Events</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{stats.posts}</h3>
          <p style={{ fontWeight: 600 }}>Forum Discussions</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{stats.notices}</h3>
          <p style={{ fontWeight: 600 }}>New Notices</p>
        </div>
      </section>

      <section className="quick-links">
        <h2>Quick Access</h2>
        <div className="quick-grid staggered-entry">
          <Link to="/clubs" className="quick-card">

            <div className="quick-icon"><Users size={24} /></div>
            <h3>Clubs & Societies</h3>
            <p>Join communities and track activities</p>
          </Link>
          
          <Link to="/events" className="quick-card">
            <div className="quick-icon"><CalendarDays size={24} /></div>
            <h3>Campus Events</h3>
            <p>Register for tech fests and workshops</p>
          </Link>
          
          <Link to="/forum" className="quick-card">
            <div className="quick-icon"><MessageSquare size={24} /></div>
            <h3>Discussion Forum</h3>
            <p>Ask questions and share knowledge</p>
          </Link>
          
          <Link to="/faculty" className="quick-card">
            <div className="quick-icon"><BookOpen size={24} /></div>
            <h3>Faculty Directory</h3>
            <p>Find professors and book office hours</p>
          </Link>

          <Link to="/announcements" className="quick-card">
            <div className="quick-icon"><BellRing size={24} /></div>
            <h3>Official Notices</h3>
            <p>Important updates from administration</p>
          </Link>



          <Link to="/support" className="quick-card">
            <div className="quick-icon"><HelpCircle size={24} /></div>
            <h3>Help & Support</h3>
            <p>Raise tickets for IT or admin issues</p>
          </Link>
        </div>
      </section>
      <UpcomingEventsReminder />
    </div>
  );
};

export default Home;
