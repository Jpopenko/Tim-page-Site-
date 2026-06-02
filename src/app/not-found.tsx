import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        gap: "1.1rem",
      }}
    >
      <p style={{ fontFamily: "var(--font-d)", fontSize: "clamp(3.5rem, 14vw, 7rem)", color: "var(--gold)", lineHeight: 1 }}>
        404
      </p>
      <h1 style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", color: "var(--fg)", margin: 0 }}>
        Page not found
      </h1>
      <p style={{ fontFamily: "var(--font-b)", color: "var(--fg-dim)", maxWidth: "34ch", lineHeight: 1.7 }}>
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-b)",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--gold)",
          borderBottom: "1px solid var(--gold-dim)",
          paddingBottom: "3px",
          marginTop: "0.5rem",
        }}
      >
        ← Back to site
      </Link>
    </main>
  );
}
