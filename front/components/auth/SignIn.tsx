'use client';
import { useState } from 'react';
import styles from './signIn.module.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { signIn } from '../../features/user/user.thunks';
import { useAppDispatch } from '../../hooks/hooks';
import { errors } from 'crypto-dashboard-shared';
import { routes } from '../../app/config/routes';
import { useRouter } from 'next/navigation';
export function SignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (username.trim() === '' || password.trim() === '') {
      setFeedbackMessage(errors.users.incompleteData);
      return;
    }
    try {
      await dispatch(signIn({ username, password })).unwrap();
      setFeedbackMessage('User signed in');
      setUsername('');
      setPassword('');
      router.push(routes.addresses);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFeedbackMessage('Sign in error');
    }
  };

  return (
    <div className={styles.auth}>
      <div className={styles.inputContainer}>
        <Input
          type="text"
          className={styles.input}
          onChange={(e) => {
            setFeedbackMessage(null);
            setUsername(e.target.value);
          }}
          value={username}
          placeholder="Username"
          name="username"
        />
      </div>
      <div className={styles.inputContainer}>
        <Input
          type="password"
          className={styles.input}
          onChange={(e) => {
            setFeedbackMessage(null);
            setPassword(e.target.value);
          }}
          value={password}
          placeholder="Password"
          name="password"
        />
      </div>
      {feedbackMessage && <div className={styles.feedback}>{feedbackMessage}</div>}
      <Button onClick={handleSignIn}>Sign in</Button>
    </div>
  );
}
