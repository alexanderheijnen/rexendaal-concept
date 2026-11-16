<?php
/**
 * Rexendaal Praktijk theme functions.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function rx_fonts_url() {
	return 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap';
}

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'rx-fonts', rx_fonts_url(), array(), null );
	wp_enqueue_style( 'rx-theme', get_theme_file_uri( 'assets/theme.css' ), array(), '1.0.2' );
} );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( array( rx_fonts_url(), 'assets/theme.css' ) );
} );

/* Conceptsite: niet laten indexeren. */
add_action( 'wp_head', function () {
	echo "<meta name=\"robots\" content=\"noindex\">\n";
}, 1 );
