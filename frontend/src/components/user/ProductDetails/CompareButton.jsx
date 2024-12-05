import React from 'react';

const CompareButton = () => {
  const handleCompare = () => {
    alert('Comparing products');
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleCompare}
        className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600"
      >
        Compare with Other Products 🔍
      </button>
    </div>
  );
};

export default CompareButton;
