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
            baseDir: "./public/"
        },
        port: 3000
    });
}

// BrowserSync Reload
function browserSyncReload() {
    browsersync.reload();
}

// Clean public
function clean() {
    return del(["./public"])
}

// Optimize Images
function images() {
    return gulp
      .src("./resources/images/**/*")
      .pipe(newer("./public/images"))
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
    .pipe(gulp.dest("./public/images"));
}

// Styles sass/scss
function styles() {
  return gulp
    .src('./resources/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(gulp.dest('./public/css/'))
    .pipe(rename({ suffix: ".min" }))
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css/'))
    .pipe(browsersync.stream())
}

// Scripts js
function scripts(){
    return gulp
        .src(["./resources/js/*.js"])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'))
        .pipe(browsersync.stream())
}

// Template engine nunjuks/njk
function nunjucks() {
    return gulp
        .src("./resources/pages/*.njk")
        .pipe(plumber())
        .pipe(render({
            path: ["./resources/templates"]
        }))
        .pipe(gulp.dest("./public/"))
        .pipe(browsersync.stream())
}

function js() {
    return gulp
        .src([
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/popper.js/dist/umd/popper.min.js',
            './node_modules/wow.js/dist/wow.min.js',
        ])
        .pipe(gulp.dest('./public/js/'))
}

function css() {
    return gulp
        .src([
            './node_modules/animate.css/animate.min.css',
        ])
        .pipe(gulp.dest('./public/css/'))
}

// Watch files
function watchFiles() {
  gulp.watch("./resources/scss/**/*.scss", styles); // css
  gulp.watch("./resources/js/*.js", scripts); // js
  gulp.watch("./resources/pages/**/*.njk", nunjucks); // pages njk
  gulp.watch("./resources/templates/**/*.njk", nunjucks); // templates njk
  gulp.watch("./resources/images/**/*", images); // images
  gulp.watch("./public/*.html").on('change', browserSyncReload); // html
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(css, js, nunjucks, styles, scripts, images))
const watch = gulp.parallel(watchFiles, browserSync)

// Export tasks
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.nunjucks = nunjucks;
exports.watch = watch;
exports.build = build;
exports.clean = clean;

// Export default
exports.default = build;