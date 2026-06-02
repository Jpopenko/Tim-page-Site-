import type { Metadata } from "next";
import Link from "next/link";
import s from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the Tim Page estate handles information submitted through the enquiry form on this website.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className={s.wrap}>
      <Link href="/" className={s.back}>← Back to site</Link>

      <p className={s.eyebrow}>Privacy</p>
      <h1 className={s.title}>Privacy Policy</h1>
      <p className={s.updated}>Last updated: June 2026</p>

      <div className={s.body}>
        <p>
          This website is the official archive and licensing portal for the photography
          of Tim Page (1944–2022), maintained by the Tim Page estate (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;). We keep this site deliberately simple, and we keep the
          amount of information we collect to the minimum needed to answer your enquiry.
        </p>

        <h2>What we collect</h2>
        <p>
          We do not run advertising, profiling, or third-party tracking on this site, and
          we do not set non-essential cookies. The only information we collect is what you
          choose to send us through the enquiry form, namely:
        </p>
        <ul>
          <li>your name and email address;</li>
          <li>the details of your enquiry (the image, intended use, and your message).</li>
        </ul>

        <h2>How we use it</h2>
        <p>
          We use the information you provide for one purpose only: to respond to your
          enquiry about licensing, purchasing, or otherwise using Tim Page&rsquo;s work.
          We do not sell, rent, or share your details with third parties for marketing,
          and we will not contact you for any purpose other than your enquiry unless you
          ask us to.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep enquiries only for as long as is reasonably necessary to deal with your
          request and any follow-up. If you would like us to delete your details, just ask
          and we will remove them.
        </p>

        <h2>Images and copyright</h2>
        <p>
          All photographs on this site are the property of the Tim Page estate and may not
          be reproduced without written permission. Image enquiries are handled by the
          estate.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about this policy, or to request that we delete your
          information, email us at{" "}
          <a href="mailto:timpagephoto@bigpond.com">timpagephoto@bigpond.com</a>.
        </p>

        <hr className={s.divider} />
        <p>
          Because this site collects so little, this policy is intentionally short. If our
          practices change, we will update this page and the date above.
        </p>
      </div>
    </main>
  );
}
