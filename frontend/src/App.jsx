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
import PersistLogin from './PersistLogin'
import ResetPassword from './pages/user/forms/UserResetPassword'
import { useGetAddressesQuery } from './redux/apiSliceFeatures/addressPasswordApiSlice'


const App = () => {

  const theme = useSelector(state => state.root.theme.theme);
  const resetToken = useSelector(state => state.user.resetToken)




  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);


  return (
    <>

      <GoogleOAuthProvider clientId="978525226345-rsvsmqcr536r622rv7ri03g81otjc9d7.apps.googleusercontent.com">
          <Routes>
              <Route element={<PersistLogin />} >
              <Route path="/*" element={<MainLayout />} /> 
              <Route path="/admin/*" element={<AdminLayout />} /> 
              </Route>
              {
                resetToken &&
                <Route path='/reset-password' element={<ResetPassword />} />
              }
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
