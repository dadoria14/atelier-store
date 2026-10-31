import Link from "next/link";

import { footerLinks } from "@/lib/sample-data";

export function SiteFooter() {
  return (
    <footer className="theme-inverse mt-auto bg-paper">
      <div className="container-page section-sm">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[2fr_repeat(3,1fr)]">
          <div className="stack col-span-2 [--stack-gap:1.25rem] md:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl tracking-label uppercase"
            >
              Atelier
            </Link>
            <p className="text-meta max-w-xs text-muted">
              Considered clothing and leather goods, made to last.
            </p>
          </div>

          {footerLinks.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-label mb-5">{group.title}</h2>
              <ul className="stack [--stack-gap:0.75rem]">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-meta link-quiet text-muted hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule mt-14 flex flex-col gap-3 pt-6 text-2xs text-muted sm:flex-row sm:justify-between">
          <p>Atelier Store — sample storefront.</p>
          <p>Imagery courtesy of Unsplash.</p>
        </div>
      </div>
    </footer>
  );
}
