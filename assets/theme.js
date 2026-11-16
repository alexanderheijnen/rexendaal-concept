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
