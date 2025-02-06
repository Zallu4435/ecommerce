import Home from "../pages/user/Home.jsx";
import Cart from "../pages/user/Cart.jsx";
import Compare from "../pages/user/compare/Compare.jsx";
import Wishlist from "../pages/user/Whishlist.jsx";
import UserProfileLayout from "../layouts/UserProfileLayout.jsx";
import UserLogin from "../pages/user/forms/UserLogin.jsx";
import UserRegister from "../pages/user/forms/UserRegister.jsx";
import ProductDetails from "../pages/user/ProductDetails.jsx";
import ContactUs from "../pages/user/ContactUs.jsx";
import AboutUs from "../pages/user/AboutUs.jsx";
import ShopPage from "../pages/user/Shop.jsx";
import ActivationPage from "../pages/user/ActivationPage.jsx";
import NotFound from "../pages/user/NotFound.jsx";
import CheckoutPage from "../pages/user/checkout/Checkout.jsx";
import PaymentSuccess from "../pages/user/PaymentSuccess.jsx";
import ProceedToPaymentPage from '../pages/payment/ProceedToPayment.jsx'
import TrackOrder from '../pages/user/userProfile/TrackOrder.jsx'

// Admin Routes
import UserManagement from '../pages/admin/UserManagement.jsx'
import CategoryManagement from '../pages/admin/CategoryManagement.jsx'
import OrderManagement from '../pages/admin/OrderMangement.jsx'
import SalesManagement from '../pages/admin/Sales Management/SalesManagement.jsx'
import CouponManagement from '../pages/admin/CouponManagement.jsx'
import AdminCreateCouponForm from '../Forms/admin/Coupon Form/AdminCreateCoupensForm.jsx'
import AdminUpdateCouponForm from '../Forms/admin/Coupon Form/AdminUpdateCouponForm.jsx'
import ProductManagement from '../pages/admin/ProductManagement.jsx'
import AdminProductCreateForm from '../Forms/admin/AdminProductCreateForm.jsx'
import AdminProductUpdateForm from '../Forms/admin/AdminProductUpdateForm.jsx'
import AdminUsersForm from '../Forms/admin/AdminUsersForm.jsx'
import AdminDashboard from '../pages/admin/Admin Dashboard/AdminDashboard.jsx'
import ViewProductDetails from "../pages/admin/views/ViewProductDetails.jsx";
import ViewUserDetails from "../pages/admin/views/ViewUserDetails.jsx";
import AdminCategoryUpdateForm from '../Forms/admin/AdminCategoryUpdateForm.jsx'
import AdminCategoryCreateForm from '../Forms/admin/AdminCategoryCreateForm.jsx'
import ProductImageVarientAddModal from '../modal/admin/ProductImageVarientAddModal.jsx'
import ViewOrderDetails from '../pages/admin/views/AllOrdersTable.jsx'
import ViewCouponDetails from '../pages/admin/views/ViewCouponDetails.jsx'
import HelpComponent from '../pages/admin/HelpComponent.jsx'
import CurrencyConverter from '../pages/admin/Admin Settings/CurrencyConverter.jsx'
import TermsAndConditions from '../pages/admin/Admin Settings/Terms&Condition.jsx'

export const routes = [
  { path: "/", component: Home, isProtected: false },
  { path: "/login", component: UserLogin, isProtected: false },
  { path: "/signup", component: UserRegister, isProtected: false },
  { path: "/product/:id", component: ProductDetails, isProtected: false },
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
  { path: "/proceed-to-payment", component: ProceedToPaymentPage, isProtected: true },
  { path: "/track-order/:id", component: TrackOrder, isProtected: true },
  { path: "*", component: NotFound, isProtected: false },
];


export const adminRoutes = [
  { path: "/userManagement", component: UserManagement },
  { path: "/dashboard", component: AdminDashboard },
  { path: "/currency-converter", component: CurrencyConverter },
  { path: "/terms-and-conditions", component: TermsAndConditions },
  { path: "/help", component: HelpComponent },
  { path: "/categoryManagement", component: CategoryManagement },
  { path: "/orderManagement", component: OrderManagement },
  { path: "/couponManagement", component: CouponManagement },
  { path: "/salesManagement", component: SalesManagement },
  { path: "/productManagement", component: ProductManagement },
  { path: "/couponManagement/update/coupons/:id", component: AdminUpdateCouponForm },
  { path: "/couponManagement/create/coupons", component: AdminCreateCouponForm },
  { path: "/productManagement/create/products", component: AdminProductCreateForm },
  { path: "/productManagement/update/products/:id", component: AdminProductUpdateForm },
  { path: "/userManagement/update/users/:id", component: AdminUsersForm },
  { path: "/productManagement/view/products/:id", component: ViewProductDetails },
  { path: "/userManagement/view/users/:id", component: ViewUserDetails },
  { path: "/categoryManagement/create/category", component: AdminCategoryCreateForm },
  { path: "/categoryManagement/update/category/:id", component: AdminCategoryUpdateForm },
  { path: "/productManagement/create/products/image-varient", component: ProductImageVarientAddModal },
  { path: "/orderManagement/view/orders/:id", component: ViewOrderDetails },
  { path: "/couponManagement/view/coupons/:id", component: ViewCouponDetails },
  { path: "*", component: NotFound },
];

