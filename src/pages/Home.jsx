
import { motion } from 'framer-motion';
import styles from './Home.module.css';

export default function Home() {
  return (
    <motion.div 
      className={styles.home}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.content}>
        <div className={styles.heroImage}>
          <img src="/img/chicago.jpg" alt="Chicago" />
        </div>
        <div className={styles.text}>
          <h1>Welcome to My Portfolio</h1>
          <p>Let's turn bold ideas into digital realities and shape tomorrow, together</p>
        </div>
        <div className={styles.heroImage}>
          <img src="/img/chicago2.jpg" alt="Chicago 2" />
        </div>
      </div>
    </motion.div>
  );
}
