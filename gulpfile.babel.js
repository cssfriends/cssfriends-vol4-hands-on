'use strict'

import gulp from 'gulp'
import watch from 'gulp-watch'
import browserSync from 'browser-sync'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import plumber from 'gulp-plumber'

const log = console['log']
const baseConfig = {
  sourceDir: './src/',
  publishDir: './dist/'
}

const config = {
  tasks: {
    browserSync: {
      port: 8080,
      notify: false,
      server: {
        baseDir: baseConfig.publishDir
      },
      files: [
        `${baseConfig.publishDir}*.html`,
        `${baseConfig.publishDir}**/*.html`,
        `${baseConfig.publishDir}*.css`
      ]
    },
    html: {
      src: [
        `${baseConfig.sourceDir}html/!(_)*.html`,
        `${baseConfig.sourceDir}html/**/!(_)*.html`
      ],
      watch: [
        `${baseConfig.sourceDir}html/**/*.html`
      ]
    },
    css: {
      src: [
        `${baseConfig.sourceDir}scss/!(_)*.scss`,
        `${baseConfig.sourceDir}scss/**/!(_)*.scss`
      ],
      watch: [
        `${baseConfig.sourceDir}scss/**/*.scss`
      ]
    }
  }
}

gulp.task('browser-sync', () => {
  browserSync.init(config.tasks.browserSync)
})

gulp.task('html', () => {
  gulp.src(config.tasks.html.src)
    .pipe(plumber({
      handleError: function (err) {
        log(err)
        this.emit('end')
      }
    }))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('html:watch', () => {
  return watch(config.tasks.html.watch, () => {
    return gulp.start(['html'])
  })
})

gulp.task('scss', () => {
  gulp.src(config.tasks.css.src)
    .pipe(plumber({
      handleError: function (err) {
        log(err)
        this.emit('end')
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/'))
})

gulp.task('scss:watch', () => {
  return watch(config.tasks.css.watch, () => {
    return gulp.start(['scss'])
  })
})

gulp.task('watch', ['html:watch', 'scss:watch'])

gulp.task('default', ['browser-sync', 'watch'])
