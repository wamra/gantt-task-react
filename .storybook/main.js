module.exports = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-controls', '@storybook/addon-controls'],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    return config;
  },
  docs: {
    autodocs: true
  }
};
