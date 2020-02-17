const { src, dest, task } = require('gulp')

const favicons = require('gulp-favicons')

task('favicon', () => src('./src/static/images/favicon.png')
  .pipe(favicons({
    icons: {
      appleIcon: true,
      favicons: true,
      online: false,
      appleStartup: false,
      android: false,
      firefox: false,
      yandex: false,
      windows: false,
      coast: false
    }
  }))
  .pipe(dest('./build/static/images/favicon'))
)
