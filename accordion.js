$( function() { 
	$.widget( "d2l.accordion", { 

		options: {},

		_create: function() {

			var me = this;

			var $accordion = $( this.element );

			$accordion
				.attr( 'role', 'tablist' )
				.attr( 
					'aria-multiselectable', 
					this._getDisplayMode( $accordion ) !== 'accordion' 
				);

			$.each( 
				$accordion.find( '.d2l-accordion-header' ),
				function( index, headerNode ) {
					me._initializePanel( 
						$accordion, 
						$( headerNode ), 
						( index === 0 ) 
					);
				}
			);

		},

		collapseAll: function() {

			var me = this;

			$.each( 
				$( this.element ).find( '.d2l-accordion-header' ),
				function( index, headerNode ) {
					me._collapsePanel( $( headerNode ) );
				}
			);

		},

		_collapsePanel: function( $header ) {

			if ( !$header.hasClass( 'd2l-accordion-panel-expanded' ) ) {
				return;
			}

			$( this.element ).trigger(
				'collapsePanel', {
					header: $header.get(0)
				}
			);

			$header.attr( 'aria-expanded', 'false' )
				.removeClass( 'd2l-accordion-panel-expanded' );

			var contentId = $header.attr( 'data-content-id' );

			var contentNode = document.getElementById( contentId );
			if ( contentNode === null ) {
				return;
			}

			$( contentNode )
				.attr( 'aria-hidden', 'true' )
				.animate( {
					height: [ 'hide', 'swing' ]
				}, 250 );

		},

		_expandPanel: function( $header ) {

			var $accordion = $( this.element );

			if ( this._getDisplayMode( $accordion ) === 'accordion' ) {
				$accordion.accordion( 'collapseAll' );
			}

			$accordion.trigger( 
				'expandPanel', { 
					header: $header.get( 0 ),
					isFirstExpand: !$header.data( 'hasExpanded' )
				} 
			);

			$header.attr( 'aria-expanded', 'true' )
				.addClass( 'd2l-accordion-panel-expanded' );

			var contentId = $header.attr( 'data-content-id' );

			var contentNode = document.getElementById( contentId );
			if ( contentNode === null ) {
				return;
			}

			$( contentNode )
				.attr( 'aria-hidden', 'false' )
				.animate( {
					height: [ 'show', 'swing' ]
				}, 250 );

		},

		_getDisplayMode: function( $node ) {
			return $node.attr( 'data-display-mode' );
		},

		_initializePanel: function( $accordion, $header, isFocusable ) {

			var me = this;

			var $content = me._tryGetContent( $header );
			if ( $content === null ) {
				return;
			}

			var contentId = $header.attr( 'data-content-id' );
			var contentNode = $content.get( 0 );

			var isExpanded = ( $header.attr( 'data-expanded' ) === 'true' );
			var labelledById = $header.attr( 'data-content-labelledby' );
			
			var $headerContent = $header.find( '.d2l-accordion-header-content:first-child' );
			var isHeaderInteractive = ( $headerContent.length !== 0 );

			var togglePanel = function() {
				if ( $header.hasClass( 'd2l-accordion-panel-expanded' ) ) {
					me._collapsePanel( $header );
				} else {
					me._expandPanel( $header );
				}
			};

			var isEnabled = !$content.is( ':empty' );

			$header
				.attr( 'role', 'tab' )
				.attr( 'aria-controls', contentId )
				.attr( 'aria-expanded', isExpanded )
				.attr( 'aria-selected', isFocusable ? 'true' : 'false' )
				.attr( 'tabindex', isFocusable ? '0' : '-1' )
				.css( 'padding', isHeaderInteractive ? '0' : 'auto' )
				.data( 'hasExpanded', isExpanded )
				.removeAttr( 'data-expanded' )
				.click( function( e ) {

					if ( !isEnabled ) {
						return;
					}

					var eventTarget = e.target;

					while ( eventTarget !== $header.get( 0 ) && eventTarget !== null ) { 

						if ( eventTarget === $headerContent.get( 0 ) || $( eventTarget ).is( ':focusable' ) ) {
							return;
						}

						eventTarget = eventTarget.parentNode;
					}

					togglePanel();

				} ).focus( function() {

					$header.addClass( 'd2l-accordion-header-active' );

				} ).blur( function() {

					$header.removeClass( 'd2l-accordion-header-active' );

				} ).keydown( function( e ) {

					// prevent scrolling page when arrow keys, home, or end are pressed
					if ( e.keyCode >=35 && e.keyCode <=40 ) {
						e.preventDefault();
						return false;
					}

					return true;

				} ).keyup( function( e ) {

					if ( e.keyCode === 13 || e.keyCode === 32 ) {
						// enter/space
						if ( !isEnabled ) {
							return;
						}
						togglePanel();
					} else if ( e.keyCode === 39 || e.keyCode === 40 ) {
						// down/right
						me._focusPanel( $header, me._tryGetNextPanel( $header ) );
					} else if ( e.keyCode === 37 || e.keyCode === 38 ) {
						// up/left
						me._focusPanel( $header, me._tryGetPreviousPanel( $header ) );
					} else if ( e.keyCode === 35 ) {
						// end - last panel
						me._focusPanel( $header, me._getLastPanelHeader() );
					} else if ( e.keyCode === 36 ) {
						// home - first panel
						me._focusPanel( $header, me._getFirstPanelHeader() );
					}

				} );

			if ( !isEnabled ) {
				$header
					.attr( 'aria-disabled', 'true' )
					.addClass( 'd2l-accordion-header-disabled' );
			}

			$content
				.attr( 'role', 'tabpanel' )
				.attr( 'aria-labelledby', labelledById )
				.attr( 'aria-hidden', 'true' );

			if ( isExpanded ) {

				if ( this._getDisplayMode( $accordion ) === 'accordion' ) {
					$.each( 
						$accordion.find( '.d2l-accordion-panel-expanded' ),
						function( index, panelNode ) {
							me._collapsePanel( $( panelNode ) );
						}
					);
				}

				$header.addClass( 'd2l-accordion-panel-expanded' );

				setTimeout( function() {
					$accordion.trigger( 
						'expandPanel', { 
							header: $header.get( 0 ),
							isFirstExpand: true
						} 
					);
				}, 0 );

				$content
					.attr( 'aria-hidden', 'false' )
					.show();

			}

		},

		_focusPanel: function( $currentHeader, $header ) {

			if ( $header === null ) {
				return;
			}

			$currentHeader
				.attr( 'tabindex', '-1' )
				.attr( 'aria-selected', 'false' );

			$header
				.attr( 'tabindex', '0' )
				.attr( 'aria-selected', 'true' )
				.focus();

		},

		_getFirstPanelHeader: function() {
			var $headers = $( this.element )
				.find( '.d2l-accordion-header');
			return $( $headers[ 0 ] );
		},

		_getLastPanelHeader: function() {
			var $headers = $( this.element )
				.find( '.d2l-accordion-header');
			return $( $headers[ $headers.length - 1 ] );
		},

		_tryGetContent: function( $header ) {

			var contentId = $header.attr( 'data-content-id' );

			if ( contentId !== undefined ) {
				var contentNode = document.getElementById( contentId );
				if ( contentNode !== null ) {
					return $( contentNode );
				} else {
					return null;
				}
			}

			var $nextElement = $header.next( '.d2l-accordion-content' );
			if ( $nextElement.length !== 0 ) {

				contentId = $nextElement.attr( 'id' );
				if ( contentId === undefined ) {
					$nextElement.uniqueId();
					contentId = $nextElement.attr( 'id' );
				}

				$header.attr( 'data-content-id', contentId );

				return $nextElement;

			}

			return null;

		},

		_tryGetPreviousPanel: function( $header ) {

			var $previousElement = $header.prev();

			if ( $previousElement.length === 0 ) {
				return this._getLastPanelHeader();
			} else if ( $previousElement.hasClass( 'd2l-accordion-header' ) ) {
				return $previousElement;
			} else {
				return this._tryGetPreviousPanel( $previousElement );
			}

		},

		_tryGetNextPanel: function( $header ) {

			var $nextElement = $header.next();

			if ( $nextElement.length === 0 ) {
				return this._getFirstPanelHeader();
			} else if ( $nextElement.hasClass( 'd2l-accordion-header' ) ) {
				return $nextElement;
			} else {
				return this._tryGetNextPanel( $nextElement );
			}

		}

	} );

	vui.addClassInitializer(
			'.d2l-accordion',
			function( node ) {
				$( node ).accordion();
			}
		);

	/*
	$( '.d2l-accordion' ).accordion();

	$( document )
		.on(
			'vui-viewrender',
			function( evt ) {
				$( evt.target )
					.find( '.d2l-accordion' )
					.addBack( '.d2l-accordion' )
					.accordion();
			}
		);*/

} );