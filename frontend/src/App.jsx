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
import AdminUsersForm from './Forms/admin/AdminUsersForm'
import UserLogin from './pages/user/UserLogin'
import UserRegister from './pages/user/UserRegister'
import Header from './components/user/Header'
import Navbar from './components/user/Navbar'
import HeroSection_1 from './components/user/heroSection/HeroSection_1'
import HeroSection_3 from './components/user/heroSection/HeroSection_3'
import HeroSection_4 from './components/user/heroSection/HeroSection_4'
import ShoppingCard from './components/user/ShoppingCards'
// import Sample from './components/user/ShoppingCrds'
import Footer from './components/user/Footer'
import HeroSection_5 from './components/user/heroSection/HeroSection_5'
import FashionBrandSlider from './components/user/heroSection/Brand'
import HeroSection_6 from './components/user/heroSection/HeroSection_6'
import ProductDetails from './components/user/ProductDetails/ProductDetails'
import Wishlist from './pages/user/Whishlist'
import AdminTable from './components/admin/AdminTable'
import Compare from './pages/user/Compare'
import Cart from './pages/user/Cart'
import Home from './pages/user/Home'
import Sample from './Sample'
import { ThemeSwitcherButton } from './components/SettingsTheme'

const App = () => {

  const theme = useSelector(state => state.theme.theme);

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  

  return (
    <>

    
    {/* <Header /> */}
    {/* <Navbar /> */}
    {/* <Icon /> */}
    {/* <HeroSection_3 />
    <HeroSection_4 /> */}
    {/* <Sample /> */}
    {/* <Footer /> */}
    {/* <HeroSection_5 /> */}
    {/* <HeroSection_1 /> */}
    {/* <FashionBrandSlider /> */}
    {/* <HeroSection_6 /> */}
    {/* <ProductDetails /> */}

      {/* <Wishlist /> */}
      {/* <AdminTable /> */}
      {/* <Compare /> */}
      <Cart />
      {/* <Home /> */}
      {/* <ShoppingCard /> */}
      {/* <Sample /> */}
      {/* <ThemeSwitcherButton /> */}

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


        {/* <Route path='/' element={<UserLogin />} > */}

        {/* </Route> */}

        <Route path='/register' element={<UserRegister />} />

      </Routes>
    </>
  )
}

export default App
