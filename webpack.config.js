const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  output: {
    publicPath: '/',
    chunkFilename: '[name].js',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/i,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env'],
        },
      },
    }],
  },
  mode: 'development',
  plugins: [
    new CopyPlugin([
      { from: 'public', to: '.' },
    ]),
  ],
};
