/**
 * build examples
 */

const path = require('path');
const gulp = require('gulp');

gulp.task('build-examples', async function () {
  const env = require('../env')();

  // Copy examples to output
  await new Promise((resolve) => {
    gulp
      .src([path.join(env.rootPath, 'examples', '**/*')])
      .pipe(gulp.dest(path.join(env.outputPath, 'examples')))
      .on('end', resolve);
  });
});
