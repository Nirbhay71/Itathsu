import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Chamber } from "./ProductArtwork.jsx";

export default function Showroom({
  store,
  products,
  allProducts,
  money,
  follow,
}) {
  const [active, setActive] = useState(null);
  return (
    <section className="showroom" aria-labelledby="collection-title">
      <div className="room-ceiling" aria-hidden="true" />
      <div className="room-architecture" aria-hidden="true">
        <span>01</span>
        <span>THE PRIVATE COLLECTION</span>
        <span>{store.edition}</span>
      </div>
      <div
        className="exhibition"
        data-size={products.length}
        style={{ "--count": products.length || 1 }}
      >
        {products.map((product) => (
          <article
            key={product.id}
            style={{
              "--tone": product.tone,
              "--niche-x": `${[15.76, 38.7, 61.6, 84.5][allProducts.indexOf(product)] || 15.76}%`,
              gridColumn: allProducts.indexOf(product) + 1,
            }}
            className={`exhibit ${active === product.id ? "illuminated" : ""} ${active && active !== product.id ? "receded" : ""}`}
            onPointerEnter={() => setActive(product.id)}
            onPointerLeave={() => setActive(null)}
          >
            <a
              href={`/products/${product.id}`}
              onClick={(event) => follow(event, `/products/${product.id}`)}
              onFocus={() => setActive(product.id)}
              onBlur={() => setActive(null)}
              aria-label={`Discover ${product.name}, ${money(product.price)}`}
            >
              <Chamber product={product} transition>
                <div className="exhibit-label">
                  <div>
                    <h2>{product.name}</h2>
                    <span>{product.category}</span>
                  </div>
                </div>
              </Chamber>
            </a>
          </article>
        ))}
        {!products.length && (
          <p className="empty-collection">No pieces in this collection yet.</p>
        )}
      </div>
      <div className="gallery-floor" aria-hidden="true" />
      <div className="collection-caption">
        <div className="caption-copy">
          <div className="eyebrow">
            <span className="status-dot" /> {store.collectionLabel} /{" "}
            {String(products.length).padStart(2, "0")} pieces
          </div>
          <h1 id="collection-title">
            {store.showroomTitle || "The time collection"}
          </h1>
          <p>{store.showroomDescription || store.description}</p>
        </div>
        <div className="caption-aside">
          <span>
            SELECT A PIECE.
            <br />
            STEP A LITTLE CLOSER.
          </span>
          <div className="navigation-rule" />
          <span className="gallery-index">
            01 <span>/ {String(allProducts.length).padStart(2, "0")}</span>
          </span>
          <span className="mobile-hint">
            Tap a timepiece to explore <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
      <div className="room-bottom">
        <span>{store.tagline}</span>
        <span>Curated by {store.name}</span>
        <span>Demo collection · Prices in {store.currency}</span>
      </div>
    </section>
  );
}
