import React, { useEffect, useState } from "react";

/** Original photography stays available; the atlas is used only for the showroom. */
export function ProductArtwork({
  product,
  original = false,
  reflection = false,
  transition = false,
}) {
  const [failed, setFailed] = useState(false);
  const source =
    !original && product.showroomImage ? product.showroomImage : product.image;
  useEffect(() => setFailed(false), [source]);
  const cutout = !original && product.showroomImage;
  const slice = cutout && product.showroomSlice;
  return (
    <div
      className={`product-artwork ${cutout ? "is-cutout" : "is-photo"} ${reflection ? "is-reflection" : ""}`}
      style={{
        "--art-ratio": slice ? slice.width / slice.atlasHeight : 0.55,
        ...(transition ? { viewTransitionName: `piece-${product.id}` } : {}),
      }}
      aria-hidden={reflection || undefined}
    >
      {source && !failed ? (
        <img
          src={source}
          alt={reflection ? "" : product.name}
          onError={() => setFailed(true)}
          style={
            slice
              ? {
                  width: `${(slice.atlasWidth / slice.width) * 100}%`,
                  left: `${(-slice.left / slice.width) * 100}%`,
                }
              : { objectPosition: product.imagePosition || "center" }
          }
          draggable="false"
        />
      ) : (
        <div className="missing-artwork">
          <span>{product.name}</span>
          <small>Photograph unavailable</small>
        </div>
      )}
    </div>
  );
}

function NicheScene({ product, original = false, transition = false, reflection = false }) {
  return <>
    <div className="chamber-beam" aria-hidden="true" />
    <div className="product-aura" aria-hidden="true" />
    <div className="light-pool" aria-hidden="true" />
    {!original && <>
      <div className="wall-reflection wall-reflection-left" aria-hidden="true">
        <ProductArtwork product={product} reflection />
      </div>
      <div className="wall-reflection wall-reflection-right" aria-hidden="true">
        <ProductArtwork product={product} reflection />
      </div>
    </>}
    <div className="chamber-art">
      <ProductArtwork product={product} original={original} transition={transition} reflection={reflection} />
    </div>
  </>;
}

export function Chamber({
  product,
  children,
  className = "",
  original = false,
  transition = false,
}) {
  return (
    <div
      className={`chamber ${className} ${original ? "original-view" : ""}`}
      style={{ "--tone": product.tone || "#b7ad9a" }}
    >
      <div className="chamber-scene">
        <NicheScene product={product} original={original} transition={transition} />
      </div>
      {!original && (
        <div className="niche-reflection" aria-hidden="true">
          {["near", "middle", "far"].map((distance) => (
            <div className={`reflection-band reflection-${distance}`} key={distance}>
              <div className="chamber-scene mirrored-scene">
                <NicheScene product={product} reflection />
              </div>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
