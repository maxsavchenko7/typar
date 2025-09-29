import { src, dest, watch, series, parallel } from 'gulp';
import fileInclude from 'gulp-file-include';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import gulpBrowserSync from 'browser-sync';
import { deleteAsync } from 'del';
import rename from 'gulp-rename';
import gulpIf from 'gulp-if';
import concat from 'gulp-concat';

const isProduction = process.env.NODE_ENV === 'production';
const scss = gulpSass(sass);
const paths = {
    src: {
        html: './src/**/*.html',
        pages: './src/pages/*.html',
        scss: './src/assets/scss/**/*.scss',
        libsCss: './src/assets/scss/libs/*.css',
        js: './src/assets/js/*.js',
        libsJs: './src/assets/js/libs/*.js',
        img: './src/assets/img/**/*.{jpg,png,gif,svg,webp,avif}',
        fonts: './src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    },
    dist: {
        html: './dist/',
        css: './dist/assets/css/',
        libsCss: './dist/assets/css/libs/',
        js: './dist/assets/js/',
        libsJs: './dist/assets/js/libs/',
        img: './dist/assets/img/',
        fonts: './dist/assets/fonts/'
    }
};

export function html() {
    return src(paths.src.pages)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest(paths.dist.html))
        .pipe(gulpBrowserSync.stream());
}

export function styles() {
    return src(paths.src.scss)
        .pipe(gulpIf(!isProduction, sourcemaps.init()))
        .pipe(scss.sync({
            silenceDeprecations: ['legacy-js-api']
        }))
        .pipe(gulpIf(isProduction, autoprefixer()))
        .pipe(gulpIf(isProduction, dest(paths.dist.css)))
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(scss.sync({ style: 'compressed' }))
        .pipe(gulpIf(!isProduction, sourcemaps.write()))
        .pipe(dest(paths.dist.css))
        .pipe(gulpBrowserSync.stream());
}

export function libsCss() {
    return src(paths.src.libsCss)
        .pipe(dest(paths.dist.libsCss))
        .pipe(gulpBrowserSync.stream());
}

export function scripts() {
    return src(paths.src.js)
        .pipe(concat('bundle.js'))
        .pipe(dest(paths.dist.js))
        .pipe(gulpBrowserSync.stream());
}

export function libsJs() {
    return src(paths.src.libsJs)
        .pipe(dest(paths.dist.libsJs))
        .pipe(gulpBrowserSync.stream());
}

export function img() {
    return src(paths.src.img, { encoding: false })
        .pipe(dest(paths.dist.img))
        .pipe(gulpBrowserSync.stream());
}

export function fonts() {
    return src(paths.src.fonts)
        .pipe(dest(paths.dist.fonts));
}

export function watchFiles() {
    watch([paths.src.html], html);
    watch([paths.src.scss], styles);
    watch([paths.src.libsCss], libsCss);
    watch([paths.src.js], scripts);
    watch([paths.src.libsJs], libsJs);
    watch([paths.src.img], img);
    watch([paths.src.fonts], fonts);
    watch(['favicon.svg'], favicon);
}

export function clean() {
    return deleteAsync(['dist']);
}

export function browserSync() {
    gulpBrowserSync.init({
        server: {
            baseDir: 'dist/'
        }
    });
}

export function favicon() {
    return !isProduction ? src('favicon.svg')
        .pipe(dest(paths.dist.html))
        .pipe(gulpBrowserSync.stream()) : Promise.resolve();
}

const build = series(clean, parallel(html, favicon, styles, libsCss, scripts, libsJs, img, fonts));
const dev = series(build, parallel(watchFiles, browserSync));

export { dev as default, build };