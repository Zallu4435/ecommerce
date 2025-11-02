import { toast } from 'react-toastify';

const CompareButton = () => {
  const handleCompare = () => {
    toast.info('Comparing products');
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleCompare}
        className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-300"
      >
        Compare with Other Products 🔍
      </button>
    </div>
  );
};

export default CompareButton;
