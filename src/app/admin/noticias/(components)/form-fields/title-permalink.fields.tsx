'use client';

import { useState } from 'react';
import { PermalinkField } from './permalink.field';
import { TitleField } from './title.field';
import styles from './title-permalink.module.css';

export const TitlePermalinkFields = () => {
  const [permalinkChanged, setPermalinkChanged] = useState(false);

  const handlePermalinkChanged = (state: boolean) => {
    setPermalinkChanged(state);
  };

  return (
    <section className={styles.container}>
      <div className={styles.formGroup}>
        <TitleField
          permalinkChanged={permalinkChanged}
          handlePermalinkChanged={handlePermalinkChanged}
        />
      </div>
      <div className={styles.formGroup}>
        <PermalinkField
          handlePermalinkChanged={handlePermalinkChanged}
        />
      </div>
    </section>
  );
};
