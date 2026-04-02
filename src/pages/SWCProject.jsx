
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './SWCProject.module.css';

export default function SWCProject() {
  const redesignImages = ['/img/111.jpg', '/img/2222.jpg', '/img/3333.png'];
  const [lightboxIndex, setLightboxIndex] = useState(null);
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
            <span className={styles.tag}>UX/UI · Web Design · Content Strategy</span>
            <h1>SWC 2026 Summer Program</h1>
            <p className={styles.heroSub}>Designing a landing page that speaks the language of summer — built for teens, driven by research.</p>
            <a href="https://www.joinswc.org/s/pages/summerprogram" target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
              View Live Page →
            </a>
          </div>
          <div className={styles.logoCircle}>
            <img src="/img/logo4.jpg" alt="SWC Logo" className={styles.logo} />
          </div>
        </div>

        {/* Overview strip */}
        <div className={styles.overviewStrip}>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Role</span><span>UX/UI Designer & Web Manager</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Platform</span><span>Graphy CMS</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Year</span><span>2026</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Audience</span><span>Teens & Families</span></div>
        </div>

        {/* User Research */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔍 User Research</h2>
          <p className={styles.sectionIntro}>Before touching a single color or layout, we went straight to the target audience — teenagers. The findings shaped every design decision.</p>
          <div className={styles.researchCards}>
            <div className={styles.researchCard} style={{borderTop: '4px solid #39ff14'}}>
              <span className={styles.researchEmoji}>🎨</span>
              <h3>Neon Colors = Summer Vibes</h3>
              <p>Teens overwhelmingly preferred neon and bright accent colors — electric greens, hot pinks, vivid yellows — associating them directly with energy, fun, and summer.</p>
            </div>
            <div className={styles.researchCard} style={{borderTop: '4px solid #ff6b35'}}>
              <span className={styles.researchEmoji}>📱</span>
              <h3>Mobile-First Browsing</h3>
              <p>Over 80% of surveyed teens accessed program information via mobile. A responsive, thumb-friendly layout was non-negotiable.</p>
            </div>
            <div className={styles.researchCard} style={{borderTop: '4px solid #a259ff'}}>
              <span className={styles.researchEmoji}>⚡</span>
              <h3>Speed & Clarity</h3>
              <p>Users wanted registration info within 2 scrolls. Long paragraphs were dropped in favor of scannable bullets and bold visual hierarchy.</p>
            </div>
          </div>
        </section>

        {/* Responsibilities */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📈 Responsibilities</h2>
          <div className={styles.responsibilityList}>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>01</span>
              <div><strong>Landing Page Design & Launch</strong><p>Conceptualized, designed, and implemented a visually engaging, easy-to-navigate landing page serving as the primary informational and registration hub for the 2026 Summer Program.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>02</span>
              <div><strong>Content Strategy & Creation</strong><p>Developed a foundational content strategy, conducted content audits, created a comprehensive content calendar, and produced engaging website copy, articles, and blog posts aligned with SWC's mission.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>03</span>
              <div><strong>Web Management & UX/UI</strong><p>Executed design updates and managed content across key website pages using a CMS, ensuring mobile responsiveness, accessibility, and user-friendly navigation.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>04</span>
              <div><strong>SEO Optimization</strong><p>Applied SEO principles to improve content visibility and optimized multimedia assets to enhance digital performance.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>05</span>
              <div><strong>Cross-Functional Collaboration</strong><p>Partnered with Graphic Design Intern and Program Manager to translate program goals into a polished digital experience and sustainable website framework.</p></div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 Impact & Accomplishments</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <p>Delivered a polished, professional landing page that significantly improved program visibility and user engagement.</p>
            </div>
            <div className={styles.impactCard}>
              <p>Enhanced accessibility and usability for prospective participants and their families.</p>
            </div>
            <div className={styles.impactCard}>
              <p>Built a reusable digital infrastructure for SWC, supporting future website updates and campaigns.</p>
            </div>
          </div>
        </section>

        {/* Redesign */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔄 Redesign — Before & After</h2>
          <p className={styles.sectionIntro}>A visual walkthrough of the transformation — from the original pages to the refreshed, research-backed design.</p>
          <div className={styles.redesignGrid}>
            {redesignImages.map((src, i) => (
              <div key={i} className={styles.redesignItem} onClick={() => setLightboxIndex(i)}>
                <img src={src} alt={`Redesign ${i + 1}`} className={styles.redesignImg} />
              </div>
            ))}
          </div>

          {lightboxIndex !== null && (
            <div className={styles.lightbox} onClick={() => setLightboxIndex(null)}>
              <button className={styles.lightboxClose} onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>✕</button>
              <button className={styles.lightboxPrev} onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + redesignImages.length - 1) % redesignImages.length); }}>‹</button>
              <img src={redesignImages[lightboxIndex]} alt="Full view" className={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
              <button className={styles.lightboxNext} onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % redesignImages.length); }}>›</button>
            </div>
          )}
        </section>

      </motion.div>
      <Footer />
    </div>
  );
}
