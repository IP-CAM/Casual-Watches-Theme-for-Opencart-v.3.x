const { src, dest, task } = require('gulp')

const svgSprite = require('gulp-svg-sprites')
const svgmin = require('gulp-svgmin')

const config = {
    mode: 'symbols',
    selector: 'icon-%f',
    svg: {
        symbols: 'svg-symbols.svg'
    },
    preview: false
}

const svgSymbols = () =>
    src('./src/catalog/view/theme/cw/image/svg-symbols/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(
            svgmin({
                plugins: [
                    { cleanupIDs: false },
                    { removeViewBox: false },
                    {
                        removeAttrs: {
                            attrs: ['fill', 'stroke', 'stroke-width']
                        }
                    }
                ]
            })
        )
        .pipe(dest('./dist/catalog/view/theme/cw/image'))

task('svgSymbols', svgSymbols)
