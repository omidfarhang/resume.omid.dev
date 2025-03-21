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
import replace from 'gulp-replace';

const sass = gulpSass(dartSass);

const paths = {
  styles: {
    src: [
      'node_modules/bootstrap/dist/css/bootstrap.css',
      'node_modules/bootstrap-print-css/css/bootstrap-print.css',
      'node_modules/@fortawesome/fontawesome-free/css/all.css',
      'src/styles/**/*.scss'],
    dest: 'dist/styles'
  },
  scripts: {
    src: ['node_modules/bootstrap/dist/js/bootstrap.js'],
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
    src: ['node_modules/@fortawesome/fontawesome-free/webfonts/*'],
    dest: 'dist/fonts'
  },
  statics: {
    src: ['src/statics/*'],
    dest: 'dist'
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
    .pipe(replace('files/', '../fonts/'))
    .pipe(replace('../webfonts/', '../fonts/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS({level: 2}))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true})
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function images() {
  return gulp.src(paths.images.src, {removeBOM: false, allowEmpty: true})
    .pipe(gulp.dest(paths.images.dest));
}

export function fonts() {
  return gulp.src(paths.fonts.src, {removeBOM: false, allowEmpty: true})
  .pipe(gulp.dest(paths.fonts.dest));
}

export function icons() {
  return gulp.src(paths.icons.src, {removeBOM: false, allowEmpty: true})
  .pipe(gulp.dest(paths.icons.dest));
}

export function html() {
  return gulp.src(paths.html.src)
  .pipe(inject(gulp.src(['dist/**/*.css', 'dist/**/*.js'], {read: true, allowEmpty: true}), {ignorePath: 'dist/'}))
  .pipe(htmlmin({removeComments: true}))
  .pipe(gulp.dest(paths.html.dest));
}

export function files() {
  return gulp.src(paths.files.src, {removeBOM: false, allowEmpty: true})
  .pipe(gulp.dest(paths.files.dest));
}

export function statics() {
  return gulp.src(paths.statics.src, {removeBOM: false, allowEmpty: true})
  .pipe(gulp.dest(paths.statics.dest));
}

function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.icons.src, icons);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.statics.src, statics);
}
export { watchFiles as watch };

export const build = gulp.series(clean, scripts, styles, fonts, images, html, files, statics);

export default build;
