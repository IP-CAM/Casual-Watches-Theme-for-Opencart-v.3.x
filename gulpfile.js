const {src, dest, parallel} = require('gulp')

const stylesheet = () => {
    const sass = require('gulp-sass')
    const autoprefixer = require('gulp-autoprefixer')

    return src('./src/catalog/view/theme/cw/stylesheet/stylesheet.scss', { base: './src' })
        .pipe(sass().on('error', err => {
            log.error(err.message)
        }))
        .pipe(autoprefixer())
        .pipe(dest('./opencart'))
}

const copy = () => src(['./src/**/*', '!./src/catalog/view/theme/cw/stylesheet/**/*.scss'], { base: './src' })
    .pipe(dest('./opencart'))

exports.default = parallel(stylesheet, copy)
