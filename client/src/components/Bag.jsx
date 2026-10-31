import React, { useEffect, useRef } from "react";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { ProductArtwork } from "./ProductArtwork.jsx";
import { Quantity } from "./ProductDetail.jsx";

export default function Bag({
  open,
  close,
  lines,
  setLines,
  products,
  money,
  followProduct,
  storageWarning,
}) {
  const dialog = useRef(null);
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce(
    (sum, line) =>
      sum +
      products.find((product) => product.id === line.productId).price *
        line.quantity,
    0,
  );
  return (
    <dialog
      ref={dialog}
      className="cart-dialog"
      aria-labelledby="bag-title"
      onCancel={close}
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="cart-panel">
        <div className="cart-header">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h2 id="bag-title">
              The bag <span>({count})</span>
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close shopping bag"
            onClick={close}
          >
            <X size={20} />
          </button>
        </div>
        {lines.length ? (
          <>
            <div className="cart-items">
              {lines.map((line) => {
                const product = products.find(
                  (product) => product.id === line.productId,
                );
                return (
                  <div className="cart-line" key={line.key}>
                    <button
                      className="cart-image"
                      aria-label={`View ${product.name}`}
                      onClick={() => {
                        close();
                        followProduct(`/products/${product.id}`);
                      }}
                    >
                      <ProductArtwork product={product} />
                    </button>
                    <div className="cart-line-info">
                      <div className="line-heading">
                        <h3>{product.name}</h3>
                        <span>{money(product.price * line.quantity)}</span>
                      </div>
                      <p>
                        {Object.entries(line.options)
                          .map(([name, value]) => `${name}: ${value}`)
                          .join(" · ")}
                      </p>
                      <div className="line-actions">
                        <Quantity
                          label={`${product.name} quantity`}
                          value={line.quantity}
                          onChange={(quantity) =>
                            setLines((lines) =>
                              lines.map((item) =>
                                item.key === line.key
                                  ? { ...item, quantity }
                                  : item,
                              ),
                            )
                          }
                        />
                        <button
                          className="remove-link"
                          aria-label={`Remove ${product.name} from bag`}
                          onClick={() =>
                            setLines((lines) =>
                              lines.filter((item) => item.key !== line.key),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary">
              <div className="subtotal">
                <span>Subtotal</span>
                <strong>{money(total)}</strong>
              </div>
              <p>
                This is a preview store. Checkout and payments will be added
                later.
              </p>
              {storageWarning && (
                <p role="status">
                  Your browser couldn't save this bag. It will last for this
                  visit.
                </p>
              )}
              <button className="primary" onClick={close}>
                Continue exploring <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-bag">
            <ShoppingBag size={42} strokeWidth={0.7} />
            <h3>A space for something timeless.</h3>
            <p>Your bag is waiting for its first piece.</p>
            <button
              className="primary"
              onClick={() => {
                close();
                followProduct("/");
              }}
            >
              Discover the collection <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
