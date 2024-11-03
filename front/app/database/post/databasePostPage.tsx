'use client';
// Route: /database/post
import { useState } from 'react';
import { createUser } from '../../../features/user/user.thunks';
import { useAppDispatch } from '../../../hooks/hooks';
import styles from './databasePostPage.module.css';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function DatabasePostPage() {
  const dispatch = useAppDispatch();

  const [userFirstname, setUserFirstname] = useState<string>('');
  const [userLastname, setUserLastname] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSubmitNewUser = async () => {
    if (userFirstname.trim() === '' || userLastname.trim() === '') {
      setFeedbackMessage('Firstname and lastname are required.');
      return;
    }
    try {
      await dispatch(createUser({ firstname: userFirstname, lastname: userLastname })).unwrap();
      setFeedbackMessage('User created successfully!');
      setUserFirstname('');
      setUserLastname('');
    } catch (error) {
      setFeedbackMessage(`Error : ${error}`);
    }
  };

  return (
    <main className={styles.main}>
      <div>
        <div>Save a new user in database</div>
        <div className="flex-col items-center justify-between my-2">
          <Input
            name="firstname"
            value={userFirstname}
            placeholder="User's firstname"
            onChange={(e) => setUserFirstname(e.target.value)}
            className="my-2"
          />
          <Input
            name="lastname"
            value={userLastname}
            placeholder="User's lastname"
            onChange={(e) => setUserLastname(e.target.value)}
            className="my-2"
          />
          {feedbackMessage && <div>{feedbackMessage}</div>}
          <Button onClick={handleSubmitNewUser} type="submit">
            Submit
          </Button>
        </div>
      </div>
    </main>
  );
}
