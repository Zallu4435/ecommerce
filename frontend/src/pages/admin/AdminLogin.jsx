const AdminLogin = () => {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="dark:bg-gray-800 bg-orange-50 p-8 rounded-lg shadow-xl w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
          <h2 className="text-3xl text-center text-gray-600 font-bold dark:text-white mb-8">Admin Login</h2>
  
          <form action="#" method="POST">
            <div className="mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 border border-gray-600 rounded-md dark:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg"
              />
            </div>
  
            <div className="mb-6">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-4 border border-gray-600 rounded-md dark:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg"
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-3 font-bold dark:bg-blue-600 bg-orange-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    );
  };
  
  export default AdminLogin;
  