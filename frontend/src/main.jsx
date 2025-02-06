import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store/store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  // {/* </StrictMode> */}
);
