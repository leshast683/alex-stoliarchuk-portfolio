
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import SWCProject from './pages/SWCProject';
import './App.css';

function MainPage() {
  const [showResume, setShowResume] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <section id="home" className="page-section">
          <Home />
        </section>
        <section id="about" className="page-section">
          <About />
        </section>
        <section id="projects" className="page-section">
          <Projects />
        </section>
        <div className="resume-section">
          <span className="resume-section-label">Want to know more?</span>
          <button className="resume-btn" onClick={() => setShowResume(true)}>
            Check My Resume
          </button>
        </div>
        <section id="contact" className="page-section contact-section">
          <Contact />
        </section>
      </main>
      <Footer />

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      )}

      {showResume && (
        <div className="resume-overlay" onClick={() => setShowResume(false)}>
          <button className="resume-overlay-close" onClick={() => setShowResume(false)}>✕</button>
          <a
            href="/Alex_Stoliarchuk_Resume.pdf"
            download="Alex_Stoliarchuk_Resume.pdf"
            className="resume-download-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Download PDF
          </a>
          <iframe
            src="/Alex_Stoliarchuk_Resume.pdf"
            className="resume-iframe"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/swc-project" element={<SWCProject />} />
      </Routes>
    </BrowserRouter>
  );
}
