const { src, dest, task } = require('gulp')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const gulpif = require('gulp-if')
const debug = require('gulp-debug')
const sourcemaps = require('gulp-sourcemaps')

const NODE_ENV = process.env.NODE_ENV

const styles = () =>
    src('./src/catalog/view/theme/cw/stylesheet/stylesheet.scss', {
        base: './src'
    })
        .pipe(gulpif(NODE_ENV === 'development', sourcemaps.init()))
        .pipe(
            gulpif(
                NODE_ENV === 'production',
                sass({
                    outputStyle: 'compressed'
                }),
                sass().on('error', sass.logError)
            )
        )
        .pipe(gulpif(NODE_ENV === 'development', sourcemaps.write('.')))
        .pipe(gulpif(NODE_ENV === 'production', autoprefixer()))
        .pipe(debug({ title: 'sass:' }))
        .pipe(dest('./dist'))

task('styles', styles)
