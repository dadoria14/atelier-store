"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/icons";

type NavItem = { label: string; href: string };

function headerBottom(button: HTMLElement | null) {
  return button?.closest("header")?.getBoundingClientRect().bottom ?? 0;
}

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  // Panel starts at the header's bottom edge, which moves while the
  // announcement bar is still on screen.
  const [top, setTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  function toggle() {
    setTop(headerBottom(buttonRef.current));
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    // Keep keyboard focus out of the page hidden behind the panel.
    const background = document.querySelectorAll<HTMLElement>("main, footer");
    background.forEach((el) => (el.inert = true));
    navRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const syncTop = () => setTop(headerBottom(buttonRef.current));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    // The toggle is hidden at lg, so close rather than strand the scroll lock.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onBreakpoint = (e: MediaQueryListEvent) => e.matches && setOpen(false);

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", syncTop, { passive: true });
    window.addEventListener("scroll", syncTop, { passive: true });
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = "";
      background.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", syncTop);
      window.removeEventListener("scroll", syncTop);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="btn-icon -ml-3"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={open ? "mobile-menu" : undefined}
        onClick={toggle}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <nav
          ref={navRef}
          id="mobile-menu"
          aria-label="Mobile"
          style={{ top }}
          className="fixed inset-x-0 bottom-0 z-(--z-drawer) overflow-y-auto border-t bg-paper"
        >
          <ul className="container-page py-6">
            {items.map((item) => (
              <li key={item.href} className="border-b">
                <Link
                  href={item.href}
                  className="text-heading block py-5"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-page stack [--stack-gap:0.75rem] pb-10">
            <Link
              href="/account"
              className="btn btn-secondary btn-block"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
