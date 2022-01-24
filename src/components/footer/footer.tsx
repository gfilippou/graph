import styles from 'src/components/footer/footer.module.css';

export function Footer() {
  return (
    <div className={styles.footer}>
      Created by George Filippou
      <a href='https://github.com/SimpleFi-finance/frontend-test'>Specs</a>
      <a href='https://github.com/SimpleFi-finance/frontend-test'>
        Github repo
      </a>
    </div>
  );
}
