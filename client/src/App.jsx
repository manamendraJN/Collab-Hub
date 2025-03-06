import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Landingpg from './pages/landingpg.jsx';
import Signin from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import About from './pages/About.jsx';
import Profile from './pages/profile.jsx';
import Home from './pages/home.jsx';
import Project from './pages/project.jsx'

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
        <Route path="/home" element={<Home />} />
        <Route path="/project" element={<Project/>} />
        
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
