import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'gulp-clean';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cssimport from 'gulp-cssimport';
import autoprefixer from 'gulp-autoprefixer';
import htmlmin from 'gulp-htmlmin';
import inject from 'gulp-inject';

const sass = gulpSass(dartSass);


// const sitemap = require('gulp-sitemap');
// const lr = require('tiny-lr');
// const eslint = require("gulp-eslint");
// const plumber = require("gulp-plumber");
// const panini = require('panini');
// const fileinclude = require('gulp-file-include');
// const rev = require('gulp-rev');
// const replace = require('gulp-replace');

const paths = {
  styles: {
    src: ['src/styles/**/*.scss'],
    dest: 'dist/styles'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images'
  },
  icons: {
    src: 'src/icons/*',
    dest: 'dist/icons'
  },
  html: {
    src: ['src/**/*.htm', 'src/**/*.html'],
    dest: 'dist'
  },
  files: {
    src: ['src/**/*.pdf'],
    dest: 'dist'
  },
  fonts: {
    src: ['src/fonts/*', 'node_modules/vazirmatn/fonts/webfonts/*', 'node_modules/vazirmatn/misc/Farsi-Digits/fonts/webfonts/*'],
    dest: 'dist/fonts'
  }
};

export function clean() {
  return gulp.src('dist', {read: false, allowEmpty: true})
  .pipe(del());
}

export function styles() {
  var options = { includePaths: ['node_modules'], matchPattern: "*.css"};
  return gulp.src(paths.styles.src)
    .pipe(cssimport(options))
    .pipe(sass({ style: 'expanded', includePaths: ['node_modules'] }))
    .pipe(autoprefixer())
    .pipe(concat('styles.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS({level: 2}))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

export function fonts() {
  return gulp.src(paths.fonts.src)
  .pipe(gulp.dest(paths.fonts.dest));
}

export function icons() {
  return gulp.src(paths.icons.src)
  .pipe(gulp.dest(paths.icons.dest));
}

export function html() {
  return gulp.src(paths.html.src)
  .pipe(inject(gulp.src(['dist/**/*.css', 'dist/**/*.js'], {read: true, allowEmpty: true})))
  .pipe(htmlmin({removeComments: true}))
  .pipe(gulp.dest(paths.html.dest));
}

export function files() {
  return gulp.src(paths.files.src)
  .pipe(gulp.dest(paths.files.dest));
}

function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.icons.src, icons);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
}
export { watchFiles as watch };

export const build = gulp.series(clean, scripts, styles, images, fonts, icons, html, files);

export default build;
