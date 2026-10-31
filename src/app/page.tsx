import { CollectionGrid } from "@/components/home/collection-grid";
import { EditorialPair } from "@/components/home/editorial-pair";
import { FeatureBanner } from "@/components/home/feature-banner";
import { Hero } from "@/components/home/hero";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ServiceStrip } from "@/components/home/service-strip";
import { getNewArrivals, getProductsInCategory } from "@/lib/catalog";

export default async function Home() {
  const [newArrivals, accessories] = await Promise.all([
    getNewArrivals(8),
    getProductsInCategory("accessories"),
  ]);

  return (
    <>
      <Hero />
      <ProductShowcase
        eyebrow="Just Arrived"
        title="New This Season"
        href="/new"
        products={newArrivals}
      />
      <EditorialPair />
      <CollectionGrid />
      <FeatureBanner />
      <ProductShowcase
        eyebrow="Finishing Touches"
        title="Jewelry & Accessories"
        href="/accessories"
        products={accessories}
        layout="rail"
      />
      <ServiceStrip />
    </>
  );
}
