const { mergeConfig } = require('vite');
const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.mdx'],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-controls',
    '@storybook/addon-docs',
  ],

  features: {
    storyStoreV7: true,
    previewMdx2: true,
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      base: "./",

      resolve: {
        alias: {
          assert: path.resolve(__dirname, './assert_fallback.cjs'),
        },
      },
    });
  },

  docs: {
    autodocs: true
  }
};
