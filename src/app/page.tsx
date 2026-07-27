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
function wixThumb(url: string, w: number, h: number, q = 90): string {
  const filename = url.split("/").pop()!;
  return `${url}/v1/fill/w_${w},h_${h},al_c,q_${q},enc_webp/${filename}`;
}

/* ─── Photos ────────────────────────────────────────── */
const PHOTOS = [
  { id: 1,  src: "https://static.wixstatic.com/media/cf7196_f1439a16bade441a823deb4bb22decb0~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 2,  src: "https://static.wixstatic.com/media/cf7196_9bb6057028a949a6a9507621856e4706~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 3,  src: "https://static.wixstatic.com/media/cf7196_f672487768064dadb78d2c3e0d1deda9~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 4,  src: "https://static.wixstatic.com/media/cf7196_1f3b4edaabb247f39bf425a0af821a2a~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 5,  src: "https://static.wixstatic.com/media/cf7196_95faa9cb95244281bad0eb2a0b504051~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 6,  src: "https://static.wixstatic.com/media/cf7196_72c4316252a1463a911711288314febb~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  { id: 7,  src: "https://static.wixstatic.com/media/cf7196_f030896d28ff486fb1cdeeacf32d0a22~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 8,  src: "https://static.wixstatic.com/media/cf7196_8d485fbb01874f3ca2776ddbbd1af57c~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia"    },
  { id: 9,  src: "https://static.wixstatic.com/media/cf7196_36ac4138fc9e472eaad4f08c03f4e430~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia"    },
  { id: 10, src: "https://static.wixstatic.com/media/cf7196_ed338448c6dc44b8ad9ab90dc7291c9e~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia"    },
  { id: 11, src: "https://static.wixstatic.com/media/cf7196_f313bd3436ed4c7486c7625d7b0486d1~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
  { id: 12, src: "https://static.wixstatic.com/media/cf7196_97cc50001ebc4d21b9c7825c8e74ecf2~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
  { id: 13, src: "https://static.wixstatic.com/media/cf7196_bcb63d3909e64814a32fbf8f6dae9208~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
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
          src={wixThumb(photo.src, 2000, 1250, 88)}
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

/* ─── Gallery (static row + hover ripple + lightbox) ── */
function Gallery() {
  const [hov, setHov] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [ref, inView] = useInView(0.05);

  /* Desktop slat heights. Mobile no longer shares this markup — it gets its
     own carousel below — so these are unconditional. */
  const BASE_H = 460;
  const HOV_H  = 680;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const prev = () => setOpen(o => o !== null ? (o - 1 + PHOTOS.length) % PHOTOS.length : null);
  const next = () => setOpen(o => o !== null ? (o + 1) % PHOTOS.length : null);

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
                    src={wixThumb(p.src, 256, 1440)}
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
          <div className={s.mobTrack}>
            {PHOTOS.map((p, i) => (
              <button
                key={p.id}
                className={s.mobSlide}
                onClick={() => setOpen(i)}
                aria-label={`View ${p.tag} photograph`}
              >
                <div className={s.mobFrame}>
                  <Image
                    src={wixThumb(p.src, 1000, 667)}
                    alt={`Tim Page — ${p.tag}`}
                    fill
                    sizes="86vw"
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
              src={PHOTOS[open].src}
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

/* ─── Quote ─────────────────────────────────────────── */
function Quote() {
  const [ref, inView] = useInView();
  return (
    <section
      id="story"
      ref={ref as React.RefObject<HTMLElement>}
      className={`${s.quote} reveal ${inView ? "reveal-in" : ""}`}
    >
      <div
        className={s.quoteBg}
        style={{ backgroundImage: "url(https://picsum.photos/seed/tp-story/1600/900)" }}
        aria-hidden
      />
      <div className={s.quoteOverlay} aria-hidden />
      <div className={s.quoteBody}>
        <p className={s.quoteEra}>1944 – 2022</p>
        <blockquote className={s.quoteText}>
          He was the closest thing to a rock star the world of photojournalism has ever produced.
        </blockquote>
        <p className={s.quoteAttr}>— Rolling Stone, 1973</p>
        <div className={s.quoteFacts}>
          {[["50+","Years in the field"],["12","Major conflicts"],["∞","Images in archive"]].map(([n,l]) => (
            <div key={l} className={s.fact}>
              <span>{n}</span>{l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <Image
            src="https://static.wixstatic.com/media/cf7196_7052e0062608420fa071915befa8546a~mv2.jpeg"
            alt="Tim Page"
            width={680}
            height={907}
            sizes="340px"
            quality={85}
            className={s.aboutPhoto}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className={s.aboutText}>
          <p className={s.eyebrow}><span className={s.eyebrowLine} />About Tim</p>
          <h2 className={s.aboutTitle}>The Frontline Lens</h2>
          <p>Timothy John Page (25 May 1944 – 24 August 2022) was a British war photographer renowned for his coverage of the Vietnam War. His unflinching images defined a generation&apos;s understanding of modern conflict.</p>
          <p>Beginning his career in the early 1960s, Page embedded with US and South Vietnamese forces, sustaining multiple near-fatal wounds in pursuit of the truth. His work appeared in <em>Time</em>, <em>Life</em>, <em>Paris Match</em>, and across the world&apos;s front pages.</p>
          <p>His 1983 book <em>Tim Page&apos;s Nam</em> remains a landmark in photojournalism. Michael Herr — whose 1977 memoir <em>Dispatches</em> features Page prominently — co-wrote the <em>Apocalypse Now</em> screenplay and modelled Dennis Hopper&apos;s gonzo photojournalist character on Page.</p>
          <div className={s.pressRow}>
            {["Time","Life","Paris Match","Rolling Stone","The Guardian"].map((p) => (
              <span key={p} className={s.pressChip}>{p}</span>
            ))}
          </div>
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
