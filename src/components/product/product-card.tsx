import Image from "next/image";
import Link from "next/link";

import type { ProductSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: ProductSummary;
  sizes?: string;
};

export function ProductCard({
  product,
  sizes = "(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 50vw",
}: ProductCardProps) {
  const badge = product.inStock ? product.badge : "Sold Out";

  return (
    <article className="group relative">
      <div className="media-product">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-(--duration-slow) ease-out-soft group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="text-caption absolute top-3 left-3 bg-paper px-2 py-1">
            {badge}
          </span>
        )}
      </div>

      <div className="stack mt-3 px-1 [--stack-gap:0.25rem] md:mt-4">
        <p className="text-caption text-muted">{product.categoryName}</p>
        <h3 className="text-meta">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="text-meta text-muted">{formatPrice(product.priceCents)}</p>
      </div>
    </article>
  );
}
