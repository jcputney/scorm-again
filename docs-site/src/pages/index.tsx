import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const logoUrl = useBaseUrl("/img/scorm-again-logo.svg");
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <img
          src={logoUrl}
          alt="scorm-again logo"
          className={styles.heroLogo}
        />
        <p className={styles.heroSubtitle}>
          A modern SCORM runtime for JavaScript
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/introduction">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            to="https://github.com/jcputney/scorm-again">
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickInstall() {
  return (
    <section className={styles.quickInstall}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Quick Install
        </Heading>
        <div className={styles.codeBlockWrapper}>
          <CodeBlock language="bash">npm install scorm-again</CodeBlock>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="A modern SCORM runtime for JavaScript with full support for SCORM 1.2 and 2004">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickInstall />
      </main>
    </Layout>
  );
}
