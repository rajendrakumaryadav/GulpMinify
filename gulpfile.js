var gulp = require("gulp"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    server = require('gulp-connect'),
    browserify = require("gulp-browserify"),
    gulpif = require("gulp-if"),
    uglify = require("gulp-uglify");

var paths = {
    sass: {
        src: ['components/scss/*.scss', 'components/scss/partials/*.scss'],
        desc: 'development/components/css/'
    },
    js: {
        src: './components/js/*.js',
        desc: './development/components/js/'
    }
}

env = process.env.NODE_ENV || 'development';

const sassTrans = () => {
    return gulp.src(paths.sass.src)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe(concat("style.css"))
    .pipe(gulp.dest("./components/css/"))
}

const cssConcat = () => {
    return gulp.src("./components/css/*.css")
           .pipe(concat("style.css"))
           .pipe(gulp.dest(paths.sass.desc))
           .pipe(server.reload())
}

const js = () => {
    return gulp.src(paths.js.src)
    .pipe(browserify())
    .on('error', function(err){
        // print the error (can replace with gulp-util)
        console.log(err.message);
        // end this stream
        this.emit('end');
      })
    .pipe(concat("script.js"))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(paths.js.desc))
    .pipe(server.reload())
}

const htmlChanges = () => {
    return gulp.src("./development/*.html")
    .pipe(server.reload());
}

const runserver = () => {
      server.server({
        root: './development',
        livereload: true
      });
}
const watch = () => {
    gulp.watch(paths.js.src, js);
    gulp.watch(['./components/scss/*.scss','./components/scss/partials/*.scss'], sassTrans);
    gulp.watch("./components/css/*.css", cssConcat);
    gulp.watch("./development/*.html", htmlChanges);
  }

exports.sassTrans = sassTrans;
exports.cssConcat = cssConcat;
exports.js = js;
exports.htmlChanges = htmlChanges;
exports.watch = watch;
exports.runserver = runserver;


var build = gulp.series(gulp.parallel(sassTrans, cssConcat, js, htmlChanges, runserver, watch));
gulp.task('build', build);
gulp.task('default', build);
