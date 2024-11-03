'use client';
import { useState } from 'react';
import styles from './fetchHelloWorldButton.module.css';
import { Button } from '../../../components/ui/button';

export default function FetchHelloWorldButton() {
  const [displayHelloWorld, setDisplayHelloWorld] = useState(false);
  const handleClick = () => {
    fetch('http://localhost:3001')
      .then(() => setDisplayHelloWorld(!displayHelloWorld))
      .catch((error) => console.log({ error }));
  };

  return (
    <div className={styles.body}>
      <Button className={styles.button} onClick={handleClick}>
        Display Hello World !
      </Button>
      {displayHelloWorld && <div>Hello World !</div>}
    </div>
  );
}
