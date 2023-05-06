import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.scss';
import { CiDark, CiLight } from 'react-icons/ci';

const ThemeToggle = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const inactiveTheme = activeTheme === 'light' ? 'dark' : 'light';

  useEffect(() => {
    document.body.dataset.theme = activeTheme;
  }, [activeTheme]);

  return (
    <button
      className={styles.button}
      onClick={() => setActiveTheme(inactiveTheme)}
    >
      <span className={styles.thumb} />
      <span>
        <CiDark />
      </span>
      <span>
        <CiLight />
      </span>
    </button>
  );
};

export default ThemeToggle;
