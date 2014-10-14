var gulp = require( 'gulp' ),
	bower = require( 'gulp-bower' ),
	del = require( 'del' ),
	vui = require( 'vui-helpers' );

gulp.task( 'clean', function( cb ) {
	del([ 'accordion.css' ], cb);
} );

gulp.task( 'lib', function() {
	return bower( 'lib/' );
} );

gulp.task( 'css', function () {
	return vui.makeCss(
		'accordion.css.less',
		'accordion.css',
		{ 'lintOpts' : '.csslintrc' }
	);
} );

gulp.task( 'default', [ 'clean' ], function() {
	gulp.start( 'css' );
} );

gulp.task( 'test', [ 'lib' ], function () {
	return vui.test(
			'test/unit/karma.conf.js',
			[
				'lib/jquery/jquery.min.js',
				'lib/jquery.ui/ui/jquery.ui.core.js',
				'lib//jquery.ui/ui/jquery.ui.widget.js',
				'test/unit/**/*Spec.js'
			],
			'accordion.css'
		);
} );