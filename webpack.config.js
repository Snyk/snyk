const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/cli/index.ts',
  target: 'node10',
  // devtool: 'source-map', // TODO: get dev/prod defaults for devtool
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist/cli/'),
    filename: 'index.js',
    library: {
      name: 'snyk',
      type: 'umd',
    },
  },

  node: false,
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(txt)$/,
        type: 'asset/resource',
        generator: {
          filename: 'help/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
  },
  externals: {
    '@deepcode/dcignore': '@deepcode/dcignore', // depends on reading .dcignore files off the disk
    '@snyk/code-client': '@snyk/code-client',
    'snyk-policy': 'snyk-policy', // loads its own package.json in runtime, could be solved by forcing it in webpack bundle, or by updating the snyk-policy
    'update-notifier': 'update-notifier', // using "lazy-import" which webpack can't resolve
    'snyk-resolve-deps': 'snyk-resolve-deps', // results in an empty console.log when included in `npm-modules-parser.ts`
    'snyk-try-require': 'snyk-try-require', // results in an empty console.log when included in `protect/wizard.ts`. Caused by a "module.parent" if in the module
  },
};
