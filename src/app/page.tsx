"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import s from "./page.module.css";

/* ─── Scroll-reveal hook ────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ─── Wix CDN portrait crop ─────────────────────────── */
/* `crop` is the source rectangle to keep, chained BEFORE the fill so a
   baked-in matte never survives into the slat (see Photo.crop below). */
type Rect = readonly [x: number, y: number, w: number, h: number];

function wixCropOp(crop?: Rect): string {
  return crop ? `/v1/crop/x_${crop[0]},y_${crop[1]},w_${crop[2]},h_${crop[3]}` : "";
}

function wixThumb(url: string, w: number, h: number, q = 90, crop?: Rect): string {
  const filename = url.split("/").pop()!;
  return `${url}${wixCropOp(crop)}/v1/fill/w_${w},h_${h},al_c,q_${q},enc_webp/${filename}`;
}

/* Full-size, matte trimmed — for the lightbox, which shows the whole frame. */
function wixFull(url: string, crop?: Rect): string {
  if (!crop) return url;
  const filename = url.split("/").pop()!;
  return `${url}/v1/crop/x_${crop[0]},y_${crop[1]},w_${crop[2]},h_${crop[3]},q_90,enc_webp/${filename}`;
}

/* ─── Photos ────────────────────────────────────────── */
/* `crop` — several of Marianne's scans arrive with a solid matte baked into
   the pixels (a 131px white border on the two Cambodia/Vietnam frames, black
   bands on the Cambodia pair). The slat is a 1:5.6 sliver of full source
   HEIGHT, so that matte lands as grey caps top and bottom and the slat reads
   as short — the "mistake" look. Trimming to the picture area keeps every
   slat the same ratio. Rects were measured off the originals; re-measure if a
   src is swapped. */
type Photo = {
  id: number;
  src: string;
  loc: string;
  tag: string;
  year?: string;
  crop?: Rect;
};

