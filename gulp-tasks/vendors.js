const { src, dest, task, parallel } = require('gulp')

const newer = require('gulp-newer')

const slick = () =>
    src('./node_modules/slick-carousel/slick/slick.min.js')
        .pipe(newer('./dist/catalog/view/theme/cw/vendors/slick'))
        .pipe(dest('./dist/catalog/view/theme/cw/vendors/slick'))
// slick stylesheet required in stylesheet/vendors/_slick.scss

const nouislider = () =>
    src([
        './node_modules/nouislider/distribute/nouislider.min.js',
        './node_modules/nouislider/distribute/nouislider.min.css'
    ])
        .pipe(newer('./dist/catalog/view/theme/cw/vendors/nouislider'))
        .pipe(dest('./dist/catalog/view/theme/cw/vendors/nouislider'))

const bootstrap = () =>
    src('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(newer('./dist/catalog/view/theme/cw/vendors/bootstrap'))
        .pipe(dest('./dist/catalog/view/theme/cw/vendors/bootstrap'))

// bootstrap stylesheet required in stylesheet/vendors/_bootstrap.scss

task('vendors', parallel(slick, nouislider, bootstrap))
