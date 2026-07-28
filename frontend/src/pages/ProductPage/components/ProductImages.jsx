import { motion as Motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
// Imports End-------

const ProductImages = ({ images, activeVariantImage }) => {
  const thumbnailRefs = useRef([]);
  const imageWrapperRef = useRef(null);
  const thumbnailContainerRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [prevVariantImage, setPrevVariantImage] = useState(activeVariantImage);
  const [hasScrolledThumbnails, setHasScrolledThumbnails] = useState(false);

  // Push history state when lightbox opens so back button closes it
  useEffect(() => {
    if (lightboxOpen) {
      window.history.pushState({ lightbox: true }, "");
      const handlePopState = () => setLightboxOpen(false);
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [lightboxOpen]);

  const pauseAutoplay = () => {
    setIsAutoPlay(false);
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    autoplayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlay(true);
    }, 2000);
  };

  // Sync index with active variant
  if (activeVariantImage !== prevVariantImage) {
    setPrevVariantImage(activeVariantImage);
    if (activeVariantImage) {
      const idx = images.findIndex(
        (img) =>
          (img.url || img) === activeVariantImage,
      );
      setSelectedImageIndex(idx !== -1 ? idx : -1);
      setIsAutoPlay(false);
    }
  }

  useEffect(() => {
    if (
      !isAutoPlay ||
      images.length <= 1 ||
      lightboxOpen ||
      isHovered ||
      selectedImageIndex === -1
    )
      return;

    const interval = setInterval(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, lightboxOpen, isHovered, isAutoPlay, selectedImageIndex]);

  // Scrolling Thumbnails
  useEffect(() => {
    if (
      thumbnailContainerRef.current &&
      thumbnailRefs.current[selectedImageIndex]
    ) {
      const container = thumbnailContainerRef.current;
      const thumbnail = thumbnailRefs.current[selectedImageIndex];

      // Vertical scroll (Desktop) - keep within bounds, don't go above top
      const containerHeight = container.offsetHeight;
      const thumbnailTop = thumbnail.offsetTop;
      const maxScroll = container.scrollHeight - containerHeight;
      const scrollTop = Math.min(thumbnailTop, maxScroll);

      // Horizontal scroll (Mobile)
      const containerWidth = container.offsetWidth;
      const thumbnailLeft = thumbnail.offsetLeft;
      const maxScrollLeft = container.scrollWidth - containerWidth;
      const scrollLeft = Math.min(thumbnailLeft, maxScrollLeft);

      container.scrollTo({
        top: scrollTop,
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedImageIndex]);

  // Track thumbnail scroll to hide +N badge
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setHasScrolledThumbnails(container.scrollLeft > 10);
      } else {
        setHasScrolledThumbnails(container.scrollTop > 10);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Image Swipe Handler ---
  const handleNextImage = () => {
    pauseAutoplay();
    if (images.length > 0) {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    pauseAutoplay();
    if (images.length > 0) {
      setSelectedImageIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
    }
  };

  const handleDragEnd = (event, info) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 50;

    if (swipe > swipeThreshold || velocity > 500) {
      handlePrevImage();
    } else if (swipe < -swipeThreshold || velocity < -500) {
      handleNextImage();
    }
  };

  return (
    <>
      <div
        className="flex flex-col md:flex-row gap-1 md:gap-0 w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={imageWrapperRef}
      >
        {/* Small Images */}
        {images.length > 1 && (
          <div className="relative w-full md:w-30 group/thumb order-2 md:order-0">
            {/* Desktop Arrows */}
            {images.length > 4 && (
              <>
                <button
                  onClick={() => {
                    const container = thumbnailContainerRef.current;
                    if (container)
                      container.scrollBy({ top: -80, behavior: "smooth" });
                  }}
                  className="hidden md:flex absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white/90 shadow items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200"
                >
                  <ChevronLeft size={14} className="rotate-90" />
                </button>
                <button
                  onClick={() => {
                    const container = thumbnailContainerRef.current;
                    if (container)
                      container.scrollBy({ top: 80, behavior: "smooth" });
                  }}
                  className="hidden md:flex absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white/90 shadow items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200"
                >
                  <ChevronRight size={14} className="rotate-90" />
                </button>
              </>
            )}

            <div
              ref={thumbnailContainerRef}
              className="flex gap-2 sm:gap-3 md:flex-col w-full overflow-x-auto md:overflow-y-auto no-scrollbar scroll-smooth p-1 md:p-2 md:max-h-[calc(4*6rem+3*0.75rem)] lg:max-h-[calc(4*7rem+3*0.75rem)]"
            >
              {images.map((img, i) => {
                const isFourth = i === 3;
                const remaining = images.length - 4;
                const showCount =
                  isFourth && remaining > 0 && !hasScrolledThumbnails;

                return (
                  <div
                    key={i}
                    className="relative shrink-0 w-[calc(25%-6px)] sm:w-[calc(25%-8px)] md:w-full md:shrink"
                  >
                    <img
                      ref={(el) => (thumbnailRefs.current[i] = el)}
                      src={img.url || img}
                      alt={`Thumbnail ${i}`}
                      onClick={() => {
                        setSelectedImageIndex(i);
                        pauseAutoplay();
                      }}
                      className={`w-full h-20 sm:h-20 md:h-24 lg:h-26 cursor-pointer rounded-sm transition-all duration-300 object-contain bg-[#fffaf5] ${
                        selectedImageIndex === i
                          ? "ring-1 ring-[#CC0D39] shadow-sm"
                          : "border-gray-100 hover:scale-102"
                      }`}
                    />
                    {showCount && (
                      <div
                        onClick={() => {
                          const container = thumbnailContainerRef.current;
                          if (container) {
                            container.scrollBy({
                              left: 80,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-sm cursor-pointer transition-all duration-200 hover:bg-black/50 md:hidden"
                      >
                        <span className="text-white font-bold text-base leading-none">
                          +{remaining}
                        </span>
                        <span className="text-white/80 text-[9px] font-medium mt-0.5">
                          more
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Image */}
        <div className="flex-1 rounded-lg relative group order-1 md:order-0">
          <Motion.div
            className="w-full relative"
            drag="x"
            dragConstraints={imageWrapperRef}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ touchAction: "none" }}
          >
            <div className="relative w-full h-84 sm:h-80 lg:h-96 xl:h-122 mt-1.5">
              {images.map((img, idx) => {
                const src = img.url || img;
                const isActive =
                  selectedImageIndex === idx ||
                  (selectedImageIndex === -1 && src === activeVariantImage);
                return (
                  <img
                    key={idx}
                    src={src}
                    alt={`Product image ${idx + 1}`}
                    onClick={() => setLightboxOpen(true)}
                    className={`absolute inset-0 w-full h-full rounded-md object-cover cursor-zoom-in transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    draggable={false}
                  />
                );
              })}
              {selectedImageIndex === -1 &&
                activeVariantImage &&
                !images.some(
                  (img) =>
                    (img.url || img) ===
                    activeVariantImage,
                ) && (
                  <img
                    src={activeVariantImage}
                    alt="Variant"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute inset-0 w-full h-full rounded-md object-cover cursor-zoom-in opacity-100"
                    draggable={false}
                  />
                )}
            </div>
          </Motion.div>
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] font-medium px-2 py-1 rounded-full z-10">
              {selectedImageIndex + 1}/{images.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white shadow-md text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white shadow-md text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Dot Slider Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(i);
                    pauseAutoplay();
                  }}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label={`Go to image ${i + 1}`}
                >
                  <div
                    className={`transition-all duration-300 rounded-full ${
                      selectedImageIndex === i
                        ? "w-5 h-1.5 bg-accent"
                        : "w-1.5 h-1.5 bg-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedImageIndex}
        slides={images.map((img) => ({
          src: img.url || img,
        }))}
        plugins={[Fullscreen, Zoom, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 1.2 }}
        thumbnails={{
          position: "bottom",
          width: 100,
          height: 70,
          border: 2,
          borderColor: "transparent",
          borderRadius: 12,
          padding: 0,
          gap: 10,
          imageFit: "cover",
        }}
        styles={{ thumbnail: { borderRadius: 12 } }}
        on={{
          view: ({ index }) => setSelectedImageIndex(index),
        }}
      />
    </>
  );
};

export default ProductImages;
