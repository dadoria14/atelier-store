import Image from "next/image";
import Link from "next/link";

import { SectionHeader } from "@/components/home/section-header";
import { getDepartments } from "@/lib/catalog";

export async function CollectionGrid() {
  const departments = await getDepartments();

  return (
    <section className="container-page section">
      <SectionHeader eyebrow="Explore" title="Shop by Category" />
      <ul className="grid grid-cols-2 gap-1 lg:grid-cols-4 lg:gap-2">
        {departments.map((department) => (
          <li key={department.slug}>
            <Link href={`/${department.slug}`} className="group block">
              <div className="media aspect-portrait">
                <Image
                  src={department.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 64rem) 25vw, 50vw"
                  className="object-cover transition-transform duration-(--duration-slow) ease-out-soft group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-label mt-4 px-1">
                <span className="link-quiet group-hover:decoration-current">
                  {department.name}
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
