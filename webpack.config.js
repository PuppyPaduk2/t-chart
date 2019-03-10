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
          presets: ['@babel/preset-env', '@babel/flow'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  mode: 'development',
  plugins: [
    new CopyPlugin([
      { from: 'public', to: '.' },
    ]),
  ],
  devServer: {
    writeToDisk: true,
    port: 5000,
  },
};
