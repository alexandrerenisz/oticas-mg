/* ===========================================================
   ÓTICAS MG — main.js
=========================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const nav = document.getElementById("mainNav");
  const navToggle = document.getElementById("navToggle");
  const scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  document.body.appendChild(scrim);

  const closeNav = () => {
    nav.classList.remove("open");
    scrim.classList.remove("open");
    navToggle.innerHTML = '<svg width="26" height="26"><use href="#icon-menu"/></svg>';
  };
  const openNav = () => {
    nav.classList.add("open");
    scrim.classList.add("open");
    navToggle.innerHTML = '<svg width="26" height="26"><use href="#icon-close"/></svg>';
  };

  navToggle.addEventListener("click", () => {
    nav.classList.contains("open") ? closeNav() : openNav();
  });
  scrim.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-head, .about-media, .about-text, .product-card, .brand-tile, .team-video-text, .team-video-media, .ambience-item, .testi-card, .client-photo, .trust-item, .location-info, .location-map"
  );
  revealTargets.forEach(el => el.setAttribute("data-reveal", ""));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
    io.observe(el);
  });

  /* ---------- Testimonials carousel ---------- */
  const track = document.getElementById("testiTrack");
  const prevBtn = document.getElementById("testiPrev");
  const nextBtn = document.getElementById("testiNext");
  const dotsWrap = document.getElementById("testiDots");

  if (track) {
    const cards = Array.from(track.children);
    const getPerView = () => (window.innerWidth <= 860 ? 1 : 3);
    let index = 0;

    const buildDots = () => {
      dotsWrap.innerHTML = "";
      const perView = getPerView();
      const pages = Math.max(1, cards.length - perView + 1);
      for (let i = 0; i < pages; i++) {
        const b = document.createElement("button");
        if (i === index) b.classList.add("active");
        b.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(b);
      }
    };

    const update = () => {
      const cardWidth = cards[0].getBoundingClientRect().width + 24;
      track.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle("active", i === index));
    };

    const goTo = (i) => {
      const perView = getPerView();
      const max = Math.max(0, cards.length - perView);
      index = Math.min(Math.max(i, 0), max);
      update();
    };

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    buildDots();
    window.addEventListener("resize", () => { buildDots(); update(); });

    // Autoplay
    let autoplay = setInterval(() => {
      const perView = getPerView();
      const max = Math.max(0, cards.length - perView);
      goTo(index >= max ? 0 : index + 1);
    }, 6000);
    track.addEventListener("mouseenter", () => clearInterval(autoplay));
  }

  /* ---------- Video: pause gracefully if it fails to load ---------- */
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
    });
  }

  /* ---------- Vídeo de apresentação: botão de play central ---------- */
  const teamVideo = document.getElementById("teamVideo");
  const teamVideoPlay = document.getElementById("teamVideoPlay");
  if (teamVideo && teamVideoPlay) {
    teamVideoPlay.addEventListener("click", () => {
      teamVideo.controls = true;
      teamVideo.play();
    });
    teamVideo.addEventListener("play", () => teamVideoPlay.classList.add("hidden"));
    teamVideo.addEventListener("pause", () => teamVideoPlay.classList.remove("hidden"));
  }
});
