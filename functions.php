<?php
/**
 * Rexendaal Praktijk theme functions.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'RX_VERSION', '3.0.0' );

function rx_fonts_url() {
	return 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
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


/* ===================== v3 ===================== */
add_action( 'init', function () { add_post_type_support( 'page', 'excerpt' ); }, 5 );

/* Contactformulier: [rx_contact] */
add_shortcode( 'rx_contact', function () {
	$status = isset( $_GET['rx_verzonden'] ) ? sanitize_text_field( wp_unslash( $_GET['rx_verzonden'] ) ) : '';
	$here   = ( is_singular() ? get_permalink() : home_url( '/' ) );
	ob_start();
	if ( '1' === $status ) {
		echo '<div class="rx-form-msg ok" role="status"><strong>Dank je wel!</strong> Je bericht is verstuurd. Je hoort binnen twee werkdagen van ons.</div>';
	} elseif ( '0' === $status ) {
		echo '<div class="rx-form-msg err" role="alert">Er ging iets mis bij het versturen. Mail ons gerust direct via <a href="mailto:info@rexendaal.nl">info@rexendaal.nl</a>.</div>';
	}
	?>
	<form class="rx-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<input type="hidden" name="action" value="rx_contact">
		<input type="hidden" name="rx_redirect" value="<?php echo esc_url( $here ); ?>">
		<input type="hidden" name="rx_t" value="<?php echo esc_attr( time() ); ?>">
		<div class="rx-hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
		<div class="rx-form-row">
			<label>Naam*<input type="text" name="rx_naam" required autocomplete="name"></label>
			<label>E-mailadres*<input type="email" name="rx_email" required autocomplete="email"></label>
		</div>
		<div class="rx-form-row">
			<label>Telefoon<input type="tel" name="rx_tel" autocomplete="tel"></label>
			<label>Waar gaat het over?
				<select name="rx_onderwerp">
					<option>Individuele coaching</option><option>Teamcoaching of teamontwikkeling</option><option>Coaching of training voor leidinggevenden</option><option>Training of workshop</option><option>Counselling</option><option>Iets anders</option>
				</select>
			</label>
		</div>
		<label>Je vraag<textarea name="rx_bericht" rows="4"></textarea></label>
		<label class="rx-consent"><input type="checkbox" name="rx_ok" value="1" required> Ik ga akkoord dat Rexendaal mijn gegevens gebruikt om contact met mij op te nemen.</label>
		<button type="submit" class="wp-element-button rx-submit">Verstuur</button>
	</form>
	<?php
	return ob_get_clean();
} );

function rx_handle_contact() {
	$redirect = isset( $_POST['rx_redirect'] ) ? esc_url_raw( wp_unslash( $_POST['rx_redirect'] ) ) : home_url( '/' );
	$back     = function ( $ok ) use ( $redirect ) {
		wp_safe_redirect( add_query_arg( 'rx_verzonden', $ok ? '1' : '0', $redirect ) . '#contact' );
		exit;
	};
	if ( ! empty( $_POST['website'] ) ) { $back( true ); }                      // honeypot: doe alsof het gelukt is
	$t = isset( $_POST['rx_t'] ) ? (int) $_POST['rx_t'] : 0;
	if ( $t && ( time() - $t ) < 3 ) { $back( true ); }                          // te snel = bot
	$naam  = sanitize_text_field( wp_unslash( $_POST['rx_naam'] ?? '' ) );
	$email = sanitize_email( wp_unslash( $_POST['rx_email'] ?? '' ) );
	$tel   = sanitize_text_field( wp_unslash( $_POST['rx_tel'] ?? '' ) );
	$ond   = sanitize_text_field( wp_unslash( $_POST['rx_onderwerp'] ?? '' ) );
	$msg   = sanitize_textarea_field( wp_unslash( $_POST['rx_bericht'] ?? '' ) );
	if ( ! $naam || ! is_email( $email ) || empty( $_POST['rx_ok'] ) ) { $back( false ); }
	$body  = "Nieuw bericht via de website\n\nNaam: $naam\nE-mail: $email\nTelefoon: $tel\nOnderwerp: $ond\nPagina: $redirect\n\nBericht:\n$msg\n";
	$sent  = wp_mail( 'info@rexendaal.nl', 'Website: ' . $ond . ' (' . $naam . ')', $body, array( 'Reply-To: ' . $naam . ' <' . $email . '>' ) );
	$back( (bool) $sent );
}
add_action( 'admin_post_nopriv_rx_contact', 'rx_handle_contact' );
add_action( 'admin_post_rx_contact', 'rx_handle_contact' );

