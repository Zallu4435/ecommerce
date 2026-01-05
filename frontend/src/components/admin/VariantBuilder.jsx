import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, X, Edit } from "lucide-react";
import { toast } from "react-toastify";
import ImageInput from "../ImageInput";
import ConfirmDeleteModal from "../../modal/admin/ConfirmDeleteModal";

const COLORS = [
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "pink", label: "Pink" },
    { value: "orange", label: "Orange" },
    { value: "purple", label: "Purple" },
    { value: "brown", label: "Brown" },
    { value: "gray", label: "Gray" },
    { value: "navy", label: "Navy" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const VariantBuilder = ({ variants = [], onChange, basePrice = 0, baseOfferPrice = 0 }) => {
    const [variantList, setVariantList] = useState(variants);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null);

    useEffect(() => {
        setVariantList(variants);
    }, [variants]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const addVariant = () => {
        const newVariant = {
            color: "",
            size: "",
            stockQuantity: 0,
            price: basePrice || 0,
            offerPrice: baseOfferPrice || 0,
            image: "",
            isActive: true,
            _tempId: Date.now(),
        };
        const updated = [...variantList, newVariant];
        setVariantList(updated);
        onChange(updated);
    };

    const removeVariant = (index) => {
        setVariantToDelete(index);
        setShowDeleteModal(true);
    };

    const confirmRemoveVariant = () => {
        if (variantToDelete !== null) {
            const updated = variantList.filter((_, i) => i !== variantToDelete);
            setVariantList(updated);
            onChange(updated);
            setShowDeleteModal(false);
            setVariantToDelete(null);
        }
    };

    const updateVariant = (index, field, value) => {
        const updated = [...variantList];
        updated[index] = { ...updated[index], [field]: value };
        setVariantList(updated);
        onChange(updated);
    };

    const checkDuplicate = (index) => {
        const current = variantList[index];
        if (!current.color || !current.size) return false;

        const duplicate = variantList.some((v, i) => {
            if (i === index) return false;
            return v.color === current.color && v.size === current.size;
        });

        if (duplicate) {
            toast.error(`Duplicate variant: ${current.color} + ${current.size}`);
            return true;
        }
        return false;
    };

    const totalStock = variantList.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
    const usedColors = [...new Set(variantList.filter(v => v.color).map(v => v.color))];
    const usedSizes = [...new Set(variantList.filter(v => v.size).map(v => v.size))];

    return (
        <div className="w-full">
            {/* Compact Summary View */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold dark:text-white text-gray-800 mb-1">
                            Product Variants *
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Variants: <strong className="text-orange-600 dark:text-orange-400">{variantList.length}</strong></span>
                            <span>Total Stock: <strong className="text-orange-600 dark:text-orange-400">{totalStock}</strong></span>
                            {variantList.length > 0 && (
                                <>
                                    <span>Colors: <strong>{usedColors.length}</strong></span>
                                    <span>Sizes: <strong>{usedSizes.length}</strong></span>
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                        <Edit size={18} />
                        {variantList.length === 0 ? "Add Variants" : "Manage Variants"}
                    </button>
                </div>

                {/* Validation Message */}
                {variantList.length === 0 && (
                    <p className="mt-2 text-sm text-red-500">
                        At least one variant is required
                    </p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-orange-500 dark:bg-red-600 text-white px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Manage Product Variants</h2>
                                <p className="text-sm text-orange-100 dark:text-red-100">Add and configure color/size combinations</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Summary Stats */}
                            {variantList.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    <div className="bg-orange-50 dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Variants</p>
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{variantList.length}</p>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Stock</p>
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalStock}</p>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Colors</p>
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{usedColors.length}</p>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Sizes</p>
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{usedSizes.length}</p>
                                    </div>
                                </div>
                            )}

                            {/* Add Variant Button */}
                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    <Plus size={18} />
                                    Add Variant
                                </button>
                            </div>

                            {/* Variants List */}
                            {variantList.length === 0 ? (
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400 mb-3">No variants added yet</p>
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        <Plus size={18} />
                                        Add First Variant
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {variantList.map((variant, index) => (
                                        <div
                                            key={variant._id || variant._tempId || index}
                                            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-red-500 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Index */}
                                                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 dark:bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>

                                                {/* Form Fields - 2 Rows Layout */}
                                                <div className="flex-1 space-y-3">
                                                    {/* Header: SKU and Status */}
                                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-xs">
                                                        <div className="font-mono text-gray-500 dark:text-gray-400">
                                                            {variant.sku ? <span>SKU: {variant.sku}</span> : <span className="italic opacity-50">New Variant (Auto-SKU)</span>}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                                                <div className="relative">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={variant.isActive !== false} // Default to true if undefined
                                                                        onChange={(e) => updateVariant(index, "isActive", e.target.checked)}
                                                                    />
                                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                                                </div>
                                                                <span className={`font-medium ${variant.isActive !== false ? 'text-green-600' : 'text-gray-500'}`}>
                                                                    {variant.isActive !== false ? "Active" : "Inactive"}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {/* Row 1: Color, Size, Stock */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {/* Color */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Color *
                                                            </label>
                                                            <select
                                                                value={variant.color}
                                                                onChange={(e) => updateVariant(index, "color", e.target.value)}
                                                                onBlur={() => checkDuplicate(index)}
                                                                className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                required
                                                            >
                                                                <option value="">Select</option>
                                                                {COLORS.map((color) => (
                                                                    <option key={color.value} value={color.value}>
                                                                        {color.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Size */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Size *
                                                            </label>
                                                            <select
                                                                value={variant.size}
                                                                onChange={(e) => updateVariant(index, "size", e.target.value)}
                                                                onBlur={() => checkDuplicate(index)}
                                                                className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                required
                                                            >
                                                                <option value="">Select</option>
                                                                {SIZES.map((size) => (
                                                                    <option key={size} value={size}>
                                                                        {size}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Stock */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Stock *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={variant.stockQuantity}
                                                                onChange={(e) => updateVariant(index, "stockQuantity", Number(e.target.value))}
                                                                className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Row 2: Price, Offer, Image */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {/* Price */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Price
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={variant.price || ""}
                                                                onChange={(e) => updateVariant(index, "price", e.target.value ? Number(e.target.value) : undefined)}
                                                                placeholder={basePrice || "Base"}
                                                                className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                            />
                                                        </div>

                                                        {/* Offer Price */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Offer
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={variant.offerPrice || ""}
                                                                onChange={(e) => updateVariant(index, "offerPrice", e.target.value ? Number(e.target.value) : undefined)}
                                                                placeholder={baseOfferPrice || "Base"}
                                                                className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                            />
                                                        </div>

                                                        {/* Image */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Image
                                                            </label>
                                                            {variant.image ? (
                                                                <div className="relative inline-block">
                                                                    <img
                                                                        src={typeof variant.image === 'string' ? variant.image : URL.createObjectURL(variant.image)}
                                                                        alt="Variant"
                                                                        className="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateVariant(index, "image", "")}
                                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <ImageInput
                                                                    onChange={(file) => updateVariant(index, "image", file)}
                                                                    buttonText={<Upload size={14} />}
                                                                    className="px-2 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                    title="Remove variant"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {variantList.length} variant{variantList.length !== 1 ? 's' : ''} configured
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmRemoveVariant}
                itemName={variantToDelete !== null && variantList[variantToDelete] ? `${variantList[variantToDelete].color} - ${variantList[variantToDelete].size}` : "this variant"}
            />
        </div>
    );
};

export default VariantBuilder;
