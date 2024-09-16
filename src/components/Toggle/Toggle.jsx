import { useState } from 'react';
import styles from './Toggle.module.scss';

const Toggle = ({ isChecked }) => {
  return (
    // <div className={styles.toggleContainer} onClick={onToggle}>
      <div className={`${styles.toggle} ${isChecked ? styles.checked : ''}`}>
        <div className={styles.circle}></div>
      </div>
    // </div>
  );
};

export default Toggle;