/* Lokale bedrijfsgegevens voor zoekmachines */
add_action( 'wp_head', function () {
	if ( ! is_front_page() ) { return; }
	$areas = array( 'Zutphen', 'Warnsveld', 'Deventer', 'Apeldoorn', 'Twello', 'Voorst', 'Empe', 'Tonden', 'Klarenbeek', 'Brummen', 'Dieren', 'Doesburg', 'Lochem', 'Gorssel', 'Eefde', 'Almen', 'Hengelo (Gld)', 'Wichmond', 'Bronkhorst', 'Berkelland', 'Beekbergen', 'Ugchelen', 'Loenen' );
	$data  = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'ProfessionalService',
		'name'        => 'Rexendaal',
		'slogan'      => 'Presteren begint bij mensen.',
		'description' => 'Coaching, teamcoaching en trainingen. Werkgeluk voor medewerkers, resultaat voor organisaties.',
		'url'         => home_url( '/' ),
		'email'       => 'info@rexendaal.nl',
		'telephone'   => '+31650278030',
		'address'     => array( '@type' => 'PostalAddress', 'streetAddress' => 'Paul Rodenkolaan 36', 'postalCode' => '7207 CG', 'addressLocality' => 'Zutphen', 'addressCountry' => 'NL' ),
		'areaServed'  => array_map( function ( $a ) { return array( '@type' => 'Place', 'name' => $a ); }, $areas ),
		'founder'     => array( '@type' => 'Person', 'name' => 'Alexander Heijnen' ),
	);
	echo '<script type="application/ld+json">' . wp_json_encode( $data ) . "</script>\n";
}, 5 );

/* Inhoud v3: dienst- en regiopagina's, aanbod, featured images, opruimen */
function rx_attach_theme_image( $name, $post_id ) {
	$path = get_theme_file_path( 'assets/img/' . $name . '.webp' );
	if ( ! file_exists( $path ) ) { return 0; }
	require_once ABSPATH . 'wp-admin/includes/image.php';
	$up = wp_upload_bits( $name . '.webp', null, file_get_contents( $path ) );
	if ( ! empty( $up['error'] ) ) { return 0; }
	$id = wp_insert_attachment( array( 'post_mime_type' => 'image/webp', 'post_title' => $name, 'post_status' => 'inherit' ), $up['file'], $post_id );
	if ( ! $id || is_wp_error( $id ) ) { return 0; }
	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $up['file'] ) );
	set_post_thumbnail( $post_id, $id );
	return $id;
}

add_action( 'init', 'rx_install_content_v3', 30 );
function rx_install_content_v3() {
	if ( (int) get_option( 'rx_content_v' ) >= 3 ) { return; }
	if ( ! get_option( 'rx_starter_done' ) ) { return; }
	if ( ! add_option( 'rx_v3_lock', time(), '', false ) ) { return; }

	$admins = get_users( array( 'role' => 'administrator', 'number' => 1, 'fields' => 'ID' ) );
	$author = $admins ? (int) $admins[0] : 0;

	$pages = json_decode( file_get_contents( get_theme_file_path( 'inc/pages.json' ) ), true );
	foreach ( (array) $pages as $slug => $pg ) {
		$existing = get_page_by_path( $slug );
		$args = array( 'post_title' => $pg['title'], 'post_content' => $pg['content'], 'post_excerpt' => $pg['excerpt'] );
		if ( $existing ) {
			$ours = get_post_meta( $existing->ID, '_rx_managed', true ) || in_array( $slug, array( 'kennisbank', 'werkgeluk-test' ), true );
			if ( $ours ) {
				$args['ID'] = $existing->ID;
				wp_update_post( $args );
				update_post_meta( $existing->ID, '_rx_managed', 1 );
			}
		} else {
			$args += array( 'post_type' => 'page', 'post_status' => 'publish', 'post_name' => $slug, 'post_author' => $author );
			$id = wp_insert_post( $args );
			if ( $id && ! is_wp_error( $id ) ) { update_post_meta( $id, '_rx_managed', 1 ); }
		}
	}

	$posts = json_decode( file_get_contents( get_theme_file_path( 'inc/posts.json' ) ), true );
	$keep  = array();
	foreach ( (array) $posts as $post ) {
		$keep[] = $post['slug'];
		$p = get_page_by_path( $post['slug'], OBJECT, 'post' );
		if ( $p && ! has_post_thumbnail( $p->ID ) && ! empty( $post['image'] ) ) { rx_attach_theme_image( $post['image'], $p->ID ); }
	}
	foreach ( get_posts( array( 'post_type' => 'post', 'post_status' => 'publish', 'numberposts' => -1 ) ) as $old ) {
		if ( ! in_array( $old->post_name, $keep, true ) ) { wp_trash_post( $old->ID ); } // naar de prullenbak, herstelbaar
	}

	update_option( 'blogname', 'Rexendaal' );
	update_option( 'blogdescription', 'Presteren begint bij mensen' );
	update_option( 'rx_content_v', 3, false );
}
