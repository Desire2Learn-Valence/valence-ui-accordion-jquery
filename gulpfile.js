var gulp = require( 'gulp' ),
	vui = require( 'vui-helpers' );

gulp.task( 'clean', function() {
	return gulp.src( [ 'accordion.css' ], { read: false } )
		.pipe( vui.clean() );
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

gulp.task( 'test', function () {
	return vui.test(
			'test/unit/karma.conf.js',
			'test/unit/**/*Spec.js',
			'accordion.css'
		);
} );
