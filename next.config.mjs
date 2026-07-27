/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// Next's dev client (react-refresh) compiles with eval, and HMR talks over a
// websocket. Without these the dev bundle throws on CSP and React never
// hydrates — every handler on the page goes dead. Dev only; prod stays strict.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";
const connectSrc = isDev
  ? "connect-src 'self' https://static.wixstatic.com ws: wss:"
  : "connect-src 'self' https://static.wixstatic.com";

const csp = [
  "default-src 'self'",
  "img-src 'self' https://static.wixstatic.com data:",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  connectSrc,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "**.wix.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.timpagephoto.com" }],
        destination: "https://timpagephoto.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
