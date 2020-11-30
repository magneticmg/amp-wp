<?php
/**
 * Class LegacyTransitionalUrlStructure.
 *
 * @package AmpProject\AmpWP
 */

namespace AmpProject\AmpWP\PairedUrlStructure;

use AmpProject\AmpWP\PairedUrlStructure;

/**
 * Descriptor for paired URL structures that end in /amp/ path suffix for non-hierarchical posts and ?amp for others.
 *
 * @package AmpProject\AmpWP
 * @since 2.1
 * @internal
 */
final class LegacyTransitionalUrlStructure extends PairedUrlStructure {

	/**
	 * Turn a given URL into a paired AMP URL.
	 *
	 * @param string $url URL.
	 * @return string AMP URL.
	 */
	public function add_endpoint( $url ) {
		return static::add_query_var( $url, '' );
	}

	/**
	 * Determine a given URL is for a paired AMP request.
	 *
	 * @param string $url URL to examine. If empty, will use the current URL.
	 * @return bool True if the AMP query parameter is set with the required value, false if not.
	 */
	public function has_endpoint( $url ) {
		return static::has_query_var( $url );
	}

	/**
	 * Remove the paired AMP endpoint from a given URL.
	 *
	 * @param string $url URL.
	 * @return string URL with AMP stripped.
	 */
	public function remove_endpoint( $url ) {
		return static::remove_query_var( $url );
	}
}
