import { SectionHeader } from "@/components/home/section-header";
import { ProductCard } from "@/components/product/product-card";
import type { ProductSummary } from "@/lib/catalog";

type ProductShowcaseProps = {
  eyebrow?: string;
  title: string;
  href: string;
  products: ProductSummary[];
  layout?: "grid" | "rail";
};

export function ProductShowcase({
  eyebrow,
  title,
  href,
  products,
  layout = "grid",
}: ProductShowcaseProps) {
  return (
    <section className="container-page section">
      <SectionHeader eyebrow={eyebrow} title={title} href={href} />
      {layout === "grid" ? (
        <ul className="grid-products">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="rail -mx-gutter scroll-px-gutter px-gutter md:mx-0 md:px-0">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard
                product={product}
                sizes="(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 70vw"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
