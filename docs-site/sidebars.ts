import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/settings-reference',
        'configuration/event-listeners',
        'configuration/data-formats',
      ],
    },
    {
      type: 'category',
      label: 'LMS Integration',
      items: [
        'lms-integration/integration-guide',
        'lms-integration/player-wrapper-guide',
        'lms-integration/cross-frame-communication',
        'lms-integration/multi-sco-support',
        'lms-integration/api-events-reference',
      ],
    },
    {
      type: 'category',
      label: 'SCORM Standards',
      items: [
        'scorm-standards/scorm12-guide',
        'scorm-standards/scorm2004-guide',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/offline-support',
        'advanced/sequencing',
        {
          type: 'category',
          label: 'Mobile Integration',
          items: [
            'advanced/mobile/react-native',
            'advanced/mobile/flutter',
            'advanced/mobile/ios-native',
            'advanced/mobile/android-native',
            'advanced/mobile/xamarin-maui',
            'advanced/mobile/kotlin-multiplatform',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/scorm12-api',
        'api-reference/scorm2004-api',
      ],
    },
    {
      type: 'category',
      label: 'Developer',
      items: [
        'developer/contributing',
        'developer/development-workflow',
        'developer/testing',
      ],
    },
  ],
};

export default sidebars;
