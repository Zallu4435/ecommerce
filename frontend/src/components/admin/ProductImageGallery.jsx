import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ProductImageGallery = ({ product }) => {
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Collect all images with their labels
    const imageData = [
        {
            url: product.image,
            label: "Main Product Image",
            type: "main"
        },
        ...(product.variants || [])
            .filter(v => v.image) // Only variants with images
            .map(v => ({
                url: v.image,
                label: `${v.color.charAt(0).toUpperCase() + v.color.slice(1)} - ${v.size} Variant`,
                type: "variant",
                variant: v
            }))
    ].filter(img => img.url); // Remove any without URLs

    const allImages = imageData.map(img => img.url);
    const currentImageData = imageData[mainImageIndex];

    return (
        <div className="flex gap-4 h-full">
            {/* Thumbnail List - Vertical on Left */}
            {allImages.length > 1 && (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-orange-400 dark:scrollbar-thumb-red-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
                    {imageData.map((imgData, index) => (
                        <div
                            key={index}
                            onClick={() => setMainImageIndex(index)}
                            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0 relative group ${index === mainImageIndex
                                ? "border-orange-500 dark:border-red-500 shadow-lg ring-2 ring-orange-300 dark:ring-red-400"
                                : "border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-red-400"
                                }`}
                        >
                            <img
                                src={imgData.url}
                                alt={imgData.label}
                                className="w-20 h-20 object-cover"
                            />
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                {imgData.label}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Image Display with Zoom */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="relative group">
                    {/* Image Container - Fixed Height */}
                    <div className="h-[450px] w-full">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={4}
                            wheel={{ step: 0.15 }}
                            doubleClick={{ mode: "reset" }}
                            centerOnInit={true}
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    <TransformComponent
                                        wrapperClass="w-full h-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900"
                                        contentClass="w-full h-full"
                                    >
                                        <img
                                            src={allImages[mainImageIndex] || "https://via.placeholder.com/400"}
                                            alt={currentImageData?.label || product.productName}
                                            className="h-[450px] w-full object-cover"
                                        />
                                    </TransformComponent>

                                    {/* Zoom Controls */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/95 dark:bg-gray-800/95 rounded-xl p-2 shadow-xl border border-gray-200 dark:border-gray-600 z-10">
                                        <button
                                            onClick={() => zoomIn()}
                                            className="p-2.5 hover:bg-orange-100 dark:hover:bg-red-900 rounded-lg transition-colors group/btn"
                                            title="Zoom In (Scroll Up)"
                                        >
                                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover/btn:text-orange-600 dark:group-hover/btn:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => zoomOut()}
                                            className="p-2.5 hover:bg-orange-100 dark:hover:bg-red-900 rounded-lg transition-colors group/btn"
                                            title="Zoom Out (Scroll Down)"
                                        >
                                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover/btn:text-orange-600 dark:group-hover/btn:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => resetTransform()}
                                            className="p-2.5 hover:bg-orange-100 dark:hover:bg-red-900 rounded-lg transition-colors group/btn"
                                            title="Reset Zoom (Double Click)"
                                        >
                                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover/btn:text-orange-600 dark:group-hover/btn:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </TransformWrapper>
                    </div>

                    {/* Image Counter Badge */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-24 left-6 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10 backdrop-blur-sm">
                            {mainImageIndex + 1} / {allImages.length}
                        </div>
                    )}

                    {/* Navigation Arrows for Main Image */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={() => setMainImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-100 dark:hover:bg-red-900 hover:scale-110 z-10 border border-gray-200 dark:border-gray-600"
                                title="Previous Image"
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setMainImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-100 dark:hover:bg-red-900 hover:scale-110 z-10 border border-gray-200 dark:border-gray-600"
                                title="Next Image"
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Image Info - Shows which variant/product */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border-2 border-orange-200 dark:border-gray-500 shadow-sm">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">📷</span>
                                    <p className="text-base font-bold text-orange-700 dark:text-orange-400">
                                        {currentImageData?.label}
                                    </p>
                                </div>
                                {currentImageData?.type === "variant" && currentImageData?.variant && (
                                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300 mt-2 ml-8">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Stock: <span className="font-bold text-green-600 dark:text-green-400">{currentImageData.variant.stockQuantity}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            SKU: <span className="font-mono font-semibold">{currentImageData.variant.sku}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="font-medium">Scroll to zoom</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductImageGallery;
