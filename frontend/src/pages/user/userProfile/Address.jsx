import { useState } from "react";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useEditAddressMutation,
  useRemoveAddressMutation,
  useSetPrimaryAddressMutation,
} from "../../../redux/apiSliceFeatures/userProfileApi";
import AddressModal from "../../../modal/user/AddressModal";
import { toast } from 'react-toastify';
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Home,
  Building,
  Phone,
  Navigation,
  CheckCircle2
} from "lucide-react";

const AddressPage = () => {
  const { data: addresses, isLoading, isError } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [editAddress] = useEditAddressMutation();
  const [removeAddress] = useRemoveAddressMutation();
  const [setPrimaryAddress] = useSetPrimaryAddressMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    zipCode: "",
    house: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    isPrimary: false,
    editing: false,
  });

  const handleAddAddress = async (validated) => {
    if (addresses.length >= 7) {
      toast.warning("You can only add up to 7 addresses.");
      return;
    }
    try {
      await addAddress(validated).unwrap();
      toast.success('Address added successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add address');
    }
  };

  const handleEditAddress = (address) => {
    setEditingId(address._id);
    setFormData({
      ...address,
      zipCode: address.zipCode ? String(address.zipCode) : "",
      editing: true
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (validated) => {
    try {
      await editAddress({
        id: editingId,
        updatedAddress: validated,
      }).unwrap();
      setIsModalOpen(false);
      setEditingId(null);
      toast.success('Address updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to edit');
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      await removeAddress(id).unwrap();
      toast.success('Address removed successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to remove address');
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await setPrimaryAddress(id).unwrap();
      toast.success('Primary address updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to set primary address');
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      fullName: "",
      phone: "",
      zipCode: "",
      house: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      isPrimary: false,
      editing: false,
    });
    setIsModalOpen(true);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-900 p-12 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 text-center shadow-xl">
        <MapPin className="w-16 h-16 text-red-500 mb-6 mx-auto opacity-50" />
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Ops! Something went wrong</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Could not load your addresses at this time.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all"
        >
          Try Refreshing
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8 lg:p-12 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Delivery Locations</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">Manage your delivery locations for faster checkout</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-blue-600/20 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Address
          </button>
        </div>

        {addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`relative bg-white dark:bg-gray-900 rounded-[2rem] p-8 border-2 transition-all duration-500 flex flex-col h-full ${address.isPrimary
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/10'
                    : 'border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-gray-700'
                  }`}
              >
                {/* Primary Badge - Overlapping Top Border */}
                {address.isPrimary && (
                  <div className="absolute -top-[18px] left-10 px-4 py-1.5 bg-blue-600 dark:bg-blue-600 text-white text-[10px] font-black rounded-xl shadow-lg flex items-center gap-2 uppercase tracking-[0.15em] border border-white/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Primary
                  </div>
                )}

                {/* Card Header: Icon & Profile Info */}
                <div className="flex items-start gap-5 mb-8">
                  <div className={`p-4 rounded-2xl shrink-0 ${address.isPrimary ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                      {address.fullName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Phone className="w-3.5 h-3.5 opacity-60" />
                      {address.phone}
                    </div>
                  </div>
                </div>

                {/* Detail View */}
                <div className="space-y-6 flex-grow">
                  <div className="flex gap-4">
                    <div className="w-[1.5px] bg-gray-100 dark:bg-gray-800" />
                    <div className="space-y-4 py-1">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {address.house}, {address.street}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {address.city}, {address.state} - <span className="text-gray-500 dark:text-gray-400 font-medium">{address.zipCode}</span>
                        </span>
                      </div>

                      {address.landmark && (
                        <div className="pl-8 text-xs text-gray-400 dark:text-gray-500 italic mt-[-10px]">
                          Near {address.landmark}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between gap-2 mt-10 min-w-0">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="flex-grow flex items-center justify-center gap-2 px-4 py-4 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-2xl transition-all duration-300 font-bold text-sm group whitespace-nowrap min-w-0"
                  >
                    <Pencil className="w-5 h-5 opacity-80 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="truncate">Edit Address</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleRemoveAddress(address._id)}
                      disabled={address.isPrimary}
                      className={`p-3.5 rounded-2xl transition-all duration-300 ${address.isPrimary
                          ? 'opacity-20 cursor-not-allowed text-gray-300 dark:text-gray-600'
                          : 'bg-transparent text-gray-400 dark:text-gray-500 hover:bg-red-500/10 hover:text-red-500'
                        }`}
                      title={address.isPrimary ? "Primary address cannot be deleted" : "Remove address"}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {!address.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(address._id)}
                        className="p-3.5 rounded-2xl text-gray-400 dark:text-gray-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all duration-300"
                        title="Set as Default"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800/50 shadow-sm">
            <div className="bg-gray-50 dark:bg-gray-800 p-10 rounded-[2.5rem] mb-10">
              <MapPin className="w-16 h-16 text-blue-500 opacity-50" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 text-center">No Saved Addresses</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-12 text-lg px-6">
              You haven't saved any addresses yet. Add one to start shopping!
            </p>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-bold transition-all shadow-2xl shadow-blue-600/30"
            >
              <Plus className="w-6 h-6" />
              Add First Address
            </button>
          </div>
        )}

        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={editingId ? handleSaveEdit : handleAddAddress}
          formData={formData}
        />
      </div>
    </div>
  );
};

export default AddressPage;