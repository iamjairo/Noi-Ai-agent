import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Noi',
  tagline: '🚀 Less chaos. More flow.',
  favicon: 'readme/noi.png',

  // Set the production url of your site here
  url: 'https://noib.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/Noi-Ai-agent/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'iamjairo', // Usually your GitHub org/user name.
  projectName: 'Noi-Ai-agent', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    // locales: ['en', 'zh-CN'],
  },

  plugins: [
    async function loadTailwindCSS() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
        configureWebpack(config: import('webpack').Configuration) {
          // webpackbar (a @docusaurus/core dependency) internally passes options
          // to webpack's ProgressPlugin that webpack ≥5.65 rejects as unknown
          // (name, color, reporters, reporter). Remove those plugin instances to
          // prevent the ValidationError during `docusaurus build`, then add a
          // plain ProgressPlugin that uses only the supported webpack 5 API.
          if (Array.isArray(config.plugins)) {
            config.plugins = config.plugins.filter(
              (p) => p?.constructor?.name !== 'WebpackBarPlugin',
            );
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const webpack = require('webpack') as typeof import('webpack');
            config.plugins.push(new webpack.ProgressPlugin());
          }
          return {};
        },
      }
    }
  ],

  presets: [
    [
      'classic',
      {
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Noi',
      logo: {
        alt: 'Noi Logo',
        src: 'readme/noi.png',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Tutorial',
        // },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr style="margin: 0.3rem 0;">',
            },
            {
              href: 'https://github.com/lencx/Noi',
              label: 'Help Us Translate',
            },
          ],
        },
        {
          href: 'https://github.com/lencx/noi',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.producthunt.com/posts/noi-2',
          label: 'Product Hunt',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} <a target="_blank" href="https://lencx.me">lencx</a>. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
