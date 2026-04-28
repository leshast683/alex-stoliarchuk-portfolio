
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import SWCProject from './pages/SWCProject';
import { trackSectionView, trackEvent } from './analytics';
import './App.css';

function MainPage() {
  const [showResume, setShowResume] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    trackEvent('page_view', { page: 'home' });
    const sections = ['home', 'about', 'projects', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) trackSectionView(id); },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  return (
    <div className="app">
      <Helmet>
        <title>Alex Builds Web — UX/UI Designer & Web Developer</title>
        <meta name="description" content="Portfolio of Alex Builds Web — Digital Media student at UCF specializing in UX/UI design, web development, landing pages, and mobile app design." />
        <meta name="keywords" content="Alex Builds Web, UX/UI designer, web developer, portfolio, landing page design, mobile app design, UCF, digital media, business website" />
        <meta name="author" content="Alex Builds Web" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://alexbuildsweb.com" />
        <meta property="og:title" content="Alex Builds Web — UX/UI Designer & Web Developer" />
        <meta property="og:description" content="Portfolio of Alex Builds Web — UX/UI design, web development, landing pages, and creative digital experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alexbuildsweb.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alex Builds Web — UX/UI Designer & Web Developer" />
        <meta name="twitter:description" content="Portfolio of Alex Builds Web — UX/UI design, web development, landing pages, and creative digital experiences." />
      </Helmet>
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
