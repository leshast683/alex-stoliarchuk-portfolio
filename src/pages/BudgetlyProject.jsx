import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './SWCProject.module.css';

export default function BudgetlyProject() {
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
            <span className={styles.tag}>AI-Built · Personal Finance · Web App</span>
            <h1>Budgetly</h1>
            <p className={styles.heroSub}>A personal finance tracker built entirely with Claude — from concept to deployed product, with zero manual coding.</p>
            <a href="https://budgetly-sage.vercel.app/index.html?home=1" target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
              View Live App →
            </a>
          </div>
          <div className={styles.logoCircle}>
            <img src="/img/budgetly.png" alt="Budgetly" className={styles.logo} />
          </div>
        </div>

        {/* Overview strip */}
        <div className={styles.overviewStrip}>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Role</span><span>Developer & Designer</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Built With</span><span>Claude</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Year</span><span>2026</span></div>
          <div className={styles.overviewItem}><span className={styles.overviewLabel}>Type</span><span>Web App</span></div>
        </div>

        {/* How it was built */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🤖 Built Entirely with Claude</h2>
          <p className={styles.sectionIntro}>Budgetly was created without writing a single line of code manually. Every component — the UI, the logic, the styling, and the deployment setup — was generated through conversation with Claude.</p>
          <div className={styles.researchCards}>
            <div className={styles.researchCard} style={{borderTop: '4px solid #000'}}>
              <span className={styles.researchEmoji}>💬</span>
              <h3>Conversational Development</h3>
              <p>The entire app was described in plain language and Claude translated it into working HTML, CSS, and JavaScript — no IDE, no manual debugging.</p>
            </div>
            <div className={styles.researchCard} style={{borderTop: '4px solid #555'}}>
              <span className={styles.researchEmoji}>🎨</span>
              <h3>Design & Layout</h3>
              <p>Claude handled every design decision — color palette, spacing, card layouts, and responsive breakpoints — all from a short brief.</p>
            </div>
            <div className={styles.researchCard} style={{borderTop: '4px solid #999'}}>
              <span className={styles.researchEmoji}>🚀</span>
              <h3>Ready to Deploy</h3>
              <p>Claude produced clean, production-ready code that was deployed directly to Vercel with no post-processing or manual fixes needed.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>✅ Features</h2>
          <div className={styles.responsibilityList}>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>01</span>
              <div><strong>Income Tracking</strong><p>Log and categorize all income sources in one place with a clean, easy-to-update interface.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>02</span>
              <div><strong>Expense Tracking</strong><p>Record daily expenses by category and see exactly where your money is going each month.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>03</span>
              <div><strong>Savings Goals</strong><p>Set savings targets and track progress visually — stay motivated with a clear picture of how close you are.</p></div>
            </div>
            <div className={styles.responsibilityItem}>
              <span className={styles.bullet}>04</span>
              <div><strong>Clean Dashboard</strong><p>A single-screen overview of your financial health — designed to be simple, not overwhelming.</p></div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎨 Color Palette</h2>
          <p className={styles.sectionIntro}>Budgetly uses a warm, earthy palette — calm and approachable for a finance tool, with clear semantic colors for income, expenses, and highlights.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { color: '#1a0e06', label: 'Dark Brown', hex: '#1A0E06' },
              { color: '#ede8e0', label: 'Cream', hex: '#EDE8E0', border: true },
              { color: '#34A853', label: 'Income', hex: '#34A853' },
              { color: '#EA4335', label: 'Expenses', hex: '#EA4335' },
              { color: '#FBBC05', label: 'Amber', hex: '#FBBC05' },
              { color: '#4285F4', label: 'Interactive', hex: '#4285F4' },
            ].map(({ color, label, hex, border }) => (
              <div key={hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '12px', background: color, border: border ? '1px solid #e0e0e0' : 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#333' }}>{label}</span>
                <span style={{ fontSize: '0.72rem', color: '#999', fontFamily: 'monospace' }}>{hex}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Impact */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 Why It Matters</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <p>Proves that a fully functional, deployed web app can be built with Claude alone — no traditional development workflow required.</p>
            </div>
            <div className={styles.impactCard}>
              <p>Demonstrates how AI can bridge the gap between an idea and a live product faster than ever before.</p>
            </div>
            <div className={styles.impactCard}>
              <p>A practical tool that solves a real problem — personal finance management made simple and stress-free.</p>
            </div>
          </div>
        </section>

      </motion.div>
      <Footer />
    </div>
  );
}
