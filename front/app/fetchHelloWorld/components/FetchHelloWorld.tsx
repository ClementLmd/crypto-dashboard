import styles from './fetchHelloWorld.module.css';
import FetchHelloWorldButton from './FetchHelloWorldButton';

export default function FetchHelloWorld() {
  return (
    <div className={styles.main}>
      <div className={styles.title}>
        Click to fetch and display Hello World{' '}
      </div>
      <FetchHelloWorldButton />
    </div>
  );
}
