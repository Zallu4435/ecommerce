import { useState, useEffect, useRef, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io"
import { IoMoonSharp } from "react-icons/io5"
import { BsSun } from "react-icons/bs"
import { FaMale, FaFemale, FaChild } from "react-icons/fa"
import { Menu, X } from "lucide-react"
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

  const categories = useMemo(() => [
    { path: "/shop?category=Men", label: "Men", icon: <FaMale className="w-4 h-4" /> },
    { path: "/shop?category=Women", label: "Women", icon: <FaFemale className="w-4 h-4" /> },
    { path: "/shop?category=Child", label: "Child", icon: <FaChild className="w-4 h-4" /> },
  ], [])

  const navLinks = useMemo(() => [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact Us" },
  ], [])

  const handleCategoryClick = (categoryLabel) => {
    navigate(`/shop?category=${categoryLabel}`)
    setShowDropdown(false)
    setMenuOpen(false)
  }

  return (
    <nav
      className={`${scrolled ? "fixed top-0 left-0 right-0 shadow-lg backdrop-blur-md bg-white/95 dark:bg-gray-900/95" : "relative bg-white dark:bg-gray-900"
        } border-b border-gray-300 dark:border-gray-700 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                onClick={handleDropdownToggle}
              >
                <span>Categories</span>
                <IoIosArrowDown className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fadeIn">
                  {categories.map((category) => (
                    <button
                      key={category.path}
                      onClick={() => handleCategoryClick(category.label)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                    >
                      <div className="text-blue-600 dark:text-blue-400">{category.icon}</div>
                      <span className="font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-indigo-500 dark:to-purple-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <BsSun className="w-5 h-5 text-white" />
              ) : (
                <IoMoonSharp className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden sm:block px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="hidden sm:block px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
            }`}
        >
          <div className="space-y-2">
            {/* Mobile Categories */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                Categories
              </p>
              {categories.map((category) => (
                <button
                  key={category.path}
                  onClick={() => handleCategoryClick(category.label)}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                >
                  <div className="text-blue-600 dark:text-blue-400">{category.icon}</div>
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Button */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 sm:hidden">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold text-sm transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold text-sm transition-all duration-300"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
