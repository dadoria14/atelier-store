import Image from "next/image";
import Link from "next/link";

import { hero } from "@/lib/sample-data";

export function Hero() {
  return (
    <section className="media-hero theme-inverse">
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        preload
        sizes="100vw"
        className="object-cover object-[50%_30%]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

      <div className="container-page absolute inset-x-0 bottom-0 pb-10 md:pb-16">
        <div className="stack max-w-xl [--stack-gap:1.25rem]">
          <p className="text-label">{hero.eyebrow}</p>
          <h1 className="text-display-xl">{hero.title}</h1>
          <p className="max-w-md text-lg">{hero.body}</p>
          <div className="cluster mt-2">
            <Link href="/women" className="btn btn-primary">
              Shop Women
            </Link>
            <Link href="/men" className="btn btn-secondary">
              Shop Men
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
