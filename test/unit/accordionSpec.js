( function() {
	'use strict';

	describe( 'vui', function() {

		var node;

		beforeEach( function () {
			jasmine.addMatchers( d2l.jasmine.matchers );
			node = document.body.appendChild( document.createElement( 'div' ) );
			node.className = 'vui-accordion';
		} );

		afterEach( function() {
			document.body.removeChild( node );
		} );

		describe( 'accordion', function() {

			var accordion, header1, heading1, content1;

			beforeEach( function () {

				accordion = node.appendChild( document.createElement( 'div' ) );
				accordion.className = 'vui-accordion';
				accordion.setAttribute( 'data-display-mode', 'accordion' );

				header1 = accordion.appendChild( document.createElement( 'div' ) );
				header1.className = 'vui-accordion-header';
				header1.setAttribute( 'data-content-labelledby', 'heading1' );

				heading1 = header1.appendChild( document.createElement( 'h2' ) );
				heading1.id = 'heading1';
				heading1.innerHTML = 'This is heading 1.';

				content1 = accordion.appendChild( document.createElement( 'div' ) );
				content1.className = 'vui-accordion-content';

				content1.appendChild( document.createElement( 'p' ) ).innerHTML = 'This is content 1.';

			} );

			it( 'defines a "vui-accordion" selector', function() {
				expect( document ).toHaveCssSelector( '.vui-accordion' );
			} );

			it( 'initializes accordion using widget method', function() {

				$( accordion ).vui_accordion();

				expect( accordion.getAttribute( 'role' ) ).toBe( 'tablist' );

			} );

		} );

	} );

} )();
