import styles from './loader.module.css';

export function Loader(message?: string) {
  return (
    <div className={styles.loader_wrapper}>
      <div className={styles.lds_ellipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default Loader;
