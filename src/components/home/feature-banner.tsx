import Image from "next/image";
import Link from "next/link";

import { feature } from "@/lib/sample-data";

export function FeatureBanner() {
  return (
    <section className="theme-inverse bg-paper">
      <div className="grid md:grid-cols-2">
        <div className="media aspect-portrait md:order-2 md:aspect-auto md:min-h-[42rem]">
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            fill
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-gutter py-section">
          <div className="stack mx-auto max-w-md [--stack-gap:1.25rem]">
            <p className="text-label text-muted">{feature.eyebrow}</p>
            <h2 className="text-display">{feature.title}</h2>
            <p className="text-body">{feature.body}</p>
            <div className="mt-4">
              <Link href={feature.href} className="btn btn-secondary">
                {feature.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
