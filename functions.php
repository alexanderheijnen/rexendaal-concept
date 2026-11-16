<?php
/**
 * Rexendaal Praktijk theme functions.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'RX_VERSION', '2.0.0' );

function rx_fonts_url() {
	return 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap';
}

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'rx-fonts', rx_fonts_url(), array(), null );
	wp_enqueue_style( 'rx-theme', get_theme_file_uri( 'assets/theme.css' ), array(), RX_VERSION );
	wp_enqueue_script( 'rx-theme', get_theme_file_uri( 'assets/theme.js' ), array(), RX_VERSION, true );
	if ( is_page( 'werkgeluk-test' ) ) {
		wp_enqueue_style( 'rx-test', get_theme_file_uri( 'assets/werkgeluk-test.css' ), array(), RX_VERSION );
		wp_enqueue_script( 'rx-test', get_theme_file_uri( 'assets/werkgeluk-test.js' ), array(), RX_VERSION, true );
	}
} );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( array( rx_fonts_url(), 'assets/theme.css' ) );
} );

add_action( 'wp_head', function () {
	echo "<meta name=\"robots\" content=\"noindex\">\n"; // testsite: niet indexeren
	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( get_theme_file_uri( 'assets/favicon.svg' ) ) . "\">\n";
}, 1 );

/* Werkgeluk-test: [rx_werkgeluktest] */
add_shortcode( 'rx_werkgeluktest', function () {
	wp_enqueue_style( 'rx-test', get_theme_file_uri( 'assets/werkgeluk-test.css' ), array(), RX_VERSION );
	wp_enqueue_script( 'rx-test', get_theme_file_uri( 'assets/werkgeluk-test.js' ), array(), RX_VERSION, true );
	$file = get_theme_file_path( 'inc/werkgeluk-test.html' );
	return file_exists( $file ) ? file_get_contents( $file ) : '';
} );

/**
 * Eenmalige startinhoud: pagina's Werkgeluk-test en Kennisbank, categorieën en artikelen.
 * Daarna is alles gewoon te bewerken in WordPress.
 */
add_action( 'init', 'rx_install_starter_content', 20 );
function rx_install_starter_content() {
	if ( get_option( 'rx_starter_done' ) ) { return; }
	if ( ! add_option( 'rx_starter_lock', time(), '', false ) ) { return; }

	$admins = get_users( array( 'role' => 'administrator', 'number' => 1, 'fields' => 'ID' ) );
	$author = $admins ? (int) $admins[0] : 0;

	$query_loop = '<!-- wp:query {"queryId":5,"query":{"perPage":12,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false},"className":"rx-posts"} -->
<div class="wp-block-query rx-posts"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"rx-post-card","layout":{"type":"default"}} -->
<div class="wp-block-group rx-post-card"><!-- wp:post-terms {"term":"category","className":"rx-tag"} /-->

<!-- wp:post-title {"level":3,"isLink":true} /-->

<!-- wp:post-excerpt {"moreText":"Lees verder →","excerptLength":22} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template --></div>
<!-- /wp:query -->';

	$pages = array(
		'werkgeluk-test' => array(
			'title'   => 'Werkgeluk-test',
			'content' => "<!-- wp:paragraph {\"className\":\"rx-lead\"} -->\n<p class=\"rx-lead\">Hoe past je werk bij jou? Drie korte rondes vol keuzes waar geen goed of fout antwoord op bestaat. Aan het eind weet je wat jij nodig hebt, waar je werk schuurt, en hoe de ruil tussen jou en je werk ervoor staat. Gratis, en het duurt ongeveer acht minuten.</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:shortcode -->\n[rx_werkgeluktest]\n<!-- /wp:shortcode -->",
		),
		'kennisbank' => array(
			'title'   => 'Kennisbank',
			'content' => "<!-- wp:paragraph {\"className\":\"rx-lead\"} -->\n<p class=\"rx-lead\">Artikelen over werkgeluk, persoonlijke effectiviteit en team performance. Praktisch, en onderbouwd met onderzoek.</p>\n<!-- /wp:paragraph -->\n\n" . $query_loop,
		),
	);
	foreach ( $pages as $slug => $page ) {
		if ( get_page_by_path( $slug ) ) { continue; }
		wp_insert_post( array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_title'   => $page['title'],
			'post_content' => $page['content'],
			'post_author'  => $author,
		) );
	}

	$json  = get_theme_file_path( 'inc/posts.json' );
	$posts = file_exists( $json ) ? json_decode( file_get_contents( $json ), true ) : array();
	$now   = current_time( 'timestamp' );
	foreach ( (array) $posts as $i => $post ) {
		if ( get_page_by_path( $post['slug'], OBJECT, 'post' ) ) { continue; }
		$term = term_exists( $post['cat'], 'category' );
		if ( ! $term ) { $term = wp_insert_term( $post['cat'], 'category' ); }
		$term_id = is_array( $term ) ? (int) $term['term_id'] : (int) $term;
		wp_insert_post( array(
			'post_type'     => 'post',
			'post_status'   => 'publish',
			'post_name'     => $post['slug'],
			'post_title'    => $post['title'],
			'post_excerpt'  => $post['excerpt'],
			'post_content'  => $post['content'],
			'post_author'   => $author,
			'post_category' => $term_id ? array( $term_id ) : array(),
			'post_date'     => date( 'Y-m-d H:i:s', $now - ( $i * 3600 ) ),
		) );
	}
	update_option( 'rx_starter_done', RX_VERSION, false );
}
