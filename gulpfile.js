"use strict";

// Load plugins
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    rename = require("gulp-rename"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    uglify = require("gulp-uglify"),
    imagemin = require("gulp-imagemin"),
    newer = require("gulp-newer"),
    plumber = require("gulp-plumber"),
    sourcemaps = require("gulp-sourcemaps"),
    render = require('gulp-nunjucks-render'),
    del = require("del"),
    browsersync = require("browser-sync").create();

// BrowserSync
function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./_site/"
        },
        port: 3000
    });
}

// BrowserSync Reaload
function browserSyncReload() {
    browsersync.reload();
}

// Clean dist
function clean() {
    return del(["./_site/assets"])
}

// Optimize Images
function images() {
    return gulp
      .src("./assets/images/**/*")
      .pipe(newer("./_site/assets/images"))
      .pipe(
        imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    {
                        removeViewBox: false,
                        collapseGroups: true
                    }
                ]
            })
        ])
    )
    .pipe(gulp.dest("./_site/assets/images"));
}

// Styles sass/scss
function styles() {
  return gulp
    .src('./assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(gulp.dest('./_site/assets/css/'))
    .pipe(rename({ suffix: ".min" }))
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./_site/assets/css/'))
    .pipe(browsersync.stream())
}

function scripts(){
    return gulp
        .src(["./assets/js/*.js"])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('./_site/assets/js/'))
        .pipe(browsersync.stream())
}

// Template engine nunjuks/njk
function nunjucks() {
    return gulp
        .src("./assets/pages/*.njk")
        .pipe(plumber())
        .pipe(render({
            path: ["./assets/templates"]
        }))
        .pipe(gulp.dest("./_site/"))
        .pipe(browsersync.stream())
}

// Watch files
function watchFiles() {
  gulp.watch("./assets/scss/**/*.scss", styles); // css
  gulp.watch("./assets/js/*.js", scripts); // js
  gulp.watch("./assets/pages/**/*.njk", nunjucks); // pages njk
  gulp.watch("./assets/templates/**/*.njk", nunjucks); // templates njk
  gulp.watch("./assets/images/**/*", images); // images
  gulp.watch("./_site/*.html").on('change', browserSyncReload); // html
}


// Define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, images))
const watch = gulp.parallel(watchFiles, browserSync)

// Export tasks
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.nunjucks = nunjucks;
exports.watch = watch;
exports.build = build;
exports.clean = clean;
exports.default = build;
