const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { spawn } = require('child_process');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

let electronStarted = false;

module.exports = {
  mode: 'development',
  entry: path.join(SRC_DIR, 'index.js'),
  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: [SRC_DIR],
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: [SRC_DIR],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name]__[hash:base64:5][ext]',
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name]__[hash:base64:5][ext]',
        },
      },
    ],
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({ title: 'Bibleify' }),
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    static: {
      directory: OUTPUT_DIR,
    },
    historyApiFallback: true,
    port: 8080,
    client: {
      overlay: true,
    },
    setupMiddlewares: middlewares => {
      if (!electronStarted) {
        electronStarted = true;
        // Start Electron once the dev server is ready.
        spawn('electron', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
          .on('close', () => process.exit(0))
          .on('error', spawnError => console.error(spawnError));
      }
      return middlewares;
    },
  },
};
