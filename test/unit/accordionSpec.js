( function() {
	'use strict';

	describe( 'vui-accordion', function() {

		var node, accordion, $accordion,
			header1, heading1, content1,
			header2, heading2, content2,
			header3, heading3, content3, toggle3, toggleIcon3;

		var expectExpanded = function( header, content ) {

			expect( header ).toHaveClassName( 'vui-accordion-panel-expanded' );
			expect( header.getAttribute( 'aria-expanded' ) ).toBe( 'true' );
			expect( content ).not.toHaveDisplay( 'none' );
			expect( content.getAttribute( 'aria-hidden' ) ).toBe( 'false' );

		};

		var expectCollapsed = function( header, content ) {
			expect( header ).not.toHaveClassName( 'vui-accordion-panel-expanded' );
			expect( header.getAttribute( 'aria-expanded' ) ).toBe( 'false' );
			expect( content ).toHaveDisplay( 'none' );
			expect( content.getAttribute( 'aria-hidden' ) ).toBe( 'true' );
		};

		var createKeyEvent = function( eventType, keyCode ) {
			var e = $.Event( eventType );
			e.keyCode = keyCode;
			return e;
		};

		beforeEach( function () {

			// turn off jquery fx since they will can introduce timing issues when making our expectations
			$.fx.off = true;

			jasmine.addMatchers( vui.jasmine.dom.matchers );

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
			header2.setAttribute( 'data-content-id', 'content2' );
			header2.setAttribute( 'data-expanded', 'true' );
			header2.setAttribute( 'data-content-labelledby', 'heading2' );

			heading2 = header2.appendChild( document.createElement( 'h2' ) );
			heading2.id = 'heading2';
			heading2.innerHTML = 'This is heading 2.';

			content2 = accordion.appendChild( document.createElement( 'div' ) );
			content2.id = 'content2';
			content2.className = 'vui-accordion-content';

			content2.appendChild( document.createElement( 'p' ) ).innerHTML = 'This is content 2.';

			header3 = accordion.appendChild( document.createElement( 'div' ) );
			header3.className = 'vui-accordion-header';
			header3.setAttribute( 'data-content-labelledby', 'heading3' );

			toggle3 = header3.appendChild( document.createElement( 'div' ) );
			toggle3.className = 'vui-accordion-toggle';

			toggleIcon3 = toggle3.appendChild( document.createElement( 'div' ) );
			toggleIcon3.className = 'vui-accordion-toggle-icon';

			heading3 = header3.appendChild( document.createElement( 'h2' ) );
			heading3.id = 'heading3';
			heading3.innerHTML = 'This is heading 3.';

			content3 = accordion.appendChild( document.createElement( 'div' ) );
			content3.className = 'vui-accordion-content';

			content3.appendChild( document.createElement( 'p' ) ).innerHTML = 'This is content 3.';

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

			beforeEach( function() {
				$accordion = $( accordion ).vui_accordion();
			} );

			it( 'binds the accordion elements using widget method', function() {
				expect( $accordion.data( 'vui-vui_accordion' ) ).toBeDefined();
			} );

			it( 'sets accordion to have tablist aria role', function() {
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
				$accordion = $( accordion ).vui_accordion();
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

		describe( 'any mode', function() {

			beforeEach( function () {
				$accordion = $( accordion ).vui_accordion();
			} );

			describe( 'expandPanel event', function() {

				it( 'is triggered with isFirstExpand (true) for heading1 when header is expanded for the first time', function( done ) {

					$accordion.on( 'expandPanel', function( e, args ) {
						if ( args.header.getAttribute( 'data-content-labelledby' ) !== 'heading1' ) {
							return;
						}
						expect( args.isFirstExpand ).toBeTruthy();
						done();
					} );

					$( header1 ).click();

				} );

				it( 'is triggered with isFirstExpand (false) for heading1 when header is expanded a second time', function( done ) {

					var expandCount = 0;

					$accordion.on( 'expandPanel', function( e, args ) {
						if ( args.header.getAttribute( 'data-content-labelledby' ) !== 'heading1' ) {
							return;
						}
						expandCount += 1;
						if ( expandCount === 2 ) {
							expect( args.isFirstExpand ).toBeFalsy();
							done();
						}
					} );

					$( header1 ).click(); // expand 1
					$( header1 ).click(); // collapse
					$( header1 ).click(); // expand 2

				} );

			} );

			describe( 'collapsePanel event', function() {

				it( 'is triggered for header2 when header1 is expanded', function( done ) {

					$accordion.on( 'collapsePanel', function( e, args ) {
						if ( args.header.getAttribute( 'data-content-labelledby' ) !== 'heading2' ) {
							return;
						}
						done();
					} );

					$( header1 ).click();

				} );

			} );

			describe( 'active header/panel', function() {

				it( 'right arrow key sets next header to be active', function() {

					header1.focus();

					$( header1 ).trigger( createKeyEvent( 'keyup', 39 ) );

					expect( header2 ).toHaveClassName( 'vui-accordion-header-active' );
					expect( header1 ).not.toHaveClassName( 'vui-accordion-header-active' );

				} );

				it( 'right arrow key sets first header to be active when last header is active', function() {

					header3.focus();

					$( header3 ).trigger( createKeyEvent( 'keyup', 39 ) );

					expect( header1 ).toHaveClassName( 'vui-accordion-header-active' );
					expect( header3 ).not.toHaveClassName( 'vui-accordion-header-active' );

				} );

				it( 'down arrow key sets next header to be active', function() {

					header1.focus();

					$( header1 ).trigger( createKeyEvent( 'keyup', 40 ) );

					expect( header2 ).toHaveClassName( 'vui-accordion-header-active' );
					expect( header1 ).not.toHaveClassName( 'vui-accordion-header-active' );

				} );

				it( 'left arrow key sets previous header to be active', function() {

					header2.focus();

					$( header2 ).trigger( createKeyEvent( 'keyup', 37 ) );

					expect( header1 ).toHaveClassName( 'vui-accordion-header-active' );
					expect( header2 ).not.toHaveClassName( 'vui-accordion-header-active' );

				} );

				it( 'left arrow key sets last header to be active when first header is active', function() {

					header1.focus();

					$( header1 ).trigger( createKeyEvent( 'keyup', 37 ) );

					expect( header3 ).toHaveClassName( 'vui-accordion-header-active' );
					expect( header1 ).not.toHaveClassName( 'vui-accordion-header-active' );

				} );

				it( 'up arrow key sets previous header to be active', function() {

					header2.focus();

					$( header2 ).trigger( createKeyEvent( 'keyup', 38 ) );

					expect( header1 ).toHaveClassName( 'vui-accordion-header-active' );
					expect( header2 ).not.toHaveClassName( 'vui-accordion-header-active' );

				} );

				it( 'end arrow key sets last header to be active', function() {

					header1.focus();

					$( header1 ).trigger( createKeyEvent( 'keyup', 35 ) );

					expect( header1 ).not.toHaveClassName( 'vui-accordion-header-active' );
					expect( header3 ).toHaveClassName( 'vui-accordion-header-active' );

				} );

				it( 'home arrow key sets last header to be active', function() {

					header3.focus();

					$( header3 ).trigger( createKeyEvent( 'keyup', 36 ) );

					expect( header1 ).toHaveClassName( 'vui-accordion-header-active' );
					expect( header3 ).not.toHaveClassName( 'vui-accordion-header-active' );

				} );

			} );

			describe( 'custom header', function() {

				it( 'has correct icon class when expanded/collapsed', function() {
					$( header3 ).click();
					expect( toggleIcon3 ).toHaveClassName( 'vui-icon-accordion-expanded' );
					expect( toggleIcon3 ).not.toHaveClassName( 'vui-icon-accordion-collapsed' );
					$( header3 ).click();
					expect( toggleIcon3 ).not.toHaveClassName( 'vui-icon-accordion-expanded' );
					expect( toggleIcon3 ).toHaveClassName( 'vui-icon-accordion-collapsed' );
				} );

			} );

		} );

		describe( 'accordion mode', function() {

			beforeEach( function () {
				$accordion = $( accordion ).vui_accordion();
			} );

			describe( 'create', function() {

				it( 'sets accordion to have aria-multiselectable to be false', function() {
					expect( accordion.getAttribute( 'aria-multiselectable' ) ).toBe( 'false' );
				} );

			} );

			describe( 'expand/collapse via click', function() {

				it( 'expands content1 when header1 is clicked', function() {
					$( header1 ).click();
					expectExpanded( header1, content1 );
				} );

				it( 'collapses content2 when header1 is clicked', function() {
					$( header1 ).click();
					expectCollapsed( header2, content2 );
				} );

				it( 'collapses content1 when header1 is clicked if already expanded', function() {
					$( header1 ).click();
					$( header1 ).click();
					expectCollapsed( header1, content1 );
				} );

			} );

			describe( 'expand/collapse via enter', function() {

				it( 'expands content1 when [enter] key is pressed while focus is on header1', function() {

					var e = createKeyEvent( 'keyup', 13 );

					header1.focus();

					$( header1 ).trigger( e );
					expectExpanded( header1, content1 );

					$( header1 ).trigger( e );
					expectCollapsed( header1, content1 );

				} );

			} );

			describe( 'expand/collapse via space', function() {

				it( 'expands content1 when [space] key is pressed while focus is on header1', function() {

					var e = createKeyEvent( 'keyup', 32 );

					header1.focus();

					$( header1 ).trigger( e );
					expectExpanded( header1, content1 );

					$( header1 ).trigger( e );
					expectCollapsed( header1, content1 );

				} );

			} );

		} );

		describe( 'stacked mode', function() {

			beforeEach( function () {
				accordion.setAttribute( 'data-display-mode', 'stacked' );
				$accordion = $( accordion ).vui_accordion();
			} );

			describe( 'create', function() {

				it( 'sets accordion to have aria-multiselectable to be false', function() {
					expect( accordion.getAttribute( 'aria-multiselectable' ) ).toBe( 'true' );
				} );

			} );

			describe( 'collapseAll', function() {

				it( 'collapses all expanded panels', function() {

					$( header1 ).click();

					expectExpanded( header1, content1 );
					expectExpanded( header2, content2 );

					$( accordion ).vui_accordion( 'collapseAll' );

					expectCollapsed( header1, content1 );
					expectCollapsed( header2, content2 );

				} );

			} );

			describe( 'expand/collapse via click', function() {

				it( 'leaves content2 expanded when header1 is clicked to expand content1', function() {

					$( header1 ).click();

					expectExpanded( header1, content1 );
					expectExpanded( header2, content2 );

				} );

			} );

		} );

		describe( 'disabled/empty content', function() {

			beforeEach( function () {
				content1.innerHTML = '';
				$accordion = $( accordion ).vui_accordion();
			} );

			it( 'is styled to be disabled', function() {
				expect( header1 ).toHaveClassName( 'vui-accordion-header-disabled' );
			} );

			it( 'does not expand when disabled (content element is empty)', function() {

				header1.focus();

				expectCollapsed( header1, content1 );

				$( header1 ).trigger( createKeyEvent( 'keyup', 13 ) );

				expectCollapsed( header1, content1 );

			} );

		} );

	} );

} )();
