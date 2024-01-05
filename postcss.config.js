module.exports = {
  plugins: [
    [
      '@fullhuman/postcss-purgecss',
      {
        content: ['**/*.ts', '**/*.js', '**/*.css', '**/*.scss'],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        fontFace: true,
        variables: true,
        safelist: {
          standard: ['html', 'body'],
          deep: [],
          greedy: [],
        },
      },
    ],
  ],
};
