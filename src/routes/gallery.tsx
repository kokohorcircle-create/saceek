import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import heroImage from "@/assets/bueno-hero.jpg";
import ingredientsImage from "@/assets/ingredients-flatlay.jpg";
import familyImage from "@/assets/family-nutrition.jpg";
import packDesign from "@/assets/bueno-pack-design.png";
import jarImage from "@/assets/bueno-jar-300g.png";
import marketStand from "@/assets/saceek-market-stand.png";
import displayBanner from "@/assets/saceek-display-banner.png";
import stockPallets from "@/assets/bueno-stock-pallets.png";

export const metadata: Metadata = {
  title: "Gallery | Saceek International",
  description:
    "Product, ingredient, production and lifestyle imagery from Saceek International Network Limited and Bueno Soyabeans Powder Mix.",
  openGraph: {
    title: "Gallery | Saceek International",
    description:
      "A look at Bueno Soyabeans Powder Mix, our ingredients and our production care.",
    type: "website",
    url: "https://saceek.com/gallery",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/gallery",
  },
};

const IMAGES = [
  {
    src: heroImage,
    alt: "Bueno Soyabeans Powder Mix 300 g pack with a bowl of prepared drink",
    caption: "Bueno Soyabeans Powder Mix — 300 g",
    span: "lg:col-span-2 lg:row-span-2",
    w: 1408,
    h: 1104,
  },
  {
    src: ingredientsImage,
    alt: "Bowls of the natural ingredients used in Bueno Soyabeans Powder Mix",
    caption: "Our natural ingredients",
    span: "",
    w: 1408,
    h: 912,
  },
  {
    src: familyImage,
    alt: "A family enjoying warm nutritious drinks together at home",
    caption: "Nourishing families every day",
    span: "lg:col-span-2",
    w: 1200,
    h: 912,
  },
  {
    src: packDesign,
    alt: "Front and back artwork of the 15 g Bueno Soyabeans Powder Mix sachet",
    caption: "Bueno sachet pack — front and back",
    span: "sm:col-span-2 lg:col-span-2",
    contain: true,
    w: 1280,
    h: 1024,
  },
  {
    src: jarImage,
    alt: "Bueno Soya Beans Powder 300 g jar with red lid",
    caption: "Bueno 300 g jar",
    span: "lg:row-span-2",
    contain: true,
    w: 1199,
    h: 1312,
  },
  {
    src: displayBanner,
    alt: "Saceek roll-up banner beside a Bueno product display stand",
    caption: "Brand display stand",
    span: "lg:row-span-2",
    contain: true,
    w: 487,
    h: 637,
  },
  {
    src: marketStand,
    alt: "Customers at a Saceek outdoor market stand stocked with Bueno jars",
    caption: "Out in the market with our customers",
    span: "sm:col-span-2 lg:col-span-2",
    w: 618,
    h: 471,
  },
  {
    src: stockPallets,
    alt: "Pallets of shrink-wrapped Bueno Soyabeans Powder Mix jars ready for dispatch",
    caption: "Stock ready for dispatch",
    contain: true,
    span: "",
    w: 762,
    h: 1096,
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A Closer Look"
        subtitle="Product, ingredients, production and the families we make Bueno for."
      />

      <section className="section-y">
        <div className="container-page">
          <div className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[240px]">
            {IMAGES.map((image) => (
              <figure
                key={image.caption}
                className={`group relative overflow-hidden rounded-2xl border border-border shadow-card ${
                  image.contain ? "bg-secondary" : ""
                } ${image.span}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  width={image.w}
                  height={image.h}
                  className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                    image.contain ? "object-contain p-3 pb-10" : "object-cover"
                  }`}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-foreground/70 px-4 py-2.5 text-sm text-background">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              More photography from events, trade partners and production will
              be added here.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 rounded-full px-6"
            >
              <Link href="/bueno">View the Product Page</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
