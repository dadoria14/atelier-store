import Link from "next/link";

import { BagIcon, SearchIcon, UserIcon } from "@/components/icons";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { navigation } from "@/lib/sample-data";

export function SiteHeader() {
  return (
    <>
      <div className="theme-inverse bg-paper">
        <p className="container-page text-caption py-2.5 text-center">
          Complimentary shipping &amp; returns
        </p>
      </div>

      <header className="sticky top-0 z-(--z-header) border-b bg-paper">
        <div className="container-page grid h-(--header-height) grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center">
            <MobileMenu items={navigation} />
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="cluster [--cluster-gap:1.75rem]">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-label link-quiet">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            href="/"
            className="font-display text-xl tracking-label uppercase lg:text-2xl"
          >
            Atelier
          </Link>

          <div className="-mr-3 flex items-center justify-end">
            <Link href="/search" className="btn-icon" aria-label="Search">
              <SearchIcon />
            </Link>
            <Link
              href="/account"
              className="btn-icon hidden sm:inline-flex"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
            <Link href="/cart" className="btn-icon" aria-label="Shopping bag">
              <BagIcon />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
