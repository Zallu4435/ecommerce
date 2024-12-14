import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
// import AdminOutlet from './outlets/adminOutlet'
import { useSelector } from 'react-redux'
import MainLayout from './layouts/MainLayout'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  
import AdminLayout from './layouts/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import ProductManagement from './pages/admin/ProductManagement'


const App = () => {

  const theme = useSelector(state => state.root.theme.theme);



  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);


  return (
    <>

      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <Routes>
              <Route path="/*" element={<MainLayout />} /> 
              <Route path="/admin/*" element={<AdminLayout />} /> 
              <Route path='/admin/login' element={<AdminLogin /> } /> 
            </Routes>
      </GoogleOAuthProvider>

{/* <ProductManagement /> */}



    <ToastContainer
      theme={theme === "dark" ? "light" : "dark"}  
      position="bottom-center"
    />

    </>
  )
}

export default App
