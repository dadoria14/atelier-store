import Image from "next/image";
import Link from "next/link";

import { editorials } from "@/lib/sample-data";

export function EditorialPair() {
  return (
    <section className="section-sm">
      <div className="grid-split">
        {editorials.map((story) => (
          <article key={story.title} className="group">
            <Link href={story.href} className="block">
              <div className="media aspect-portrait">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(min-width: 48rem) 50vw, 100vw"
                  className="object-cover transition-transform duration-(--duration-slow) ease-out-soft group-hover:scale-[1.02]"
                />
              </div>
              <div className="stack items-center px-gutter pt-8 pb-4 text-center [--stack-gap:0.875rem]">
                <p className="text-caption text-muted">{story.eyebrow}</p>
                <h2 className="font-display text-2xl tracking-tight">{story.title}</h2>
                <p className="max-w-sm text-muted">{story.body}</p>
                <span className="text-label link mt-1">{story.cta}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
