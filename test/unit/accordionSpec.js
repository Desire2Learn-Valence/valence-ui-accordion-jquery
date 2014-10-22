( function() {
	'use strict';

	describe( 'vui-accordion', function() {

		var node, accordion, $accordion,
			header1, heading1, content1,
			header2, heading2, content2,
			header3, heading3, content3, toggle3;

		beforeEach( function () {

			jasmine.addMatchers( d2l.jasmine.matchers );

			node = document.body.appendChild( document.createElement( 'div' ) );
			node.className = 'vui-accordion';

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

			header2 = accordion.appendChild( document.createElement( 'div' ) );
			header2.className = 'vui-accordion-header';
			header2.setAttribute( 'data-expanded', 'true' );
			header2.setAttribute( 'data-content-labelledby', 'heading2' );

			heading2 = header2.appendChild( document.createElement( 'h2' ) );
			heading2.id = 'heading2';
			heading2.innerHTML = 'This is heading 2.';

			content2 = accordion.appendChild( document.createElement( 'div' ) );
			content2.className = 'vui-accordion-content';

			content2.appendChild( document.createElement( 'p' ) ).innerHTML = 'This is content 2.';

			header3 = accordion.appendChild( document.createElement( 'div' ) );
			header3.className = 'vui-accordion-header';
			header3.setAttribute( 'data-content-labelledby', 'heading3' );

			toggle3 = header3.appendChild( document.createElement( 'div' ) );
			toggle3.className = 'vui-accordion-toggle';

			heading3 = header3.appendChild( document.createElement( 'h2' ) );
			heading3.id = 'heading3';
			heading3.innerHTML = 'This is heading 3.';

			content3 = accordion.appendChild( document.createElement( 'div' ) );
			content3.className = 'vui-accordion-content';

			content3.appendChild( document.createElement( 'p' ) ).innerHTML = 'This is content 3.';

			$accordion = $( accordion ).vui_accordion();

		} );

		afterEach( function() {
			document.body.removeChild( node );
		} );

		describe( 'styling', function() {

			it( 'defines a "vui-accordion" selector', function() {
				expect( document ).toHaveCssSelector( '.vui-accordion' );
			} );

		} );

		describe( 'create', function() {

			it( 'binds the accordion elements using widget method', function() {
				expect( $accordion.data( 'vui-vui_accordion' ) ).toBeDefined();
			} );

			it( 'sets aria attributes', function() {
				expect( accordion.getAttribute( 'role' ) ).toBe( 'tablist' );
			} );

			it( 'sets accordion header element to have tab aria role', function() {
				expect( header1.getAttribute( 'role' ) ).toBe( 'tab' );
			} );

			it( 'sets accordion content element to have tabpanel aria role', function() {
				expect( content1.getAttribute( 'role' ) ).toBe( 'tabpanel' );
			} );

			it( 'sets header to not be expanded by default', function() {
				expect( header1.getAttribute( 'aria-expanded' ) ).toBe( 'false' );
			} );

			it( 'sets header to be initially expanded', function() {
				expect( header2.getAttribute( 'aria-expanded' ) ).toBe( 'true' );
			} );

			it( 'sets header to control its respective content', function() {
				expect( header1.getAttribute( 'aria-controls' ) ).toBe( content1.id );
			} );

			it( 'sets content to be labelled by its respective heading', function() {
				expect( content1.getAttribute( 'aria-labelledby' ) )
					.toBe( header1.getAttribute( 'data-content-labelledby' ) );
			} );

			it( 'sets tab-index to 0 for the first header', function() {
				expect( header1.getAttribute( 'tabindex' ) ).toBe( '0' );
			} );

			it( 'sets tab-index to -1 for headers other than the first header', function() {
				expect( header2.getAttribute( 'tabindex' ) ).toBe( '-1' );
			} );

		} );

		describe( 'destroy', function() {

			beforeEach( function () {
				$accordion.vui_accordion( 'destroy' );
			} );

			it( 'unbinds the accordion elements using widget destroy method', function() {
				expect( $accordion.data( 'vui-vui_accordion' ) ).toBeUndefined();
			} );

			it( 'removes aria attributes', function() {
				expect( accordion.getAttribute( 'role' ) ).toBeNull();
				expect( header1.getAttribute( 'aria-expanded' ) ).toBeNull();
				expect( header1.getAttribute( 'aria-controls' ) ).toBeNull();
				expect( content1.getAttribute( 'aria-labelledby' ) ).toBeNull();
			} );

			it( 'removes tab-index from headers', function() {
				expect( header1.getAttribute( 'tabindex' ) ).toBeNull();
				expect( header2.getAttribute( 'tabindex' ) ).toBeNull();
			} );

		} );

	} );

} )();
