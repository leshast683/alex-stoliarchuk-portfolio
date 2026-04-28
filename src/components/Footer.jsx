
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Alex Builds Web. All rights reserved.</p>
      <div className={styles.social}>
        <a href="https://github.com/leshast683" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/alex-stoliarchuk/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://www.instagram.com/alexbuildsweb?igsh=MXhweDltNWc2NjF6dg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
}
