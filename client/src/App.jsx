import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Landingpg from './pages/landingpg.jsx';
import Signin from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import About from './pages/About.jsx';
import Profile from './pages/profile.jsx';
import Dashboard from './pages/dashboard.jsx';
import Project from './pages/project.jsx'
import Teams from './pages/Teams.jsx';
import Messages from './pages/Messages.jsx';
import Tasks from './pages/Tasks.jsx';

function AppContent() {
  const location = useLocation();
  return (
    <>
      <ToastContainer />
      {location.pathname !== "/sign-up" && location.pathname !== "/" && <Header />}
      <Routes>

        <Route path="/" element={<Landingpg />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project" element={<Project/>} />
        <Route path="/teams" element = {<Teams/>} />
        <Route path="/messages" element = {<Messages/>} />
        <Route path="/tasks" element = {<Tasks/>} />
        
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
