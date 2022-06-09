<?php
/**
 * PWA Plugin Sanitizer
 *
 * @since 2.3
 * @package AMP
 */

use AmpProject\AmpWP\ValidationExemption;
use AmpProject\Dom\Element;
use AmpProject\Html\Attribute;

/**
 * Class AMP_PWA_Script_Sanitizer
 *
 * @since 2.3
 * @internal
 */
class AMP_PWA_Script_Sanitizer extends AMP_Base_Sanitizer {

	/**
	 * Sanitize the AMP response for offline/500 error pages.
	 *
	 * @since 2.3
	 */
	public function sanitize() {
		if (
			! ( function_exists( 'is_offline' ) && is_offline() ) &&
			! ( function_exists( 'is_500' ) && is_500() )
		) {
			return;
		}

		$scripts = $this->dom->xpath->query( '//script[ @id = "wp-navigation-request-properties" or ( @type = "module" and contains( text(), "checkNetworkAndReload()" ) ) ]' );

		if ( ! $scripts->length ) {
			return;
		}

		foreach ( $scripts as $script ) {
			ValidationExemption::mark_node_as_px_verified( $script );
		}
	}
}
