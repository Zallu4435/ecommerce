import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";

const SettingsTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="settings-container">
      <button
        className="theme-toggle-btn"
        onClick={handleThemeToggle}
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </div>
  );
};

export default SettingsTheme;
