const VariantDetailsDisplay = ({ variants, totalStock, availableColors, availableSizes }) => {
    // Calculate total stock from variants to include inactive ones if displayed
    const calculatedTotalStock = variants ? variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0) : 0;

    if (!variants || variants.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            {/* Header */}
            <div className="bg-orange-500 dark:bg-red-600 rounded-t-lg p-4 shadow-md">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Product Variants
                    </h3>
                    <span className="bg-white/20 px-4 py-1 rounded-full text-white font-semibold text-sm">
                        {variants.length} Variants
                    </span>
                </div>
            </div>

            {/* Variant List */}
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {variants.map((variant, index) => (
                        <div
                            key={variant._id || index}
                            className="p-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Index */}
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-orange-500 dark:bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="flex-shrink-0">
                                    {variant.image ? (
                                        <img
                                            src={variant.image}
                                            alt={`${variant.color} ${variant.size}`}
                                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Details Grid */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {/* Color & Size */}
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Color</p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                                style={{ backgroundColor: variant.color }}
                                            ></span>
                                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">
                                                {variant.color}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Size</p>
                                        <span className="inline-block bg-orange-100 dark:bg-red-900 text-orange-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-bold">
                                            {variant.size}
                                        </span>
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stock</p>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${variant.stockQuantity > 10
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : variant.stockQuantity > 0
                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                }`}
                                        >
                                            {variant.stockQuantity}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                                        {variant.price ? (
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                ₹{variant.price}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Base Price</p>
                                        )}
                                    </div>

                                    {/* Offer Price */}
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Offer</p>
                                        {variant.offerPrice ? (
                                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                                ₹{variant.offerPrice}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Base Offer</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                        {variant.isActive !== false ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm font-semibold">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SKU - Full Width */}
                            <div className="mt-3 ml-28">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SKU: <span className="font-mono text-gray-700 dark:text-gray-300">{variant.sku}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Footer */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Total Variants</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {variants.length}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Total Stock</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {calculatedTotalStock || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Colors</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {availableColors?.length || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Sizes</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {availableSizes?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VariantDetailsDisplay;
