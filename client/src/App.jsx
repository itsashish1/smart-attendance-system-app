import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Forum from './pages/Forum';
import PostDetail from './pages/PostDetail';
import Faculty from './pages/Faculty';
import Announcements from './pages/Announcements';
import Support from './pages/Support';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:id" element={<ClubDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<PostDetail />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/support"
              element={<ProtectedRoute><Support /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
