const {src, dest, parallel, watch} = require('gulp')
const debug = require('gulp-debug')
const rename = require('gulp-rename')
const newer = require('gulp-newer')
//Sass
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
//Svg
const svgStore = require('gulp-svgstore')
const cheerio = require('gulp-cheerio')
//JS
const babel = require('gulp-babel')
//Deploy
const gutil = require('gulp-util')
const ftp = require('vinyl-ftp')

const stylesheet = () =>
    src('./src/catalog/view/theme/cw/stylesheet/stylesheet.scss', { base: './src' })
        .pipe(sass().on('error', err => {
            console.error(err.message)
        }))
        .pipe(autoprefixer())
        .pipe(debug({ title: 'sass:' }))
        .pipe(dest('./dist'))

const copy = () =>
    src([
        './src/**/*',
        '!./src/catalog/view/theme/cw/stylesheet/**/*',
        '!./src/catalog/view/theme/cw/image/sprites',
    ], { base: './src' })
        .pipe(newer('./dist'))
        .pipe(debug({ title: 'copying:' }))
        .pipe(dest('./dist'))

const sprites = () =>
    src('./src/catalog/view/theme/cw/image/sprites/**/*.svg')
        .pipe(cheerio({
            run: function($) {
                $('[style]').removeAttr('style')
            },
            parserOptions: { xmlMode: true },
        }))
        .pipe(rename(path => {
            path.basename = 'icon-' + path.basename.replace('_', '-')
        }))
        .pipe(svgStore())
        .pipe(rename({
            dirname: 'catalog/view/theme/cw/image',
            basename: 'sprites',
            extname: '.svg'
        }))
        .pipe(dest('./dist'))

const javascript = () =>
    src('./src/catalog/view/theme/cw/javascript/**/*.js', { base: './src' })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('./dist'))

const vendors = () =>
    src([
        './node_modules/slick-carousel/slick/slick.min.js',
    ], { base: 'node_modules' })
        .pipe(newer('./dist/catalog/view/theme/cw/vendors'))
        .pipe(dest('./dist/catalog/view/theme/cw/vendors'))

const serve = () => {
    watch('./src/catalog/view/theme/cw/stylesheet/**/*.scss', stylesheet)
    watch([
        './src/**/*',
        '!./src/catalog/view/theme/cw/stylesheet/*',
        '!./src/catalog/view/theme/cw/sprites/*',
    ], copy)
    watch('./src/catalog/view/theme/cw/image/sprites/**/*.svg', sprites)
    watch('./src/catalog/view/theme/cw/javascript/**/*.js', javascript)
}

const deploy = () => {
    const connection = ftp.create({
        host: '10.11.0.197',
        port: 21,
        user: 'sysftp',
        password: '!!qaz2wsx',
        parallel: 10,
        maxConnections: 5,
        log: gutil.log
    })

    return src([
            './dist/**',
            '!./dist/config.php',
            '!./dist/admin/config.php',
        ], { buffer: false })
            .pipe(connection.dest('/html'))
}

exports.default = serve
exports.build = parallel(stylesheet, copy, sprites, javascript, vendors)
exports.deploy = deploy
