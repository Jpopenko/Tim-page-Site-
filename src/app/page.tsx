"use client";

import { useEffect, useRef, useState } from "react";
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

/* ─── Photos ────────────────────────────────────────── */
// Gallery — 30 unique images drawn from Tim Page's full archive on Wix
const PHOTOS = [
  // Nam Box Set folder
  { id: 1,  src: "https://static.wixstatic.com/media/cf7196_f1439a16bade441a823deb4bb22decb0~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 2,  src: "https://static.wixstatic.com/media/cf7196_9bb6057028a949a6a9507621856e4706~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 3,  src: "https://static.wixstatic.com/media/cf7196_f672487768064dadb78d2c3e0d1deda9~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 4,  src: "https://static.wixstatic.com/media/cf7196_1f3b4edaabb247f39bf425a0af821a2a~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  // ROKS in Nam folder
  { id: 5,  src: "https://static.wixstatic.com/media/cf7196_ef8fe2effd674f8b9f8d1d4bad4fb882~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  // Nam Box Set folder (cont.)
  { id: 6,  src: "https://static.wixstatic.com/media/cf7196_9de7a9db98d841f3a62fc1d17961de28~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 7,  src: "https://static.wixstatic.com/media/cf7196_8aa5f16178874baf8faf999360079f19~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 8,  src: "https://static.wixstatic.com/media/cf7196_95faa9cb95244281bad0eb2a0b504051~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 9,  src: "https://static.wixstatic.com/media/cf7196_72c4316252a1463a911711288314febb~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  { id: 10, src: "https://static.wixstatic.com/media/cf7196_db30a4c9d4894fff90d3f9568c2e2bcd~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  { id: 11, src: "https://static.wixstatic.com/media/cf7196_086003e865904c968f8fa44cd84540f4~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  // Cambodia folder
  { id: 12, src: "https://static.wixstatic.com/media/cf7196_8d485fbb01874f3ca2776ddbbd1af57c~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia"    },
  // Nam Box Set folder (cont.)
  { id: 13, src: "https://static.wixstatic.com/media/cf7196_ddaea12172e347c9b9360982323b1dc6~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 14, src: "https://static.wixstatic.com/media/cf7196_aa45704010954c968ba44335430bb8b7~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 15, src: "https://static.wixstatic.com/media/cf7196_9672b1e30f3e4e219f083dd7ab813b5a~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  { id: 16, src: "https://static.wixstatic.com/media/cf7196_5c5f65d218474081a2fd66c8bcdc3e50~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  { id: 17, src: "https://static.wixstatic.com/media/cf7196_d9c5f2823a8549a19575fd3a9c17810b~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  // Laos '64 folder — year confirmed from folder name
  { id: 18, src: "https://static.wixstatic.com/media/cf7196_f313bd3436ed4c7486c7625d7b0486d1~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
  { id: 19, src: "https://static.wixstatic.com/media/cf7196_97cc50001ebc4d21b9c7825c8e74ecf2~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
  { id: 20, src: "https://static.wixstatic.com/media/cf7196_bcb63d3909e64814a32fbf8f6dae9208~mv2.jpg",  loc: "Laos",        tag: "Laos",        year: "1964" },
  // Cambodia folder
  { id: 21, src: "https://static.wixstatic.com/media/cf7196_36ac4138fc9e472eaad4f08c03f4e430~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia"    },
  { id: 22, src: "https://static.wixstatic.com/media/cf7196_ed338448c6dc44b8ad9ab90dc7291c9e~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia"    },
  { id: 23, src: "https://static.wixstatic.com/media/cf7196_f22f632fe3ee4eb6b03af40c9ae48c0a~mv2.jpg",  loc: "Cambodia",    tag: "Cambodia"    },
  // Landmines folder (Cambodia)
  { id: 24, src: "https://static.wixstatic.com/media/cf7196_738bbb610aa5406c9f60c4246ab36e0a~mv2.jpg",  loc: "Cambodia",    tag: "Landmines"   },
  // Afghanistan folder
  { id: 25, src: "https://static.wixstatic.com/media/cf7196_c094fc6c464b4c2a8402f8049101c90c~mv2.jpg",  loc: "Afghanistan", tag: "Afghanistan" },
  // Cuba folder
  { id: 26, src: "https://static.wixstatic.com/media/cf7196_9738d9b202be49a08df9412640d0d9d6~mv2.jpg",  loc: "Cuba",        tag: "Cuba"        },
  { id: 27, src: "https://static.wixstatic.com/media/cf7196_cc8c11b3e3a6400ba512d731f7399144~mv2.jpg",  loc: "Cuba",        tag: "Cuba"        },
  // Root-level Wix images
  { id: 28, src: "https://static.wixstatic.com/media/cf7196_f030896d28ff486fb1cdeeacf32d0a22~mv2.jpeg", loc: "Vietnam",     tag: "Vietnam"     },
  { id: 29, src: "https://static.wixstatic.com/media/cf7196_e634e457f71d488f9132d7ffcf23df5b~mv2.jpg",  loc: "Vietnam",     tag: "Vietnam"     },
  { id: 30, src: "https://static.wixstatic.com/media/cf7196_047f3e5f1d6342de92e329f8cf29547a~mv2.webp", loc: "Vietnam",     tag: "Vietnam"     },
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
function Nav({ active, scrollTo }: { active: string; scrollTo: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`${s.nav} ${scrolled ? s.navScrolled : ""}`}>
      <button className={s.navLogo} onClick={() => scrollTo("hero")}>TIM PAGE</button>
      <div className={s.navLinks}>
        {[["work","Work"],["about","About Tim"],["media","Media"],["contact","Contact"]].map(([id, label]) => (
          <button
            key={id}
            className={`${s.navLink} ${active === id ? s.navLinkActive : ""}`}
            onClick={() => scrollTo(id)}
          >{label}</button>
        ))}
      </div>
      <div className={s.navSocial}>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────── */
function Hero({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section id="hero" className={s.hero}>
      <div className={s.heroBody}>
        <h1 className={s.heroName}>Tim Page</h1>
        <p className={s.heroSub}>
          War Photographer &nbsp;·&nbsp; 1944 – 2022<span className={s.cursor}>_</span>
        </p>
      </div>
      <button className={s.scrollCue} onClick={() => scrollTo("work")} aria-label="Scroll down">
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
const BASE_H = 460;
const HOV_H  = 680;
const SIGMA2 = 2.5; // Gaussian spread — single smooth peak, no secondary humps

/* ─── Gallery (static row + hover ripple + lightbox) ── */
function Gallery() {
  const [hov, setHov] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [ref, inView] = useInView(0.05);

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={`Tim Page — ${p.tag}`}
                    className={`${s.galImg} ${hov === i ? s.galImgColor : ""}`}
                    loading="lazy"
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://static.wixstatic.com/media/cf7196_7052e0062608420fa071915befa8546a~mv2.jpeg" alt="Tim Page" className={s.aboutPhoto} />
        </div>
        <div className={s.aboutText}>
          <p className={s.eyebrow}><span className={s.eyebrowLine} />About Tim</p>
          <h2 className={s.aboutTitle}>The Frontline Lens</h2>
          <p>Timothy John Page (25 May 1944 – 24 August 2022) was a British war photographer renowned for his coverage of the Vietnam War. His unflinching images defined a generation&apos;s understanding of modern conflict.</p>
          <p>Beginning his career in the early 1960s, Page embedded with US and South Vietnamese forces, sustaining multiple near-fatal wounds in pursuit of the truth. His work appeared in <em>Time</em>, <em>Life</em>, <em>Paris Match</em>, and across the world&apos;s front pages.</p>
          <p>His 1988 book <em>Tim Page&apos;s Nam</em> remains a landmark in photojournalism. Francis Ford Coppola&apos;s photojournalist in <em>Apocalypse Now</em> is widely said to be inspired by Page.</p>
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
    "Der Spiegel", "Stern", "The New York Times", "Magnum Photos",
  ];
  const features = [
    { label: "Rolling Stone, 1973", quote: "The closest thing to a rock star the world of photojournalism has ever produced." },
    { label: "Apocalypse Now, 1979", quote: "Francis Ford Coppola's photojournalist character is widely said to be inspired by Page." },
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
            <div className={s.contactRow}><span className={s.clabel}>Email</span>marianne@timpagephoto.com</div>
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
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <div className={s.footerBottom}>
        <p>© {new Date().getFullYear()} The Official Site for Tim Page.</p>
        <p>Images may not be reproduced without written permission from the estate.</p>
      </div>
    </footer>
  );
}
