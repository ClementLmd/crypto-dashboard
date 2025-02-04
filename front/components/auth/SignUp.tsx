'use client';
import { useState } from 'react';
import styles from './signUp.module.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { signUp } from '../../features/user/user.thunks';
import { useAppDispatch } from '../../hooks/hooks';
import { validateUserPassword, errors } from 'shared';

export function SignUp() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (username.trim() === '' || password.trim() === '') {
      setFeedbackMessage(errors.users.incompleteData);
      return;
    }
    if (validateUserPassword(password)) {
      setFeedbackMessage(errors.users.incorrectPasswordFormat);
      return;
    }
    try {
      await dispatch(signUp({ username, password })).unwrap();
      setFeedbackMessage('User created successfully!');
      setUsername('');
      setPassword('');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFeedbackMessage('Sign up error');
    }
  };

  return (
    <div className={styles.auth}>
      <h1 className={styles.title}>Sign up</h1>
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
      <Button onClick={handleSignUp} className={styles.button}>
        Sign up
      </Button>
    </div>
  );
}
