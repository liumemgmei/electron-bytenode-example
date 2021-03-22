const ElectronBytenodeWebpackPlugin = require('./electron-bytenode-webpack-plugin');
const rules = require('./webpack.rules');

/** @type {import(‘@types/webpack’).Configuration} */
module.exports = {
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
  // plugins: [
  //   new ElectronBytenodeWebpackPlugin(),
  // ],
};
