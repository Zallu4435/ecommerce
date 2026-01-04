import { useState, useEffect, useRef, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io"
import { SiPlatformdotsh } from "react-icons/si"
import { IoMoonSharp } from "react-icons/io5"
import { BsSun } from "react-icons/bs"
import { FaMale, FaFemale, FaChild } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
import { toggleTheme } from "../../redux/slice/themeSlice"
import { clearCredentials } from "../../redux/slice/userSlice"
import { useLogoutUserMutation } from "../../redux/apiSliceFeatures/userApiSlice"
import { toast } from "react-toastify"

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutUser] = useLogoutUserMutation()

  const scrolled = useSelector((state) => state.root.scroll.scrolled)
  const theme = useSelector((state) => state.root.theme.theme)
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown)
  }

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap()
      // Disable Google auto-select if user logged in with Google
      if (window.google) {
        window.google.accounts.id.disableAutoSelect()
      }
      dispatch(clearCredentials())
      setMenuOpen(false)
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  const handleLoginClick = () => {
    setMenuOpen(false)
    navigate("/login")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Memoize categories array to prevent recreation on every render
  const categories = useMemo(() => [
    { path: "/shop?category=men", label: "Mens", icon: <FaMale /> },
    { path: "/shop?category=women", label: "Womens", icon: <FaFemale /> },
    { path: "/shop?category=child", label: "Childrens", icon: <FaChild /> },
  ], [])

  // Memoize navLinks array to prevent recreation on every render
  const navLinks = useMemo(() => [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact Us" },
  ], [])

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category.toLowerCase()}`)
    setShowDropdown(false)
    setMenuOpen(false)
  }

  return (
    <nav
      className={`${scrolled ? "fixed top-0 left-0 right-0 shadow-lg" : "relative"
        } bg-gray-800 dark:bg-gray-50 dark:text-gray-900 text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between z-40 transition-all duration-300`}
    >
      <div className="flex items-center justify-between w-full md:w-auto">
        <button
          className="md:hidden focus:outline-none text-2xl"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-white dark:text-gray-900 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Mobile Theme Toggle and Auth Buttons */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={handleThemeToggle}
            className="p-2.5 rounded-lg bg-yellow-500 dark:bg-indigo-600 hover:bg-yellow-600 dark:hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-indigo-400 shadow-md"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <BsSun className="w-5 h-5 text-white" />
            ) : (
              <IoMoonSharp className="w-5 h-5 text-gray-900" />
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <div
        ref={menuRef}
        className={`${menuOpen ? "flex" : "hidden"
          } flex-col md:flex md:flex-row md:items-center md:justify-between w-full mt-4 md:mt-0`}
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-white dark:text-gray-900 focus:outline-none flex items-center text-sm gap-1 font-bold mb-2 md:mb-0 hover:text-yellow-500 dark:hover:text-yellow-600 transition-colors duration-200"
              onClick={handleDropdownToggle}
            >
              <SiPlatformdotsh />
              Categories
              <IoIosArrowDown className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDropdown && (
              <div className="md:absolute z-10 top-full left-0 md:left-auto mt-2 w-full md:w-52 bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 p-3 rounded-lg shadow-xl animate-fadeIn">
                {categories.map((category) => (
                  <button
                    key={category.path}
                    onClick={() => handleCategoryClick(category.label)}
                    className="w-full flex items-center text-sm md:text-base text-left px-4 py-2 rounded-md hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                  >
                    {category.icon}
                    <span className="ml-2">{category.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-base md:text-sm hover:text-yellow-500 dark:hover:text-yellow-600 py-2 md:py-0 font-medium transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Theme Toggle and Auth Buttons */}
        <div className="hidden md:flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={handleThemeToggle}
            className="p-2.5 rounded-lg bg-yellow-500 dark:bg-indigo-600 hover:bg-yellow-600 dark:hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-indigo-400 transform hover:scale-110 shadow-md"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <BsSun className="w-5 h-5 text-white" />
            ) : (
              <IoMoonSharp className="w-5 h-5 text-gray-900" />
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