const PHOTOS: Photo[] = [
  { id: 1,  src: "https://static.wixstatic.com/media/cf7196_f1439a16bade441a823deb4bb22decb0~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam",     crop: [0, 0, 1042, 752] },
  { id: 2,  src: "https://static.wixstatic.com/media/cf7196_9bb6057028a949a6a9507621856e4706~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 3,  src: "https://static.wixstatic.com/media/cf7196_f672487768064dadb78d2c3e0d1deda9~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 4,  src: "https://static.wixstatic.com/media/cf7196_1f3b4edaabb247f39bf425a0af821a2a~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 5,  src: "https://static.wixstatic.com/media/cf7196_95faa9cb95244281bad0eb2a0b504051~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 6,  src: "https://static.wixstatic.com/media/cf7196_72c4316252a1463a911711288314febb~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam",     crop: [133, 133, 1553, 1014] },
  { id: 7,  src: "https://static.wixstatic.com/media/cf7196_f030896d28ff486fb1cdeeacf32d0a22~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 8,  src: "https://static.wixstatic.com/media/cf7196_8d485fbb01874f3ca2776ddbbd1af57c~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia",    crop: [133, 133, 1553, 1014] },
  { id: 9,  src: "https://static.wixstatic.com/media/cf7196_36ac4138fc9e472eaad4f08c03f4e430~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia",    crop: [65, 196, 3429, 4864] },
  { id: 10, src: "https://static.wixstatic.com/media/cf7196_ed338448c6dc44b8ad9ab90dc7291c9e~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia",    crop: [226, 52, 5444, 3592] },
  { id: 11, src: "https://static.wixstatic.com/media/cf7196_f313bd3436ed4c7486c7625d7b0486d1~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
  { id: 12, src: "https://static.wixstatic.com/media/cf7196_97cc50001ebc4d21b9c7825c8e74ecf2~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
  { id: 13, src: "https://static.wixstatic.com/media/cf7196_bcb63d3909e64814a32fbf8f6dae9208~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964", crop: [0, 0, 1790, 1193] },
  { id: 14, src: "https://static.wixstatic.com/media/cf7196_c094fc6c464b4c2a8402f8049101c90c~mv2.jpg",  loc: "Afghanistan", tag: "Afghanistan" },
  { id: 15, src: "https://static.wixstatic.com/media/cf7196_9738d9b202be49a08df9412640d0d9d6~mv2.jpg",  loc: "Cuba",        tag: "Cuba"        },
];

const TICKER = "VIETNAM · CAMBODIA · LAOS · NORTHERN IRELAND · MIDDLE EAST · 1960–2022 · WAR PHOTOGRAPHER · TIM PAGE · ARCHIVE · ";
const SECTION_IDS = ["hero", "work", "about", "media", "contact"];

/* ─── Page ──────────────────────────────────────────── */
export default function Home() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <div className={s.grain} aria-hidden />

      <Nav active={active} scrollTo={scrollTo} />

      <main>
        <Hero scrollTo={scrollTo} />
        <Gallery />
        <About />
        <Media />
        <Contact />
        <Footer scrollTo={scrollTo} />
      </main>

      <div className={s.progressBar}>
        <div className={s.progressFill} style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className={s.dots}>
        {SECTION_IDS.map((id) => (
          <button
            key={id}
            className={`${s.dot} ${active === id ? s.dotActive : ""}`}
            onClick={() => scrollTo(id)}
            aria-label={id}
          />
        ))}
      </div>
    </>
  );
}

/* ─── Nav ───────────────────────────────────────────── */
const NAV_ITEMS: [string, string][] = [
  ["work", "Work"],
  ["about", "About Tim"],
  ["media", "Media"],
  ["contact", "Contact"],
];

function Nav({ active, scrollTo }: { active: string; scrollTo: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Escape closes; body scroll locks while the overlay owns the screen.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (id: string) => { setMenuOpen(false); scrollTo(id); };

  return (
    <>
      <nav className={`${s.nav} ${scrolled ? s.navScrolled : ""}`}>
        <button className={s.navLogo} onClick={() => go("hero")}>TIM PAGE</button>
        <div className={s.navLinks}>
          {NAV_ITEMS.map(([id, label]) => (
            <button
              key={id}
              className={`${s.navLink} ${active === id ? s.navLinkActive : ""}`}
              onClick={() => scrollTo(id)}
            >{label}</button>
          ))}
        </div>
        <div className={s.navSocial}>
          <a href="https://www.instagram.com/timpagephoto/?hl=en" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <button
            className={s.navBurger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`${s.burgerBar} ${menuOpen ? s.burgerBarTop : ""}`} />
            <span className={`${s.burgerBar} ${menuOpen ? s.burgerBarMid : ""}`} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${s.menu} ${menuOpen ? s.menuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={s.menuInner}>
          <ul className={s.menuList}>
            {NAV_ITEMS.map(([id, label], i) => (
              <li key={id} style={{ transitionDelay: menuOpen ? `${120 + i * 55}ms` : "0ms" }} className={s.menuItem}>
                <button
                  className={`${s.menuLink} ${active === id ? s.menuLinkActive : ""}`}
                  onClick={() => go(id)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className={s.menuIndex}>{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <button className={s.menuCta} onClick={() => go("contact")} tabIndex={menuOpen ? 0 : -1}>
            Enquire
          </button>

          <a
            className={s.menuMail}
            href="mailto:timpagephoto@bigpond.com"
            tabIndex={menuOpen ? 0 : -1}
          >
            timpagephoto@bigpond.com
          </a>
        </div>
      </div>
    </>
  );
}

/* ─── Hero ──────────────────────────────────────────── */
/* The arrival image. Swap this index to change the hero —
   3 = the B&W column (default), 2 = pink smoke marker,
   5 = orange dust. Indexes are PHOTOS ids, not positions. */
const HERO_PHOTO_ID = 3;

function Hero({ scrollTo }: { scrollTo: (id: string) => void }) {
  const photo = PHOTOS.find((p) => p.id === HERO_PHOTO_ID) ?? PHOTOS[0];

  return (
    <section id="hero" className={s.hero}>
      <div className={s.heroFrame}>
        <Image
          src={wixThumb(photo.src, 2000, 1250, 88, photo.crop)}
          alt={`Tim Page — ${photo.tag}`}
          fill
          sizes="100vw"
          quality={88}
          priority
          className={s.heroImg}
        />
        <div className={s.heroVeil} aria-hidden />
        <div className={s.heroScrim} aria-hidden />
      </div>

      <div className={s.heroBody}>
        <p className={s.heroEyebrow}>The Official Archive</p>
        <h1 className={s.heroName}>Tim Page</h1>
        <p className={s.heroSub}>
          1944–2022 · War Photographer<span className={s.cursor}>_</span>
        </p>
        <p className={s.heroLine}>
          Photographs from Vietnam, Cambodia, Laos and beyond. Print sales,
          editorial licensing and press enquiries.
        </p>
      </div>

      <button className={s.scrollCue} onClick={() => scrollTo("work")} aria-label="Scroll to the work">
        <span className={s.scrollLine} />
      </button>
    </section>
  );
}

/* ─── Ticker ────────────────────────────────────────── */
function Ticker() {
  const repeated = TICKER.repeat(4);
  return (
    <div className={s.ticker} aria-hidden>
      <div className={s.tickerTrack}>
        <span>{repeated}</span>
        <span>{repeated}</span>
      </div>
    </div>
  );
}

/* ─── Gallery constants ──────────────────────────────── */
const SIGMA2 = 2.5; // Gaussian spread — single smooth peak, no secondary humps

/* Mobile spread. Deliberately much tighter than SIGMA2, and not a mismatch:
   the constant is in *card index* units, and the two layouts fit wildly
   different numbers of cards on screen. Desktop shows ~15 slats at once, so a
   wide spread paints a wave ACROSS the row. A phone shows one slide, so its
   neighbours are a full screen away — the ripple is felt over TIME as slides
   cross the centre, not across space. 0.28 puts the midpoint of a swipe at
   ~0.4 and leaves the peeking neighbours clearly receded. */
const MOB_SIGMA2 = 0.28;

/* ─── Gallery (static row + hover ripple + lightbox) ── */
function Gallery() {
  const [hov, setHov] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [ref, inView] = useInView(0.05);

  /* Desktop slat heights. Mobile no longer shares this markup — it gets its
     own carousel below — so these are unconditional. */
  const BASE_H = 460;
  const HOV_H  = 680;

  const prev = () => setOpen(o => o !== null ? (o - 1 + PHOTOS.length) % PHOTOS.length : null);
  const next = () => setOpen(o => o !== null ? (o + 1) % PHOTOS.length : null);

  /* ── Mobile ripple ──────────────────────────────────
     The desktop Gaussian, driven by scroll instead of a cursor. Touch has no
     hover, so "where your attention is" becomes "what you've scrolled to the
     centre" — same curve, same peak-is-colour language, different input.

     Written straight to the DOM as a CSS var rather than through state: this
     fires every frame of a swipe, and reconciling 15 slides at 60fps is how
     you get jank on a mid-range phone. CSS falls back to --f:1 (today's
     look), so desktop, reduced-motion and no-JS all render untouched. */
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length < 2) return;

    /* Geometry is read on mount/resize only — never inside the scroll frame,
       where touching offsetLeft would force a layout on every tick. */
    let pitch = 0, firstCentre = 0, half = 0;
    const measure = () => {
      pitch = slides[1].offsetLeft - slides[0].offsetLeft;
      firstCentre = slides[0].offsetLeft + slides[0].offsetWidth / 2;
      half = track.clientWidth / 2;
    };

    let frame = 0;
    const paint = () => {
      frame = 0;
      if (!pitch || !half) return; // display:none above 768px — nothing to drive
      const peak = (track.scrollLeft + half - firstCentre) / pitch;
      slides.forEach((el, i) => {
        const d = i - peak;
        const f = Math.exp(-(d * d) / MOB_SIGMA2);
        /* Skip the write when nothing changed — the dozen slides parked
           off-screen would otherwise restyle on every frame for nothing. */
        const v = f < 0.002 ? "0" : f.toFixed(3);
        if (el.dataset.f !== v) {
          el.dataset.f = v;
          el.style.setProperty("--f", v);
        }
      });
    };

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const onResize = () => { measure(); paint(); };

    measure();
    paint();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Warm the neighbours so stepping through doesn't wait on a full-size
     fetch each time. Browser cache does the rest. */
  useEffect(() => {
    if (open === null) return;
    [(open + 1) % PHOTOS.length, (open - 1 + PHOTOS.length) % PHOTOS.length]
      .forEach((i) => { const im = new window.Image(); im.src = wixFull(PHOTOS[i].src, PHOTOS[i].crop); });
  }, [open]);

  return (
    <>
      <section
        id="work"
        ref={ref as React.RefObject<HTMLElement>}
        className={`${s.galSec} reveal ${inView ? "reveal-in" : ""}`}
      >
        {/* Desktop: the slat row + ripple. Locked design — do not replace. */}
        <div className={s.galDesktop}>
        <div className={s.galViewport} onMouseLeave={() => setHov(null)}>
          <div className={s.galTrack}>
            {PHOTOS.map((p, i) => {
              const dist   = hov === null ? Infinity : Math.abs(i - hov);
              const factor = hov === null ? 0 : Math.exp(-(dist * dist) / SIGMA2);
              const cardH  = Math.round(BASE_H + (HOV_H - BASE_H) * factor);
              return (
                <button
                  key={p.id}
                  className={`${s.galCard} ${hov === i ? s.galCardUp : ""}`}
                  style={{ height: `${cardH}px` }}
                  onMouseEnter={() => setHov(i)}
                  onClick={() => setOpen(i)}
                  aria-label={`View ${p.tag} photograph`}
                >
                  <Image
                    src={wixThumb(p.src, 256, 1440, 90, p.crop)}
                    alt={`Tim Page — ${p.tag}`}
                    fill
                    sizes="(min-width: 1200px) 200px, 128px"
                    quality={90}
                    className={`${s.galImg} ${hov === i ? s.galImgColor : ""}`}
                    style={{ objectFit: "cover" }}
                  />
                  <div className={`${s.galOverlay} ${hov === i ? s.galOverlayOn : ""}`}>
                    <span className={s.galTag}>{p.tag}</span>
                    <span className={s.galCaption}>{p.loc}{p.year ? `, ${p.year}` : ""}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        </div>

        {/* Mobile: the slats exist to make the ripple read, and there is no
            ripple without a cursor — so mobile gets the same photographs as a
            swipeable carousel at a real aspect ratio instead of slivers. */}
        <div className={s.galMobile}>
          <div className={s.mobTrack} ref={trackRef}>
            {PHOTOS.map((p, i) => (
              <button
                key={p.id}
                className={s.mobSlide}
                onClick={() => setOpen(i)}
                aria-label={`View ${p.tag} photograph`}
              >
                <div className={s.mobFrame}>
                  <Image
                    src={wixThumb(p.src, 1000, 667, 90, p.crop)}
                    alt={`Tim Page — ${p.tag}`}
                    fill
                    sizes="72vw"
                    quality={86}
                    className={s.mobImg}
                  />
                </div>
                <div className={s.mobCap}>
                  <span className={s.mobTag}>{p.loc}</span>
                  {p.year && <span className={s.mobLoc}>{p.year}</span>}
                </div>
              </button>
            ))}
          </div>
          <p className={s.mobHint}>Swipe · tap to enlarge</p>
        </div>

        <p className={s.galIntro}>A selection of images from the frontlines — Vietnam, Cambodia, Laos, and beyond.</p>
        <Ticker />
      </section>

      {open !== null && (
        <div className={s.lb} onClick={() => setOpen(null)}>
          <button className={s.lbClose} onClick={() => setOpen(null)} aria-label="Close">✕ Close</button>
          <button className={s.lbPrev} onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">←</button>
          <button className={s.lbNext} onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">→</button>
          <div className={s.lbInner} onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wixFull(PHOTOS[open].src, PHOTOS[open].crop)}
              alt={`Tim Page — ${PHOTOS[open].tag}`}
              className={s.lbImg}
            />
            <div className={s.lbCaption}>
              <span className={s.lbTag}>{PHOTOS[open].tag}</span>
              <span className={s.lbTitle}>{PHOTOS[open].loc}</span>
              {PHOTOS[open].year && <span className={s.lbYear}>{PHOTOS[open].year}</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Removed: an orphaned Quote() section (never rendered — absent from <main>,
   its id="story" absent from SECTION_IDS). It carried a picsum.photos stock
   placeholder plus unverified figures ("50+ years", "12 major conflicts") and
   a Rolling Stone quote attributed to 1973. If the estate supplies a sourced
   quote and real numbers it can come back; invented metrics must not ship on
   a memorial site for a real person. See reviews/IMPROVEMENT-BRIEF.md P1-6. */

/* ─── About ─────────────────────────────────────────── */
function About() {
  const [ref, inView] = useInView();
  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className={`${s.about} reveal ${inView ? "reveal-in" : ""}`}
    >
      <div className={s.aboutInner}>
        <div className={s.aboutImg}>
          {/* Source is 3998x2248 (16:9). It was declared 680x907, a portrait
              ratio it never had — wrong intrinsic hint, and the reserved box
              never matched the image. */}
          <Image
            src="https://static.wixstatic.com/media/cf7196_7052e0062608420fa071915befa8546a~mv2.jpeg"
            alt="Tim Page on assignment, photographing through a doorway"
            width={1600}
            height={900}
            sizes="(max-width: 860px) 100vw, 470px"
            quality={85}
            className={s.aboutPhoto}
            style={{ width: "100%", height: "auto" }}
          />
          <span className={s.aboutCaption}>Tim Page on assignment</span>

          {/* Lives in this column so the landscape photograph isn't left
              floating above a column of dead space. */}
          <div className={s.pressRow}>
            {["Time","Life","Paris Match","Rolling Stone","The Guardian"].map((p) => (
              <span key={p} className={s.pressChip}>{p}</span>
            ))}
          </div>
        </div>
        <div className={s.aboutText}>
          <p className={s.eyebrow}><span className={s.eyebrowLine} />About Tim</p>
          <h2 className={s.aboutTitle}>The Frontline Lens</h2>
          <p>Timothy John Page (25 May 1944 – 24 August 2022) was a British war photographer renowned for his coverage of the Vietnam War. His unflinching images defined a generation&apos;s understanding of modern conflict.</p>
          <p>Beginning his career in the early 1960s, Page embedded with US and South Vietnamese forces, sustaining multiple near-fatal wounds in pursuit of the truth. His work appeared in <em>Time</em>, <em>Life</em>, <em>Paris Match</em>, and across the world&apos;s front pages.</p>
          <p>His 1983 book <em>Tim Page&apos;s Nam</em> remains a landmark in photojournalism. Michael Herr — whose 1977 memoir <em>Dispatches</em> features Page prominently — co-wrote the <em>Apocalypse Now</em> screenplay and modelled Dennis Hopper&apos;s gonzo photojournalist character on Page.</p>
        </div>
      </div>
    </section>
  );
}

/* ─── Media ─────────────────────────────────────────── */
function Media() {
  const [ref, inView] = useInView();
  const publications = [
    "Time", "Life", "Paris Match", "Rolling Stone",
    "The Guardian", "Newsweek", "AP", "The Sunday Times",
    "Der Spiegel", "Stern", "The New York Times", "Crawdaddy",
  ];
  const features = [
    { label: "Dispatches — Michael Herr, 1977", quote: "I'd heard about him even before I came to Vietnam: 'Look him up. If he's still alive.'" },
    { label: "Apocalypse Now, 1979", quote: "Michael Herr, who wrote Dispatches and co-wrote the Apocalypse Now screenplay, modelled Dennis Hopper's gonzo photojournalist character on Page." },
    { label: "Tim Page's Nam, 1983", quote: "His landmark book remains one of the defining documents of the Vietnam War era." },
  ];
  return (
    <section
      id="media"
      ref={ref as React.RefObject<HTMLElement>}
      className={`${s.media} reveal ${inView ? "reveal-in" : ""}`}
    >
      <div className={s.mediaInner}>
        <div className={s.mediaLeft}>
          <p className={s.eyebrow}><span className={s.eyebrowLine} />As Seen In</p>
          <h2 className={s.mediaTitle}>A Legacy in<br />Print & Film</h2>
          <div className={s.pubGrid}>
            {publications.map(p => (
              <span key={p} className={s.pubChip}>{p}</span>
            ))}
          </div>
        </div>
        <div className={s.mediaRight}>
          {features.map(f => (
            <div key={f.label} className={s.featureCard}>
              <p className={s.featureLabel}>{f.label}</p>
              <p className={s.featureQuote}>&ldquo;{f.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ───────────────────────────────────────── */
type Intent = "license" | "purchase" | "press" | "other";

function Contact() {
  const [intent, setIntent] = useState<Intent>("license");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    data.get("name"),
          email:   data.get("email"),
          image:   data.get("image") || undefined,
          intent,
          usage:   data.get("usage")   || undefined,
          size:    data.get("size")    || undefined,
          message: data.get("message") || undefined,
          company: data.get("company") || undefined, // honeypot
        }),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError("Something went wrong — please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className={`${s.contact} reveal ${inView ? "reveal-in" : ""}`}
    >
      <div className={s.contactInner}>
        <div className={s.contactLeft}>
          <p className={s.eyebrow}><span className={s.eyebrowLine} />Licensing &amp; Purchase</p>
          <h2 className={s.contactTitle}>Acquire<br />an Image</h2>
          <p>The Tim Page archive is available for editorial licensing, fine-art print purchase, and exhibition use. All enquiries are handled by the estate.</p>
          <p>Please describe the image and intended use as precisely as possible. We aim to respond within 48 hours.</p>
          <div className={s.contactDetails}>
            <div className={s.contactRow}><span className={s.clabel}>Email</span><a href="mailto:timpagephoto@bigpond.com">timpagephoto@bigpond.com</a></div>
          </div>
        </div>
        <div className={s.contactRight}>
          {done ? (
            <div className={s.thanks}>
              <p className={s.thanksTitle}>Transmission received.</p>
              <p>The estate will be in touch within 48 hours.</p>
              <button className={s.btnGhost} onClick={() => setDone(false)}>Send another</button>
            </div>
          ) : (
            <form className={s.form} onSubmit={handleSubmit}>
              {/* Honeypot — hidden from people and from assistive tech, so
                  anything that arrives in it came from a bot. */}
              <div className={s.hp} aria-hidden>
                <label>
                  Company
                  <input name="company" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className={s.intentRow}>
                {(["license","purchase","press","other"] as Intent[]).map((v) => (
                  <button key={v} type="button"
                    className={`${s.iBtn} ${intent === v ? s.iBtnOn : ""}`}
                    onClick={() => setIntent(v)}>
                    {v === "license" ? "Editorial" : v === "purchase" ? "Print" : v === "press" ? "Press" : "Other"}
                  </button>
                ))}
              </div>
              <div className={s.fRow}>
                <label className={s.field}><span>Name *</span><input name="name" type="text" required placeholder="Full name" /></label>
                <label className={s.field}><span>Email *</span><input name="email" type="email" required placeholder="your@email.com" /></label>
              </div>
              <label className={s.field}><span>Image</span><input name="image" type="text" placeholder="Describe the image" /></label>
              {intent === "license" && (
                <label className={s.field}><span>Usage</span>
                  <select name="usage">
                    <option value="">Select use</option>
                    <option>Magazine / newspaper</option>
                    <option>Online editorial</option>
                    <option>Book / publication</option>
                    <option>Documentary / film</option>
                    <option>Exhibition</option>
                  </select>
                </label>
              )}
              <label className={s.field}><span>Message</span><textarea name="message" rows={4} placeholder="Context, deadlines, questions…" /></label>
              {error && <p className={s.formError}>{error}</p>}
              <button type="submit" className={s.btnPrimary} disabled={submitting}>
                {submitting ? "Sending…" : "Send Enquiry →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────── */
function Footer({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <footer className={s.footer}>
      <div className={s.footerTop}>
        <button className={s.footerLogo} onClick={() => scrollTo("hero")}>TIM PAGE</button>
        <div className={s.footerLinks}>
          {[["work","Work"],["about","About Tim"],["media","Media"],["contact","Contact"]].map(([id,l]) => (
            <button key={id} onClick={() => scrollTo(id)}>{l}</button>
          ))}
        </div>
        <div className={s.footerSocial}>
          <a href="https://www.instagram.com/timpagephoto/?hl=en" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <div className={s.footerBottom}>
        <p>© {new Date().getFullYear()} The Official Site for Tim Page. · <a href="/privacy">Privacy Policy</a></p>
        <p>Images may not be reproduced without written permission from the estate.</p>
      </div>
    </footer>
  );
}
