import gulp from 'gulp';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import moduleImporter from 'sass-module-importer';
import globImporter from 'sass-glob-importer';

import config from './../gulpfile.babel';


gulp.task('styles', function () {

    // TODO set it 'compressed' when this issue is solved https://github.com/sass/node-sass/issues/957
    const outputStyle = global.isProduction ? 'compressed' : 'expanded';

    return gulp.src(config.styles.src)
        .pipe(gulpif(config.styles.sourcemaps, sourcemaps.init()))
        .pipe(sass({ 
            outputStyle,
            importer: [globImporter(), moduleImporter()]
        }))
        .on('error', notify.onError('<%= error.message %>'))
        .pipe(autoprefixer({ browsers: ['last 2 versions', '> 1%', 'ie 9'] }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpif(config.styles.sourcemaps, sourcemaps.write('./')))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(config.autoreload, browserSync.stream()));
});