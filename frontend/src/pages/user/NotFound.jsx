import { Link } from "react-router-dom";
import { notFound as notFoundImage } from "../../assets/images";

const NotFound = ({ notFound }) => {
  const linkDestination = notFound === 2 ? "/admin/dashboard" : "/";

  const containerClasses = `flex flex-col items-center justify-center p-4 ${
    notFound === 1
      ? "h-auto min-h-[300px] bg-transparent text-gray-800 dark:text-gray-100"
      : notFound === 2
      ? "min-h-screen dark:bg-gray-900 text-gray-800 dark:text-gray-100"
      : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
  }`;

  const imageClasses = `${
    notFound === 1
      ? "w-[350px] h-auto mb-4"
      : notFound === 2
      ? "w-[400px] mb-8"
      : "w-[500px] h-auto mb-4 "
  }`;

  const headingClasses = `${
    notFound === 1
      ? "text-2xl sm:text-3xl font-bold text-center mb-2"
      : notFound === 2
      ? "text-4xl sm:text-5xl font-bold text-center mb-4"
      : "text-4xl sm:text-5xl font-bold  text-center mb-4"
  }`;

  const descriptionClasses = `${
    notFound === 1
      ? "text-base sm:text-lg text-center mb-4"
      : notFound === 2
      ? "text-lg sm:text-xl text-center mb-8"
      : "text-lg sm:text-xl text-center mb-8"
  }`;

  const buttonClasses = `${
    notFound === 1
      ? "px-4 py-2 bg-pink-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-pink-600 transition duration-300"
      : notFound === 2
      ? "px-6 py-3 bg-pink-500  text-white text-lg sm:text-xl font-semibold rounded-lg hover:bg-pink-600 transition duration-300"
      : "px-6 py-3 bg-pink-500  text-white text-lg sm:text-xl font-semibold rounded-lg hover:bg-pink-600 transition duration-300"
  }`;

  return (
    <div className={containerClasses}>
      <img src={notFoundImage} alt="404" className={imageClasses} />
      <h1 className={headingClasses}>Oops! Page Not Found</h1>
      <p className={descriptionClasses}>
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link to={linkDestination} className={buttonClasses}>
        {notFound === 2 ? "Go to Dashboard" : "Go to Homepage"}
      </Link>
    </div>
  );
};

export default NotFound;
