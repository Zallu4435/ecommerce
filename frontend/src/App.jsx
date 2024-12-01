import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminOutlet from './outlets/adminOutlet'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { useSelector } from 'react-redux'
import UserManagement from './pages/admin/UserManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import OrderManagement from './pages/admin/OrderMangement'
import CouponManagement from './pages/admin/CoupenManagement'
import AdminCoupensForm from './Forms/admin/AdminCoupensForm'
import ProductManagement from './pages/admin/ProductManagement'
import AdminProductsForm from './Forms/admin/AdminProductsForm'
import OrderDetails from './Forms/admin/OrderViewPage'

const App = () => {

  const theme = useSelector(state => state.theme.theme);

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  

  return (
    <>
    {/* <AdminCoupensForm /> */}
    {/* <AdminProductsForm /> */}
    {/* <OrderDetails /> */}
      <Routes>
        <Route path='/admin' element={<AdminOutlet />}>
          <Route path='userManagement' element={<UserManagement />}/>
          <Route path='dashboard' element={<AdminDashboard />}/>
          <Route path='categoryManagement' element={<CategoryManagement />}/>
          <Route path='orderManagement' element={<OrderManagement />}/>
          <Route path='couponManagement' element={<CouponManagement />}/>
          <Route path='productManagement' element={<ProductManagement />}/>
        </Route>
        <Route path='/update/coupons/:id' element={<AdminCoupensForm />} />
        <Route path='/create/coupons' element={<AdminCoupensForm />} />
        <Route path='/create/products' element={<AdminProductsForm />} />
        <Route path='/update/products/:id' element={<AdminProductsForm />} />
        <Route path='/view/orders'element={<OrderDetails />} />


        <Route path='/admin/login' element={<AdminLogin />} />
      </Routes>
    </>
  )
}

export default App
