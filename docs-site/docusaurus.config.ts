import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "scorm-again",
  tagline: "A modern SCORM runtime for JavaScript",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://jcputney.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/scorm-again/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "jcputney", // Usually your GitHub org/user name.
  projectName: "scorm-again", // Usually your repo name.

  onBrokenLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/jcputney/scorm-again/tree/master/docs-site/"
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css"
        }
      } satisfies Preset.Options
    ]
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true
      }
    ]
  ],

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/scorm-again/img/apple-touch-icon.png"
      }
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/scorm-again/img/favicon-32x32.png"
      }
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/scorm-again/img/favicon-16x16.png"
      }
    },
    {
      tagName: "link",
      attributes: {
        rel: "manifest",
        href: "/scorm-again/img/site.webmanifest"
      }
    }
  ],

  themeConfig: {
    // Social card for sharing on social media
    image: "img/scorm-again-logo.svg",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true
    },
    navbar: {
      title: "scorm-again",
      logo: {
        alt: "scorm-again Logo",
        src: "img/scorm-again-logo-small.svg",
        srcDark: "img/scorm-again-logo-small-dark.svg"
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs"
        },
        {
          to: "/demo",
          label: "Demo",
          position: "left"
        },
        {
          href: "https://github.com/jcputney/scorm-again",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs/getting-started/introduction"
            },
            {
              label: "API Reference",
              to: "/docs/api-reference/scorm12-api"
            }
          ]
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/jcputney/scorm-again"
            },
            {
              label: "npm",
              href: "https://www.npmjs.com/package/scorm-again"
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} scorm-again. MIT License.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
