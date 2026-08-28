import { defineConfig } from "vitepress";

// The docs live under docs/ and the site root is docs-site/, so every page
// keeps the URL it had under Docusaurus: /scorm-again/docs/<section>/<page>.
// That is why the existing absolute /docs/... links in the markdown still
// resolve without being rewritten.
export default defineConfig({
  title: "scorm-again",
  description: "A modern SCORM runtime for JavaScript",
  lang: "en-US",

  base: "/scorm-again/",
  cleanUrls: true,
  lastUpdated: true,

  // Everything that is not site content.
  srcExclude: ["README.md", "**/node_modules/**"],

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/scorm-again/img/favicon.svg" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/scorm-again/img/favicon-32x32.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/scorm-again/img/favicon-16x16.png" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/scorm-again/img/apple-touch-icon.png" }],
    ["link", { rel: "manifest", href: "/scorm-again/img/site.webmanifest" }],
    ["meta", { property: "og:image", content: "/scorm-again/img/scorm-again-logo.svg" }],
  ],

  markdown: {
    theme: {
      light: "github-light",
      dark: "dracula",
    },
    // Shiki has no `gradle` grammar. The one gradle fence we ship is Groovy
    // DSL, so this highlights it properly instead of falling back to plain text.
    languageAlias: {
      gradle: "groovy",
    },
  },

  themeConfig: {
    logo: {
      light: "/img/scorm-again-logo-small.svg",
      dark: "/img/scorm-again-logo-small-dark.svg",
      alt: "scorm-again",
    },

    nav: [
      { text: "Docs", link: "/docs/getting-started/introduction", activeMatch: "/docs/" },
      { text: "Demo", link: "/demo" },
      { text: "npm", link: "https://www.npmjs.com/package/scorm-again" },
    ],

    sidebar: {
      "/docs/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/docs/getting-started/introduction" },
            { text: "Installation", link: "/docs/getting-started/installation" },
            { text: "Quick Start", link: "/docs/getting-started/quick-start" },
          ],
        },
        {
          text: "Configuration",
          items: [
            { text: "Settings Reference", link: "/docs/configuration/settings-reference" },
            { text: "Event Listeners", link: "/docs/configuration/event-listeners" },
            { text: "Data Formats", link: "/docs/configuration/data-formats" },
          ],
        },
        {
          text: "LMS Integration",
          items: [
            { text: "Integration Guide", link: "/docs/lms-integration/integration-guide" },
            { text: "Player Wrapper Guide", link: "/docs/lms-integration/player-wrapper-guide" },
            { text: "Cross-Frame Communication", link: "/docs/lms-integration/cross-frame-communication" },
            { text: "Multi-SCO Support", link: "/docs/lms-integration/multi-sco-support" },
            { text: "API Events Reference", link: "/docs/lms-integration/api-events-reference" },
          ],
        },
        {
          text: "SCORM Standards",
          items: [
            { text: "SCORM 1.2 Guide", link: "/docs/scorm-standards/scorm12-guide" },
            { text: "SCORM 2004 Guide", link: "/docs/scorm-standards/scorm2004-guide" },
          ],
        },
        {
          text: "Advanced",
          items: [
            { text: "Offline Support", link: "/docs/advanced/offline-support" },
            { text: "Sequencing", link: "/docs/advanced/sequencing" },
            {
              text: "Mobile Integration",
              collapsed: false,
              items: [
                { text: "React Native", link: "/docs/advanced/mobile/react-native" },
                { text: "Flutter", link: "/docs/advanced/mobile/flutter" },
                { text: "iOS Native", link: "/docs/advanced/mobile/ios-native" },
                { text: "Android Native", link: "/docs/advanced/mobile/android-native" },
                { text: "Xamarin / MAUI", link: "/docs/advanced/mobile/xamarin-maui" },
                { text: "Kotlin Multiplatform", link: "/docs/advanced/mobile/kotlin-multiplatform" },
              ],
            },
          ],
        },
        {
          text: "API Reference",
          items: [
            { text: "SCORM 1.2 API", link: "/docs/api-reference/scorm12-api" },
            { text: "SCORM 2004 API", link: "/docs/api-reference/scorm2004-api" },
          ],
        },
        {
          text: "Developer",
          items: [
            { text: "Contributing", link: "/docs/developer/contributing" },
            { text: "Development Workflow", link: "/docs/developer/development-workflow" },
            { text: "Testing", link: "/docs/developer/testing" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/jcputney/scorm-again" }],

    editLink: {
      pattern: "https://github.com/jcputney/scorm-again/edit/master/docs-site/:path",
      text: "Edit this page on GitHub",
    },

    // Replaces @easyops-cn/docusaurus-search-local, which is no longer a dependency.
    search: {
      provider: "local",
    },

    outline: { level: [2, 3] },

    footer: {
      message:
        'Released under the <a href="https://github.com/jcputney/scorm-again/blob/master/LICENSE">MIT License</a>.',
      copyright: `Copyright © ${new Date().getFullYear()} scorm-again`,
    },
  },
});
