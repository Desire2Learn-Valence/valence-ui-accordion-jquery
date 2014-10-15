/*jslint browser: true*/

(function() {

	'use strict';

	$.widget( "vui.vui_accordion", {

		options: {},

		_create: function() {

			var me = this;

			var $accordion = $( this.element );

			var displayMode = $accordion.attr( 'data-display-mode' );
			if ( displayMode !== 'stacked' ) {
				displayMode = 'accordion';
			}

			this.option( 'displayMode', displayMode );

			$accordion
				.attr( 'role', 'tablist' )
				.attr(
					'aria-multiselectable',
					displayMode !== 'accordion'
				);

			$.each(
				$accordion.find( '.vui-accordion-header' ),
				function( index, headerNode ) {
					me._initializePanel(
						$accordion,
						$( headerNode ),
						( index === 0 )
					);
				}
			);

		},

		_destroy: function () {

			var $accordion = $( this.element );

			$accordion
				.removeAttr( 'role' )
				.removeAttr( 'aria-multiselectable' );

			$.each(
				$accordion.find( '.vui-accordion-toggle' ),
				function( index, toggleNode ) {
					$( toggleNode ).remove();
				}
			);

			$.each(
				$accordion.find( '.vui-accordion-header' ),
				function( index, headerNode ) {
					$( headerNode )
						.removeAttr( 'role' )
						.removeAttr( 'aria-controls' )
						.removeAttr( 'aria-expanded' )
						.removeAttr( 'aria-selected' )
						.removeAttr( 'tabindex' )
						.removeClass( 'vui-accordion-header-active' )
						.removeClass( 'vui-accordion-header-interactive' )
						.unbind( 'click' )
						.unbind( 'focus' )
						.unbind( 'blur' )
						.unbind( 'keydown' )
						.unbind( 'keyup' );
				}
			);

			$.each(
				$accordion.find( '.vui-accordion-content' ),
				function( index, contentNode ) {

					var $content = $( contentNode );
					$content
						.removeAttr( 'role' )
						.removeAttr( 'aria-labelledby' )
						.removeAttr( 'aria-hidden' )
						.removeClass( 'vui-accordion-content-active' );

					if ( $content.data( 'hasGeneratedId' ) ) {
						$content.removeAttr( 'id' );
					}

				}
			);

		},

		_setOption: function( key, value ) {
			if ( key === 'displayMode' ) {
				if ( value === 'stacked' ) {
					value = 'stacked';
				} else {
					value = 'accordion';
				}
				$( this.element ).attr( 'data-display-mode', value );
			}
			$.Widget.prototype._setOption.apply( this, arguments );
		},

		collapseAll: function() {

			var me = this;

			$.each(
				$( this.element ).find( '.vui-accordion-header' ),
				function( index, headerNode ) {
					me._collapsePanel( $( headerNode ) );
				}
			);

		},

		_collapsePanel: function( $header ) {

			if ( !$header.hasClass( 'vui-accordion-panel-expanded' ) ) {
				return;
			}

			$( this.element ).trigger(
				'collapsePanel', {
					header: $header.get(0)
				}
			);

			$header.attr( 'aria-expanded', 'false' )
				.removeClass( 'vui-accordion-panel-expanded' );

			this._updateIcon( $header, false );

			var contentId = $header.attr( 'data-content-id' );

			var contentNode = document.getElementById( contentId );
			if ( contentNode === null ) {
				return;
			}

			$( contentNode )
				.attr( 'aria-hidden', 'true' )
				.attr( 'visibility', 'hidden' )
				.slideUp(250,'swing');

		},

		_expandPanel: function( $header ) {

			var $accordion = $( this.element );

			if ( this.option( 'displayMode' ) === 'accordion' ) {
				$accordion.vui_accordion( 'collapseAll' );
			}

			$accordion.trigger(
				'expandPanel', {
					header: $header.get( 0 ),
					isFirstExpand: !$header.data( 'hasExpanded' )
				}
			);

			$header.attr( 'aria-expanded', 'true' )
				.addClass( 'vui-accordion-panel-expanded' )
				.data( 'hasExpanded', true );

			this._updateIcon( $header, true );

			var contentId = $header.attr( 'data-content-id' );

			var contentNode = document.getElementById( contentId );
			if ( contentNode === null ) {
				return;
			}

			$( contentNode )
				.attr( 'aria-hidden', 'false' )
				.attr( 'visibility', 'visibile' )
				.slideDown(250,'swing');

		},

		_initializePanel: function( $accordion, $header, isFocusable ) {

			var me = this;

			var $content = me._tryGetContent( $header );
			if ( $content === null ) {
				return;
			}

			var contentId = $header.attr( 'data-content-id' );

			var isExpanded = ( $header.attr( 'data-expanded' ) === 'true' ) && !$content.is( ':empty' );
			var labelledById = $header.attr( 'data-content-labelledby' );

			var $headerContent = $header.find( '.vui-accordion-header-content:first-child' );

			var isHeaderInteractive = ( $headerContent.length !== 0 );

			var togglePanel = function() {
				if ( $header.hasClass( 'vui-accordion-panel-expanded' ) ) {
					me._collapsePanel( $header );
				} else {
					me._expandPanel( $header );
				}
			};

			var isEnabled = !$content.is( ':empty' );


			if ( !isExpanded ) {
				$content.attr( 'visibility', 'hidden' );
			}

			if ( isHeaderInteractive ) {

				$header.addClass( 'vui-accordion-header-interactive' );

				var toggle = document.createElement( 'div' );
				toggle.className = 'vui-accordion-toggle';

				var toggleIcon = toggle.appendChild( document.createElement( 'div' ) );
				if ( isExpanded ) {
					toggleIcon.className = 'vui-accordion-toggle-icon vui-icon-accordion-expanded';
				} else {
					toggleIcon.className = 'vui-accordion-toggle-icon vui-icon-accordion-collapsed';
				}

				$header.prepend( toggle );
			}

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

					$header.addClass( 'vui-accordion-header-active' );
					$content.addClass( 'vui-accordion-content-active' );

				} ).blur( function() {

					$header.removeClass( 'vui-accordion-header-active' );
					$content.removeClass( 'vui-accordion-content-active' );

				} ).keydown( function( e ) {

					// prevent scrolling page when arrow keys, home, or end are pressed
					if ( e.keyCode >=35 && e.keyCode <=40 || e.keyCode==32 ) {
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
					.addClass( 'vui-accordion-header-disabled' );
			}

			$content
				.attr( 'role', 'tabpanel' )
				.attr( 'aria-labelledby', labelledById )
				.attr( 'aria-hidden', 'true' );

			if ( isExpanded ) {

				if ( this.option( 'displayMode' ) === 'accordion' ) {
					$.each(
						$accordion.find( '.vui-accordion-panel-expanded' ),
						function( index, panelNode ) {
							me._collapsePanel( $( panelNode ) );
						}
					);
				}

				$header.addClass( 'vui-accordion-panel-expanded' );

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
				.find( '.vui-accordion-header');
			return $( $headers[ 0 ] );
		},

		_getLastPanelHeader: function() {
			var $headers = $( this.element )
				.find( '.vui-accordion-header');
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

			var $nextElement = $header.next( '.vui-accordion-content' );
			if ( $nextElement.length !== 0 ) {

				contentId = $nextElement.attr( 'id' );
				if ( contentId === undefined ) {

					$nextElement.uniqueId()
						.data( 'hasGeneratedId', true );

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
			} else if ( $previousElement.hasClass( 'vui-accordion-header' ) ) {
				return $previousElement;
			} else {
				return this._tryGetPreviousPanel( $previousElement );
			}

		},

		_tryGetNextPanel: function( $header ) {

			var $nextElement = $header.next();

			if ( $nextElement.length === 0 ) {
				return this._getFirstPanelHeader();
			} else if ( $nextElement.hasClass( 'vui-accordion-header' ) ) {
				return $nextElement;
			} else {
				return this._tryGetNextPanel( $nextElement );
			}

		},

		_updateIcon: function( $header, isExpanded ) {

			var toggleIcon = $header.find( '.vui-accordion-toggle-icon' );
			if ( toggleIcon.length > 0 ) {
				if ( isExpanded ) {
					toggleIcon.addClass( 'vui-icon-accordion-expanded' );
					toggleIcon.removeClass( 'vui-icon-accordion-collapsed' );
				} else {
					toggleIcon.addClass( 'vui-icon-accordion-collapsed' );
					toggleIcon.removeClass( 'vui-icon-accordion-expanded' );
				}
			}

		}

	} );

} )();
