import gulp from 'gulp';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import webp from 'gulp-webp';
import gulpif from 'gulp-if';
import browserSync from 'browser-sync';

import config from './../gulpfile.babel';


gulp.task('images', () => {
  return gulp.src(config.images.src)
    .pipe(changed(config.images.dest))
    .pipe(imagemin({
      use: [pngquant()]
    }))
    .pipe(gulp.dest(config.images.dest))
    .pipe(gulpif(config.images.webp, webp()))
    .pipe(gulpif(config.images.webp, gulp.dest(config.images.dest)))
    .pipe(gulpif(config.autoreload, browserSync.stream()));
});
