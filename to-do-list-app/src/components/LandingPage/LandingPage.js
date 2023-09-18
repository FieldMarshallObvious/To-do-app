import {React, useRef, useEffect} from 'react';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

    const navigate = useNavigate();

    const navigateToSignUp = () => {
        navigate('/signup');
    };

    const textRef = useRef(null);

    useEffect(() => {
      if (textRef.current) {
        const children = Array.from(textRef.current.children);
        children.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('visible');
          }, index * 300); // Adjust delay as needed
        });
      }
    }, []);

  return (
    <div className={styles.container}>
      <div className={styles.boldText}>Organize your life, the right way</div>
      <div className={styles.descriptorText}>{'Why should getting organized be hard?\n Throw out all the clutter and uneeded\n features today'}</div>
      <button className={styles.signupButton}  onClick={navigateToSignUp}>Sign Up Today</button>
    </div>
  );
}

export default LandingPage;
