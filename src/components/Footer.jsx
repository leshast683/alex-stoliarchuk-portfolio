
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        <img src="/favicon.png" alt="Alex Builds Web logo" className={styles.footerLogo} />
        <span>2026 Alex Builds Web. All rights reserved.</span>
      </div>
    </footer>
  );
}
