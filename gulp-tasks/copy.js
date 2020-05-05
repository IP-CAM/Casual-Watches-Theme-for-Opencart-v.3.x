const { src, dest, task } = require('gulp')

const debug = require('gulp-debug')
const newer = require('gulp-newer')

const copy = () =>
    src(
        [
            './src/**/*',
            '!./src/catalog/view/theme/cw/stylesheet/**',
            '!./src/catalog/view/theme/cw/image/svg-symbols/**',
            '!./src/catalog/view/theme/cw/javascript/**'
        ],
        { base: './src' }
    )
        .pipe(newer('./dist'))
        .pipe(debug({ title: 'copying:' }))
        .pipe(dest('./dist'))

task('copy', copy)
