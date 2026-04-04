import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { CalendarDays, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import './UpcomingEventsReminder.css';

const UpcomingEventsReminder = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await api.get('/events');
        const today = new Date();
        const upcoming = response.data
          .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdown = {};
      upcomingEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const diff = eventDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          newCountdown[event._id] = { days, hours, minutes };
        } else {
          newCountdown[event._id] = { days: 0, hours: 0, minutes: 0 };
        }
      });
      setCountdown(newCountdown);
    }, 60000);

    return () => clearInterval(timer);
  }, [upcomingEvents]);

  if (loading) {
    return (
      <div className="upcoming-events-reminder loading">
        <div className="reminder-header">
          <CalendarDays size={24} />
          <h3>Loading upcoming events...</h3>
        </div>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="upcoming-events-reminder no-events">
        <div className="reminder-header">
          <CalendarDays size={24} />
          <h3>No Upcoming Events</h3>
        </div>
        <p className="no-events-msg">
          Stay tuned! New events will appear here.
        </p>
      </div>
    );
  }

  return (
    <section className="upcoming-events-reminder">
      <div className="reminder-header">
        <div className="header-left">
          <CalendarDays size={24} />
          <h3>Upcoming Events</h3>
        </div>
        <Link to="/events" className="view-all-btn">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="events-list">
        {upcomingEvents.map((event) => {
          const cd = countdown[event._id] || { days: 0, hours: 0, minutes: 0 };
          const isUrgent = cd.days <= 2;

          return (
            <div key={event._id} className={`event-reminder-card ${isUrgent ? 'urgent' : ''}`}>
              <div className="event-info">
                <h4 className="event-title">{event.title}</h4>
                <p className="event-date">
                  <Clock size={14} />
                  {new Date(event.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                {event.location && (
                  <p className="event-location">
                    <AlertCircle size={14} />
                    {event.location}
                  </p>
                )}
              </div>
              <div className={`countdown-badge ${isUrgent ? 'urgent' : ''}`}>
                <span className="countdown-label">
                  {isUrgent ? 'Happening Soon!' : 'Starting in'}
                </span>
                <div className="countdown-time">
                  <span className="time-unit">{cd.days}<small>d</small></span>
                  <span className="time-separator">:</span>
                  <span className="time-unit">{cd.hours}<small>h</small></span>
                  <span className="time-separator">:</span>
                  <span className="time-unit">{cd.minutes}<small>m</small></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UpcomingEventsReminder;
