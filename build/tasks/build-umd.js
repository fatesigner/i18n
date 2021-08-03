/**
 * build umd
 */

const path = require('path');
const gulp = require('gulp');
const log = require('fancy-log');
const webpack = require('webpack');

const runWebpack = function (options, isLog = false) {
  return new Promise(function (resolve, reject) {
    webpack(options, (err, stats) => {
      if (err || (stats && stats.compilation && stats.compilation.errors && stats.compilation.errors.length)) {
        if (!err) {
          err = stats.compilation.errors[0];
        }
        reject(err);
      } else {
        if (isLog) {
          log('[webpack]', stats.toString({ colors: true }));
        }
        resolve(stats);
      }
    });
  });
};

gulp.task('build-umd', async function () {
  const env = require('../env')();

  // Build umd.js
  await runWebpack(
    {
      mode: 'development',
      devtool: 'source-map',
      entry: path.join(env.srcPath, 'index.ts'),
      context: env.srcPath,
      output: {
        path: path.join(env.outputPath, 'umd'),
        chunkFilename: 'i18nx.umd.chunk.js',
        filename: 'i18nx.umd.js',
        library: 'I18nx',
        libraryTarget: 'umd'
      },
      module: {
        rules: [{ test: /\.ts?$/, loader: 'ts-loader' }]
      },
      externals: {
        vue: {
          root: 'Vue',
          commonjs: 'vue',
          commonjs2: 'vue',
          amd: 'vue'
        }
      },
      resolve: {
        extensions: ['.js', '.ts']
      }
    },
    true
  );
});
