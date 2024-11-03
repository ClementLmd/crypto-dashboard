'use client';
import { useState } from 'react';
import styles from './signIn.module.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {};

  return (
    <div className={styles.auth}>
      <div className={styles.inputContainer}>
        <Input
          type="text"
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Username"
        />
      </div>
      <div className={styles.inputContainer}>
        <Input
          type="password"
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
        />
      </div>
      <Button onClick={handleSignIn}>Sign up</Button>
    </div>
  );
}
