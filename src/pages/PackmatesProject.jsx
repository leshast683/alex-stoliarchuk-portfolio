import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './SWCProject.module.css';

export default function PackmatesProject() {
  return (
    <div className={styles.page}>
      <Navbar />
      <motion.div
        className={styles.wrapper}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className={styles.backArrow}
          onClick={() => {
            if (window.opener) {
              window.opener.location.href = '/#projects';
              window.close();
            } else {
              window.location.href = '/#projects';
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Projects
        </button>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.tag}>Capstone · Team Project · Travel App</span>
            <h1>Packmates</h1>
            <p className={styles.heroSub}>A collaborative travel packing app with weather-based adaptive lists, trip management, and a smart physical tag — built as a capstone project.</p>
          </div>
          <div className={styles.logoCircle} style={{ background: '#ffffff' }}>
            <img src="/img/logo.pack.png" alt="Packmates Logo" className={styles.logo} style={{ objectFit: 'contain', padding: '8px' }} />
          </div>
        </div>

        {/* Overview strip */}
        <div className={styles.overviewStrip}>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Type</span><span>Capstone Project</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Team</span><span>Collaborative</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Tech</span><span>HTML, CSS, JS, PHP, Docker</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Year</span><span>2026</span></div>
        </div>

        {/* Teamwork */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🤝 Team Collaboration</h2>
          <p className={styles.sectionIntro}>Packmates was built as a full team effort. Each member owned specific pages and features, working in parallel to deliver a cohesive product that matched our HiFi prototype.</p>
          <div className={styles.researchCards}>
            <div className={styles.researchCard} style={{borderTop: '4px solid #000'}}>
              <span className={styles.researchEmoji}>📋</span>
              <h3>Divided Ownership</h3>
              <p>Each team member took full responsibility for different pages — home, trip overview, pack list, notifications, discover, and settings — keeping work parallel and efficient.</p>
            </div>
            <div className={styles.researchCard} style={{borderTop: '4px solid #555'}}>
              <span className={styles.researchEmoji}>🔗</span>
              <h3>Consistent Design System</h3>
              <p>Despite working independently, the team maintained shared fonts, colors, spacing, and navigation patterns so the app felt like one unified product across all pages.</p>
            </div>
            <div className={styles.researchCard} style={{borderTop: '4px solid #999'}}>
              <span className={styles.researchEmoji}>🔄</span>
              <h3>Prototype Fidelity</h3>
              <p>Every page was compared directly against the HiFi prototype during testing. Layout, spacing, and visual hierarchy were adjusted until the coded version matched the original design.</p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>✅ Key Features</h2>
          <div className={styles.responsibilityList}>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>01</span>
              <div><strong>Adaptive Packing List</strong><p>Smart packing lists that adjust based on trip details — destination, duration, and activities — so users never forget the essentials.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>02</span>
              <div><strong>Weather API Integration</strong><p>Live weather data pulled for the trip destination automatically updates the packing list — adding rain gear for storms, lighter clothing for heat.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>03</span>
              <div><strong>Trip Overview Dashboard</strong><p>A central hub for each trip — dates, destinations, packing progress, and connected teammates all in one snapshot view.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>04</span>
              <div><strong>Smart Travel Tag</strong><p>A physical QR code luggage tag that links directly to the user's packing checklist — scan it at the airport and instantly see what's packed.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>05</span>
              <div><strong>Discover & Notifications</strong><p>A discover page for browsing trip ideas and a notifications hub to stay updated on shared list changes from teammates.</p></div>
            </div>
          </div>
        </section>

        {/* Design Guide */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎨 Design Guide</h2>
          <p className={styles.sectionIntro}>The visual identity was built around a travel-inspired palette — deep navy for trust, teal for adventure, and green for action — paired with clean, modern typography.</p>

          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: '#000' }}>Color Palette</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { color: '#1B3558', label: 'Navy', hex: '#1B3558' },
              { color: '#2E8FA5', label: 'Teal', hex: '#2E8FA5' },
              { color: '#4CAF50', label: 'Green', hex: '#4CAF50' },
              { color: '#D9E8EF', label: 'Light Gray', hex: '#D9E8EF' },
              { color: '#000000', label: 'Black', hex: '#000000' },
            ].map(({ color, label, hex }) => (
              <div key={hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '12px', background: color, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#333' }}>{label}</span>
                <span style={{ fontSize: '0.72rem', color: '#999', fontFamily: 'monospace' }}>{hex}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: '#000' }}>Typography</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '1.5rem 2rem', flex: '1', minWidth: '200px' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', margin: '0 0 0.5rem' }}>Headings</p>
              <p style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.3rem', color: '#1B3558' }}>Blauer Nue</p>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Bold · 72px / 48px</p>
            </div>
            <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '1.5rem 2rem', flex: '1', minWidth: '200px' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', margin: '0 0 0.5rem' }}>Body</p>
              <p style={{ fontSize: '2rem', fontWeight: '400', margin: '0 0 0.3rem', color: '#1B3558', fontFamily: 'sans-serif' }}>Montserrat</p>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Regular · 24px / 16px</p>
            </div>
          </div>
        </section>

        {/* Lo-Fi Prototype */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📐 Lo-Fi Prototype</h2>
          <p className={styles.sectionIntro}>Early wireframes mapped out the full user flow — from login and sign-up through trip creation, packing list management, and notifications.</p>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <img src="/img/packmates-lofi.png" alt="Packmates Lo-Fi Wireframes" style={{ width: '100%', display: 'block' }} />
          </div>
        </section>

        {/* Site Map */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🗺️ Final Site Map</h2>
          <p className={styles.sectionIntro}>The final site map outlines the full structure of Packmates — from registration and login through the home dashboard, smart packing list, trip creation, and all supporting screens.</p>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <img src="/img/packmates-sitemap.png" alt="Packmates Final Site Map" style={{ width: '100%', display: 'block' }} />
          </div>
        </section>

        {/* Impact */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 What We Delivered</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <p>A fully coded multi-page web app that closely matched our HiFi prototype — built collaboratively from design to front-end in a single milestone.</p>
            </div>
            <div className={styles.impactCard}>
              <p>A physical-digital integration through the Smart Travel Tag — a QR code luggage tag that bridges the app with the real-world packing experience.</p>
            </div>
            <div className={styles.impactCard}>
              <p>A scalable foundation with clean HTML, CSS, and JavaScript structure ready for full back-end functionality and weather API integration in future milestones.</p>
            </div>
          </div>
        </section>

      </motion.div>
      <Footer />
    </div>
  );
}
