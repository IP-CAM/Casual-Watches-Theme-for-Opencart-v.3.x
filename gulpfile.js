const { parallel, registry, watch, series } = require('gulp')

const HubRegistry = require('gulp-hub')
const hub = new HubRegistry(['gulp-tasks/*.js'])
registry(hub)

const serve = () => {
    watch(
        ['./src/catalog/view/theme/cw/stylesheet/**/*.scss'],
        series('styles')
    )
    watch(
        [
            './src/**/*',
            '!./src/catalog/view/theme/cw/stylesheet',
            '!./src/catalog/view/theme/cw/svg-symbols/',
            '!./src/catalog/view/theme/cw/javascript'
        ],
        series('copy')
    )
    watch(
        './src/catalog/view/theme/cw/image/svg-symbols/**/*.svg',
        series('svgSymbols')
    )
    watch(
        ['./src/catalog/view/theme/cw/javascript/**/*.js'],
        series('javascript')
    )
}

exports.default = serve
exports.build = parallel(
    'styles',
    'copy',
    'svgSymbols',
    'javascript',
    'vendors'
)
