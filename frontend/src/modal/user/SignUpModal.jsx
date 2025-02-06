import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-gradient-to-r from-red-400 via-purple-500 to-pink-500 p-10 rounded-2xl max-w-xl w-full shadow-2xl text-center transform transition-all duration-500 ease-in-out scale-100 hover:scale-105 dark:bg-gray-900 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
          <h2 className="text-4xl font-extrabold text-white mb-6 animate-bounce">
            🎉 Signup Successful!
          </h2>
          <p className="text-xl text-white mb-8 animate-pulse">
            🎊 Congratulations! Your account has been created.
          </p>
          <p className="text-xl text-white mb-8">
            Check your Gmail for the access token to activate your account.
          </p>
          <button
            onClick={handleClose}
            className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-600 transition duration-300 shadow-lg mb-4 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  );
};

export default SignupSuccessModal;
