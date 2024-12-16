import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import store, { persistor } from './redux/store/store.js';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={<div>Loading...</div>} persistor={persistor}> */}
        <Router>
          <App />
        </Router>
      {/* </PersistGate> */}
    </Provider>
  // {/* </StrictMode> */}
)

