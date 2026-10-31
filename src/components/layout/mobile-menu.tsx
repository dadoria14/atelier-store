"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/icons";

type NavItem = { label: string; href: string };

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  // Panel starts at the header's bottom edge, which moves while the
  // announcement bar is still on screen.
  const [top, setTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggle() {
    const header = buttonRef.current?.closest("header");
    setTop(header?.getBoundingClientRect().bottom ?? 0);
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
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
        aria-controls="mobile-menu"
        onClick={toggle}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
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
