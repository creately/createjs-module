import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import insert from 'gulp-insert';
import concat from 'gulp-concat';
import gdl from 'gulp-download';

const VERSIONS = {
    EASEL: '1.0.0',
    PRELOAD: '1.0.0',
    SOUNDL: '1.0.0',
    TWEEN: '1.0.0',
    CREATE: '1.0.0'
};

const SRC = {
    EASEL: `https://code.createjs.com/${VERSIONS.EASEL}/easeljs.js`,
    PRELOAD: `https://code.createjs.com/${VERSIONS.PRELOAD}/preloadjs.js`,
    SOUND: `https://code.createjs.com/${VERSIONS.SOUNDL}/soundjs.js`,
    TWEEN: `https://code.createjs.com/${VERSIONS.TWEEN}/tweenjs.js`
};

const DEST = {
    CREATE: './'
};

function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({ cwd: '', base: '', path: filename, contents: new Buffer(string) }));
        this.push(null)
    };
    return src
}

gulp.task('compile', () => {
    console.log( SRC.EASEL );
    return gdl([
        SRC.EASEL,
        SRC.PRELOAD,
        SRC.SOUND,
        SRC.TWEEN
    ])
        .pipe(concat('createjs.js'))
        .pipe(insert.prepend('var createjs = (this.createjs = (this.createjs || {}));\n'))
        .pipe(insert.append('\nif(typeof module !== "undefined" && typeof module.exports !== "undefined") module.exports = this.createjs;'))
        .pipe(gulp.dest(DEST.CREATE));
});

gulp.task('package', () => {
    let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    pkg.version = VERSIONS.CREATE;
    return string_src('package.json', JSON.stringify(pkg, null, 4))
        .pipe(gulp.dest(DEST.CREATE));
});

gulp.task('default', ['compile', 'package']);