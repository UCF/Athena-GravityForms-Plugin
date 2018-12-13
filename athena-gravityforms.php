<?php
/*
Plugin Name: Athena Gravity Forms
Description: Provides Athena Framework styling for Gravity Forms.
Version: 1.0.3
Author: UCF Web Communications
License: GPL3
*/
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'ATHENA_GF__PLUGIN_FILE', __FILE__ );


/**
 * Activation/deactivation hooks
 **/
if ( !function_exists( 'athena_gf_plugin_activation' ) ) {
	function athena_gf_plugin_activation() {
		return;
	}
}

if ( !function_exists( 'athena_gf_plugin_deactivation' ) ) {
	function athena_gf_plugin_deactivation() {
		return;
	}
}

register_activation_hook( ATHENA_GF__PLUGIN_FILE, 'athena_gf_plugin_activation' );
register_deactivation_hook( ATHENA_GF__PLUGIN_FILE, 'athena_gf_plugin_deactivation' );


/**
 * Plugin-dependent actions:
 **/
if ( ! function_exists( 'athena_gf_init' ) ) {
	function athena_gf_init() {
		// If Gravity Forms is installed, update necessary settings.
		if ( class_exists( 'GFForms' ) ) {
			// Disable CSS
			update_option( 'rg_gforms_disable_css', 1 );
			// Enable HTML5 fields
			update_option( 'rg_gforms_enable_html5', 1 );
		}
	}
	add_action( 'plugins_loaded', 'athena_gf_init' );
}

if ( ! function_exists( 'athena_gf_enqueue_assets' ) ) {
	function athena_gf_enqueue_assets() {
		if ( class_exists( 'GFForms' ) ) {
			// Enqueue assets if Gravity Forms is installed and active
			$css_deps = apply_filters( 'athena_gf_style_deps', array() );
			wp_enqueue_style( 'athena_gf_css', plugins_url( 'static/css/athena-gf.min.css', ATHENA_GF__PLUGIN_FILE ), $css_deps, false, 'screen' );
		}
	}
	add_action( 'wp_enqueue_scripts', 'athena_gf_enqueue_assets' );
}
