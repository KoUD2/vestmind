import styles from '../Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            Vest<span className={styles.logoAccent}>mind</span>
          </span>
        </div>
        <nav aria-label="Footer" className={styles.nav}>
          <a href="#how" className={styles.link}>How we work</a>
          <a href="#automate" className={styles.link}>What we automate</a>
          <a href="#why" className={styles.link}>Why us</a>
          <a href="mailto:hello@vestmind.studio" className={styles.link}>hello@vestmind.studio</a>
        </nav>
        <p className={styles.copy}>© 2026 Vestmind. Rent the model. Own the intelligence.</p>
      </div>
    </footer>
  );
}
