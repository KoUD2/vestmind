'use client';
import styles from '../Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav aria-label="Primary" className={styles.nav}>
        <a href="#top" className={styles.logo}>
          Vest<span className={styles.logoAccent}>mind</span>
        </a>
        <div data-navlinks className={styles.navLinks}>
          <a href="#how" data-ulink className={styles.navLink}>How we work</a>
          <a href="#automate" data-ulink className={styles.navLink}>What we automate</a>
          <a href="#why" data-ulink className={styles.navLink}>Why us</a>
        </div>
        <a href="#book" data-btn className={styles.navBtn}>
          Book a paid audit
        </a>
      </nav>
    </header>
  );
}
