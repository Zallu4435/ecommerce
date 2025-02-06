import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slice/themeSlice";
import { IoMoonSharp } from "react-icons/io5";
import { BsSun } from "react-icons/bs";

export const SettingsTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.root.theme.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="settings-container">
      <button onClick={handleThemeToggle} className="theme-toggle-btn">
        <IoMoonSharp
          className={`w-[30px] ml-32 h-[23px] ${
            theme === "dark" ? "hidden" : ""
          }`}
        />
        <BsSun
          className={`w-[30px] ml-32 h-[25px] text-white ${
            theme === "light" ? "hidden" : ""
          }`}
        />
      </button>
    </div>
  );
};

export const ThemeSwitcherButton = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.root.theme.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleThemeToggle}
      className={`w-14 h-8 flex items-center justify-between p-1 rounded-full ${
        theme === "dark" ? "bg-gray-900" : "bg-orange-50"
      }`}
    >
      <div
        className={`w-6 h-6 bg-gray-900 dark:bg-orange-50 rounded-full transition-all ${
          theme === "dark" ? "transform translate-x-6" : ""
        }`}
      ></div>
    </button>
  );
};
