import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './demo.module.css';

type DemoItem = {
  title: string;
  description: string;
  href: string;
};

const DemoList: DemoItem[] = [
  {
    title: 'SCORM 1.2 Demo',
    description:
      'Test the SCORM 1.2 API implementation with the Golf Examples content package. Includes full CMI data model support and lesson tracking.',
    href: '/scorm-again/demo/scorm12.html',
  },
  {
    title: 'SCORM 2004 Demo',
    description:
      'Test the SCORM 2004 API implementation with sequencing and navigation support. Includes the complete CMI data model for SCORM 2004 4th Edition.',
    href: '/scorm-again/demo/scorm2004.html',
  },
];

function DemoCard({title, description, href}: DemoItem): ReactNode {
  return (
    <div className={styles.demoCard}>
      <Heading as="h3" className={styles.demoTitle}>
        {title}
      </Heading>
      <p className={styles.demoDescription}>{description}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="button button--primary button--lg">
        Launch Demo
      </a>
    </div>
  );
}

export default function Demo(): ReactNode {
  return (
    <Layout title="Demo" description="Interactive SCORM demos for scorm-again">
      <main className={styles.demoPage}>
        <div className="container">
          <div className={styles.demoHeader}>
            <Heading as="h1">Interactive Demos</Heading>
            <p className={styles.demoSubtitle}>
              Try out scorm-again with real SCORM content. These demos use the
              Golf Examples content package to demonstrate full API functionality.
            </p>
          </div>
          <div className={styles.demoGrid}>
            {DemoList.map((props, idx) => (
              <DemoCard key={idx} {...props} />
            ))}
          </div>
          <div className={styles.demoNote}>
            <Heading as="h2">How It Works</Heading>
            <p>
              Each demo launches in a new tab with a simulated LMS environment.
              The SCORM content runs in an iframe and communicates with the
              scorm-again API. You can view API calls and data in the debug panel.
            </p>
            <p>
              These demos use a mock HTTP backend - no data is sent to any server.
              All SCORM data is logged to the browser console and displayed in the UI.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
