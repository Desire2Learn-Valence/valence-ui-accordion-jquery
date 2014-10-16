var bower = require('gulp-bower'),
	del = require('del'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	vui = require('vui-helpers');

gulp.task( 'clean', function( cb ) {
	del( [ 'accordion.css' ], cb );
} );

gulp.task( 'lib', function() {
	return bower('lib/');
} );

gulp.task( 'css', function () {
	return vui.makeCss(
		'accordion.css.less',
		'accordion.css',
		{ 'lintOpts' : '.csslintrc' }
	);
} );

gulp.task( 'jshint', function() {
	return gulp.src( ['gulpfile.js', 'accordion.js', 'test/unit/*.js'] )
		.pipe( jshint() )
		.pipe( jshint.reporter('default') );
} );

gulp.task( 'test', [ 'lib' ], function () {
	return vui.test( {
		files: [
			'lib/jquery/jquery.min.js',
			'lib/jquery.ui/ui/jquery.ui.core.js',
			'lib//jquery.ui/ui/jquery.ui.widget.js',
			'accordion.js',
			'test/unit/**/*Spec.js',
			'accordion.css'
		],
		preprocessors: {
			'accordion.js': ['coverage']
		}
	} ) ;
} );

gulp.task( 'default', [ 'clean' ], function() {
	gulp.start( 'css', 'jshint' );
} );
