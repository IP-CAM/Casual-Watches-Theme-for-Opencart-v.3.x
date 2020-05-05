const { src, dest, task } = require('gulp')

const gulpif = require('gulp-if')
const babel = require('gulp-babel')

const javascript = () =>
    src('./src/catalog/view/theme/cw/javascript/**/*.js', { base: './src' })
        .pipe(gulpif(process.env.NODE_ENV === 'production', babel()))
        .pipe(dest('./dist'))

task('javascript', javascript)
