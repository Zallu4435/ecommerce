import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import usePreventBodyScroll from "../../hooks/usePreventBodyScroll";

const SignupSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  usePreventBodyScroll(isOpen);

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  const handleGoToLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 w-12 h-12">
              <FiCheckCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Signup successful
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
              Your account has been created. Please check your Gmail for the activation link.
            </p>
          </div>
          <div className="px-6 pb-6 pt-2 flex justify-center gap-3">
            <button
              onClick={handleGoToLogin}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Go to login
            </button>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Go to home
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SignupSuccessModal;
