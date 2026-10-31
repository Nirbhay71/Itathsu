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
      <div className="stone-wall" aria-hidden="true" />
      <div className="chamber-beam" aria-hidden="true" />
      <div className="light-fixture" aria-hidden="true" />
      <div className="chamber-art">
        <ProductArtwork
          product={product}
          original={original}
          transition={transition}
        />
      </div>
      {!original && (
        <div className="reflection-well" aria-hidden="true">
          <ProductArtwork product={product} reflection />
        </div>
      )}
      <div className="chamber-sill" aria-hidden="true" />
      {children}
    </div>
  );
}
