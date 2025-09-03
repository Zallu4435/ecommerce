
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-[1px] flex items-center justify-center z-50">
      <span className="sr-only">Loading...</span>
      <div className="w-12 h-12 rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-transparent dark:border-t-transparent animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
