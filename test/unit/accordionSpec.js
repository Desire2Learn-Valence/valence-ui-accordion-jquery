( function() {
	'use strict';

	describe( 'vui', function() {

		var node, heading;

		beforeEach( function () {
			jasmine.addMatchers( d2l.jasmine.matchers );
			node = document.body.appendChild( document.createElement( 'div' ) );
			node.className = 'vui-accordion';
		} );

		afterEach( function() {
			document.body.removeChild( node );
		} );

		describe( 'accordion', function() { 

			it( 'defines a "vui-accordion" selector', function() {
				expect( true ).toBeTruthy();
			} );

		} );

	} );

} )();