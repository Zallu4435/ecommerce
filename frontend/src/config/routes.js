// routes.js
import Home from "../pages/user/Home";
import Cart from "../pages/user/Cart";
import Compare from "../pages/user/Compare";
import Wishlist from "../pages/user/Whishlist";
import UserProfileLayout from "../layouts/UserProfileLayout";
import UserLogin from "../pages/user/forms/UserLogin";
import UserRegister from "../pages/user/forms/UserRegister";
import ProductDetails from "../pages/user/ProductDetails";
import ContactUs from "../pages/user/ContactUs";
import AboutUs from "../pages/user/AboutUs";
import ShopPage from "../pages/user/Shop";
import ActivationPage from "../pages/user/ActivationPage";
import NotFound from "../pages/user/NotFound";
import CheckoutPage from "../pages/user/checkout/Checkout";
import PaymentSuccess from "../pages/user/PaymentSuccess";

// admin routes
import UserManagement from '../pages/admin/UserManagement'
import CategoryManagement from '../pages/admin/CategoryManagement'
import OrderManagement from '../pages/admin/OrderMangement'
import CouponManagement from '../pages/admin/CoupenManagement'
import AdminCreateCouponForm from '../Forms/admin/AdminCreateCoupensForm'
import AdminUpdateCouponForm from '../Forms/admin/AdminUpdateCouponForm'
import ProductManagement from '../pages/admin/ProductManagement'
import AdminProductCreateForm from '../Forms/admin/AdminProductCreateForm'
import AdminProductUpdateForm from '../Forms/admin/AdminProductUpdateForm'
import OrderDetails from '../Forms/admin/OrderViewPage'
import AdminUsersForm from '../Forms/admin/AdminUsersForm'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ViewProductDetails from "../pages/admin/views/ViewProductDetails";


export const routes = [
  { path: "/", component: Home, isProtected: false },
  { path: "/login", component: UserLogin, isProtected: false },
  { path: "/signup", component: UserRegister, isProtected: false },
  { path: "/product", component: ProductDetails, isProtected: false },
  { path: "/contact", component: ContactUs, isProtected: false },
  { path: "/about", component: AboutUs, isProtected: false },
  { path: "/shop", component: ShopPage, isProtected: false },
  { path: "/activation/:activation_token", component: ActivationPage, isProtected: false },
  { path: "/cart", component: Cart, isProtected: true },
  { path: "/compare", component: Compare, isProtected: true },
  { path: "/wishlist", component: Wishlist, isProtected: true },
  { path: "/profile*", component: UserProfileLayout, isProtected: true },
  { path: "/checkout", component: CheckoutPage, isprotected: true },
  { path: "/payment-success", component: PaymentSuccess, isprotected: true },
  { path: "*", component: NotFound, isProtected: false },
];


export const adminRoutes = [
  { path: "/userManagement", component: UserManagement },
  { path: "/dashboard", component: AdminDashboard },
  { path: "/categoryManagement", component: CategoryManagement },
  { path: "/orderManagement", component: OrderManagement },
  { path: "/couponManagement", component: CouponManagement },
  { path: "/productManagement", component: ProductManagement },
  { path: "/couponManagement/update/coupons/:id", component: AdminUpdateCouponForm },
  { path: "/couponManagement/create/coupons", component: AdminCreateCouponForm },
  { path: "/productManagement/create/products", component: AdminProductCreateForm },
  { path: "/productManagement/update/products/:id", component: AdminProductUpdateForm },
  { path: "/orderManagement/view/orders", component: OrderDetails },
  { path: "/userManagement/update/users/:id", component: AdminUsersForm },
  { path: "/productManagement/view/products/:id", component: ViewProductDetails },
  { path: "*", component: NotFound },

];

