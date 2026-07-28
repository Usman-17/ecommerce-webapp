import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
// Imports End----

const MIN_APPEAR_DELAY = 20000;
const MAX_APPEAR_DELAY = 35000;
const MIN_VISIBLE_DURATION = 4000;
const MAX_VISIBLE_DURATION = 6000;

const getRandomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const popupAnimation = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 80 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

const PurchasePopup = ({ products = [] }) => {
  const safeProducts = useMemo(() => {
    const rawProducts = Array.isArray(products) ? products : [];
    return rawProducts.flatMap((product) =>
      product?.title && product?.productImages?.[0]?.url
        ? [
            {
              id: product.slug,
              href: `/product/${product.slug}`,
              name: product.title,
              image: product.productImages[0].url,
            },
          ]
        : [],
    );
  }, [products]);

  const [isVisible, setIsVisible] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const timerRef = useRef(null);
  const isHoveredRef = useRef(false);
  const recentIndicesRef = useRef([]);
  const productsRef = useRef(safeProducts);

  useEffect(() => {
    productsRef.current = safeProducts;
  }, [safeProducts]);

  useEffect(() => {
    const hasProducts = safeProducts.length > 0;
    if (!hasProducts) return;

    const clearActiveTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const schedulePopup = (delay, action) => {
      clearActiveTimer();
      timerRef.current = setTimeout(action, delay);
    };

    const hidePopup = () => {
      setIsVisible(false);
      const delay = getRandomDelay(MIN_APPEAR_DELAY, MAX_APPEAR_DELAY);
      schedulePopup(delay, showNextPopup);
    };

    const showNextPopup = () => {
      if (isHoveredRef.current || document.hidden) {
        schedulePopup(2000, showNextPopup);
        return;
      }

      const currentProducts = productsRef.current;
      if (!currentProducts.length) return;

      const totalItems = currentProducts.length;
      const maxHistory = Math.max(1, Math.min(Math.floor(totalItems * 0.4), 5));

      let availableIndices = currentProducts
        .map((_, i) => i)
        .filter((i) => !recentIndicesRef.current.includes(i));

      if (availableIndices.length === 0) {
        recentIndicesRef.current = [];
        availableIndices = currentProducts.map((_, i) => i);
      }

      const randomIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
      recentIndicesRef.current = [
        ...recentIndicesRef.current.slice(-(maxHistory - 1)),
        randomIndex,
      ];

      setActiveProduct(currentProducts[randomIndex]);
      setIsVisible(true);

      const duration = getRandomDelay(
        MIN_VISIBLE_DURATION,
        MAX_VISIBLE_DURATION,
      );
      schedulePopup(duration, hidePopup);
    };

    schedulePopup(getRandomDelay(3000, 6000), showNextPopup);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearActiveTimer();
      } else {
        schedulePopup(2000, () => {
          setIsVisible(false);
          schedulePopup(2000, showNextPopup);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearActiveTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeProducts.length > 0]);

  const pauseTimeline = () => {
    isHoveredRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  if (safeProducts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] sm:bottom-6 sm:left-6 sm:w-auto hidden lg:block">
      <AnimatePresence mode="wait">
        {isVisible && activeProduct && (
          <Motion.div
            key={activeProduct.id}
            {...popupAnimation}
            className="pointer-events-auto block w-full max-w-73 group sm:w-73"
            onMouseEnter={pauseTimeline}
            onMouseLeave={() => {
              isHoveredRef.current = false;
              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => setIsVisible(false), 2000);
            }}
          >
            <Link
              to={activeProduct.href}
              className="relative block overflow-hidden rounded-xl border border-gray-100 bg-white p-3.5 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)] ring-1 ring-black/5 focus:outline-none focus-visible:ring-offset-2"
              aria-label={`View product: ${activeProduct.name}`}
            >
              <div className="relative flex items-start gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[18px]">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      <span className="relative flex size-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                      </span>
                      Live
                    </div>

                    <span className="rounded-full bg-slate-0 px-2 py-1 text-[10px] font-medium text-gray-600">
                      Just now
                    </span>
                  </div>

                  <p className="text-[12px] font-medium leading-5 text-gray-600">
                    Someone just purchased
                  </p>

                  <h3 className="mt-0.5 line-clamp-1 text-sm font-bold leading-5 text-gray-900">
                    {activeProduct.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span />
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white transition-transform duration-300 group-hover:translate-x-0.5">
                      View item
                      <span aria-hidden="true">{">"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PurchasePopup;
