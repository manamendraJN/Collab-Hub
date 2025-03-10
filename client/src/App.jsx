import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Landingpg from './pages/landingpg.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import About from './pages/About.jsx';
import Profile from './pages/profile.jsx';
import Dashboard from './pages/dashboard.jsx';
import Project from './pages/project.jsx';
import Messages from './pages/Messages.jsx';
import Tasks from './pages/Tasks.jsx';
import TeamMember from "./pages/TeamMember";

function AppContent() {
  const location = useLocation();
  return (
    <>
      <ToastContainer />
      {location.pathname !== "/sign-up" && location.pathname !== "/" && location.pathname !== "/login" && <Header />}
      <Routes>
        <Route path="/" element={<Landingpg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project" element={<Project />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/team-members" element={<TeamMember />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
