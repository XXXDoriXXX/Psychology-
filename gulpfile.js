const { src, dest, watch, series, parallel } = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const { deleteAsync } = require('del');

// HTML
function html() {
    return src('src/html/*.html')
        .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

function styles() {
    return src('src/styles/main.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()])) // ✅ ось тут
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('src/scripts/*.js') // ⬅️ правильний JS шлях
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

function images() {
    return src('src/images/**/*',{ encoding: false })
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream());
}

// BrowserSync
function serve() {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
        notify: false
    });

    watch('src/html/**/*.html', html);
    watch('src/styles/**/*.scss', styles);
    watch('src/js/**/*.js', scripts);
    watch('src/images/**/*', images);

}


function clean() {
    return deleteAsync(['dist']);
}
exports.default = series(clean, parallel(html, styles, scripts, images), serve);
exports.build = series(clean, parallel(html, styles, scripts, images));