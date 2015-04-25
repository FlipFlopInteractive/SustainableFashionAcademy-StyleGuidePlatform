/**
 * @file
 * Custom JavaScript file
 */

( function( $, window, document, undefined ){

	// enable bootstrap's affix functionality
	$( '#navigation' ).affix({
		offset: {
			top: $( window ).height(),
		}
	});

	// enable fluidbox functionality
  	$( 'a[rel="lightbox"]' ).fluidbox({
  		// overlayColor: 'rgba( 247, 247, 247, 0.95 )',
  		closeTrigger: [{ selector: 'window', event: 'scroll' }]
  	});

})( jQuery, this, this.document );