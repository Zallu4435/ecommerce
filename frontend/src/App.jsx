import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminOutlet from './outlets/adminOutlet'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { useDispatch, useSelector } from 'react-redux'
import UserManagement from './pages/admin/UserManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import OrderManagement from './pages/admin/OrderMangement'
import CouponManagement from './pages/admin/CoupenManagement'
import AdminCoupensForm from './Forms/admin/AdminCoupensForm'
import ProductManagement from './pages/admin/ProductManagement'
import AdminProductsForm from './Forms/admin/AdminProductsForm'
import OrderDetails from './Forms/admin/OrderViewPage'
import AdminUsersForm from './Forms/admin/AdminUsersForm'
import MainLayout from './layouts/MainLayout'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the styles
import { loadUser } from './redux/actions/user'
import { clearErrors } from './redux/slice/userSlice'
import WalletPage from './pages/user/userProfile/Wallet'

const App = () => {

  const theme = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.user)

  // console.log(error, isAuthenticated)

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  // useEffect(() => {
  //   dispatch(loadUser());

  //   if (error) {
  //     console.error(error);
  //     dispatch(clearErrors());
  //   }
  // }, [dispatch, error]);
  

  return (
    <>

    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
       <Routes>
          <Route path="/*" element={<MainLayout />} />
        </Routes>        
    </GoogleOAuthProvider>


    <ToastContainer
      theme={theme === "dark" ? "light" : "dark"}  
      position="bottom-center"
    />



      <Routes>
        <Route path='/admin' element={<AdminOutlet />}>
          <Route path='userManagement' element={<UserManagement />}/>
          <Route path='dashboard' element={<AdminDashboard />}/>
          <Route path='categoryManagement' element={<CategoryManagement />}/>
          <Route path='orderManagement' element={<OrderManagement />}/>
          <Route path='couponManagement' element={<CouponManagement />}/>
          <Route path='productManagement' element={<ProductManagement />}/>
          <Route path='couponManagement/update/coupons/:id' element={<AdminCoupensForm />} />
          <Route path='couponManagement/create/coupons' element={<AdminCoupensForm />} />
          <Route path='productManagement/create/products' element={<AdminProductsForm />} />
          <Route path='productManagement/update/products/:id' element={<AdminProductsForm />} />
          <Route path='orderManagement/view/orders'element={<OrderDetails />} />
          <Route path='userManagement/update/users/:id'element={<AdminUsersForm />} />
        </Route>



        <Route path='/admin/login' element={<AdminLogin />} />

      </Routes>
    </>
  )
}

export default App
