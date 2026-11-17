(function () {
	/* v6: kennismakingsknoppen naar het formulier op dezelfde pagina; vaste mobiele knop verbergen als het formulier in beeld is */
	var form = document.getElementById('contact');
	if (!form) { return; }
	document.querySelectorAll('a[href="/#contact"]').forEach(function (a) { a.setAttribute('href', '#contact'); });
	var sticky = document.querySelector('.rx-sticky-cta');
	if (sticky && 'IntersectionObserver' in window) {
		new IntersectionObserver(function (entries) {
			entries.forEach(function (e) { sticky.classList.toggle('is-hidden', e.isIntersecting); });
		}, { threshold: 0.05 }).observe(form);
	}
})();
(function () {
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce || !('IntersectionObserver' in window)) { return; }
	document.documentElement.classList.add('rx-js');
	var els = document.querySelectorAll('.rx-reveal');
	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
	els.forEach(function (el, i) { el.style.transitionDelay = ((i % 4) * 90) + 'ms'; io.observe(el); });
})();
