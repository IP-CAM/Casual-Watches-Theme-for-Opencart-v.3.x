const {src, dest, parallel, watch} = require('gulp')
const debug = require('gulp-debug')
const rename = require('gulp-rename')
const newer = require('gulp-newer')

const stylesheet = () => {
    const sass = require('gulp-sass')
    const autoprefixer = require('gulp-autoprefixer')

    return src('./src/catalog/view/theme/cw/stylesheet/stylesheet.scss', { base: './src' })
        .pipe(sass().on('error', err => {
            console.error(err.message)
        }))
        .pipe(autoprefixer())
        .pipe(debug({ title: 'sass:' }))
        .pipe(dest('./opencart'))
}

const copy = () => src(['./src/**/*', '!./src/catalog/view/theme/cw/stylesheet/**/*'], { base: './src' })
    .pipe(newer('./opencart'))
    .pipe(debug({ title: 'copying:' }))
    .pipe(dest('./opencart'))

const sprites = () => {
    const svgSprite = require('gulp-svgstore')
    const cheerio = require('gulp-cheerio')

    return src('./src/catalog/view/theme/cw/image/sprites/**/*.svg')
        .pipe(cheerio({
            run: function ($) {
				$('[style]').removeAttr('style')
			},
			parserOptions: { xmlMode: true },
        }))
        .pipe(svgSprite({ inlineSvg: true }))
        .pipe(rename({
            dirname: 'catalog/view/theme/cw/image',
            basename: 'sprites',
            extname: '.svg'
        }))
        .pipe(dest('./opencart'))
}

const javascript = () => {
    const babel = require('gulp-babel')

    return src('./src/catalog/view/theme/cw/javascript/**/*.js', { base: './src' })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('./opencart'))
}

const vendors = () => src([
        './node_modules/swiper/js/swiper.min.js',
        './node_modules/swiper/css/swiper.min.css',
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    ],
    { base: 'node_modules' })
    .pipe(newer('./opencart/catalog/view/theme/cw/vendors'))
    .pipe(dest('./opencart/catalog/view/theme/cw/vendors'))

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

exports.default = serve
exports.build = parallel(stylesheet, copy, sprites, javascript, vendors)
