
import { memo } from 'react';
import styles from './Navbar.module.css';

const Navbar = memo(function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/#home" className={styles.logoShimmer}>Alex Stoliarchuk</a>
      </div>
      <div className={styles.links}>
        <a href="/#home">Home</a>
        <a href="/#about">About</a>
        <a href="/#projects">Projects</a>
        <a href="/#contact">Contact</a>
      </div>
    </nav>
  );
});

export default Navbar;
