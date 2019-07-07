var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var raname =  require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var del = require("del");

gulp.task("clean", function(){
	return del("build");
});

gulp.task("copy", function() {
	return gulp.src([
	  "source/img/**",
	  "source/js/**",
	  "source/*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
   return gulp.src("source/less/style.less")
   .pipe(plumber())
   .pipe(sourcemap.init())
   .pipe(less())
   .pipe(postcss([ autoprefixer() ]))
   .pipe(gulp.dest("source/css"));
   .pipe(csso())
   .pire(rename("style.min.css"))
   .pipe(sourcemap.write("."))
   .pipe(gulp.dest("build/css"));
});

gulp.task("images", function() {
	return gulp.src("source/img/**/*.{png, jpg, svg}")
	.pipe(imagemin([
	  imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
	]))

	.pipe(gulp.dest("source/img"));
})

galp.task("webp", function(){
	return gulp.src("source/img/**/*.{png, jpg}")
	.pipe(webp({quality: 90}))
	.pipe(gulp.dest("source/img"));
});


gulp.task("server", function() {
	server.init({
		server: "build/"
	})

	gulp.watsh("source/less/**/*/.less", gulp.series("css"));
	gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
})
gulp.task("build", gulp.series("css", "sprite", "html"));
gulp.task("start", gulp.series("build", "server"));



