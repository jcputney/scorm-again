import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'SCORM 1.2 & 2004',
    icon: '📚',
    description:
      'Full support for both SCORM standards with compliant data models and API implementations.',
  },
  {
    title: 'Complete Sequencing',
    icon: '🧭',
    description:
      'Full SCORM 2004 sequencing and navigation implementation - activity trees, rollup rules, and more.',
  },
  {
    title: 'Cross-Frame & Offline',
    icon: '📱',
    description:
      'Run content in sandboxed iframes. Store and sync data offline for mobile apps.',
  },
  {
    title: 'TypeScript & Events',
    icon: '⚡',
    description:
      'Fully typed with comprehensive event listeners for tracking every API interaction.',
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--6 col--lg-3')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
