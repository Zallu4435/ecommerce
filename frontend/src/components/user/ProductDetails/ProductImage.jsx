import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const ProductImage = ({ image, variantImages }) => {
  const [mainImage, setMainImage] = useState(image);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setMainImage(image);
  }, [image]);

  const allImages = [image, ...(variantImages || [])].filter(Boolean);

  const handleImageClick = (img, index) => {
    setMainImage(img);
    setSelectedIndex(index);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden group">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={3}
          wheel={{ step: 0.1 }}
          doubleClick={{ mode: "reset" }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <img
                  src={mainImage || "https://via.placeholder.com/600"}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </TransformComponent>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => zoomIn()}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Reset zoom"
                >
                  <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(img, index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${(selectedIndex === index || (selectedIndex === -1 && index === 0))
                ? "border-blue-600 dark:border-blue-400 ring-2 ring-blue-600/20 dark:ring-blue-400/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <img
                src={img}
                alt={`View ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Hint Text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Click and drag to pan • Scroll to zoom • Double-click to reset
      </p>
    </div>
  );
};

export default ProductImage;
