
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-24 h-24">
        <div className="absolute border-t-4 border-blue-400 w-24 h-24 rounded-full animate-spin"></div>
        <div className="absolute border-t-4 border-green-400 w-20 h-20 top-2 left-2 rounded-full animate-spin delay-150"></div>
        <div className="absolute border-t-4 border-red-400 w-16 h-16 top-4 left-4 rounded-full animate-spin delay-300"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
