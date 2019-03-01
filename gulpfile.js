// ## pluggins
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps");
    render = require('gulp-nunjucks-render');
    browserSync = require("browser-sync").create();

// ## define paths sources & destine
var paths = {
  styles: {
      src: 'src/scss/**/*.scss',
      dest: 'src/css'
  }
  ,html: {
   src: 'src/*.html',
   dest: 'dist/'
  }
  ,nunjucks: {
   pages: 'src/pages/**/*.njk',
   templates: 'src/templates',
   dest: 'src'
  }
  ,css: {
    src: 'src/css/*.css',
    dest: 'dist/css'
  }
  ,scripts: {
    src: 'src/js/*.js',
    dest: 'dist/js'
  }  
  ,images: {
    src: 'src/images/.*jpg|gif|png',
    dest: 'dist/images'
  }
};

// ## styles scss/sass
function style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// ## reaload
function reload() {
  browserSync.reload();
}

function nunjucks() {
  return gulp
    .src(paths.nunjucks.pages)
    .pipe(render({
      path: [paths.nunjucks.templates]
    }))
    .pipe(gulp.dest(paths.nunjucks.dest))
    .pipe(browserSync.stream());
}

// ## watch 
function watch(){
  
  browserSync.init({
    server: {
      baseDir: './src/'
    }
  })

  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.nunjucks.pages, nunjucks);
  gulp.watch(paths.nunjucks.templates, nunjucks);
  gulp.watch(paths.html.src).on('change', reload);

}

function build() {
  return gulp
    .src(paths.css.src)
    .pipe(gulp.dest(paths.css.dest))
}

exports.watch = watch
exports.build = build

exports.nunjucks = nunjucks