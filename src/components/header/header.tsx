import styles from 'src/components/header/header.module.css';
import logo from 'src/assets/logo.png';

export function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt='Logo' />
      </div>
      <div className={styles.title}>
        <p>Aggregate Positions Graph</p>
      </div>
    </div>
  );
}
