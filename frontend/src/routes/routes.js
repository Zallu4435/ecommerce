import { lazy } from "react";
import Home from "../pages/user/Home.jsx";
import AboutUs from "../pages/user/AboutUs.jsx";
import ShopPage from "../pages/user/Shop.jsx";

const Cart = lazy(() => import("../pages/user/Cart.jsx"));
const Compare = lazy(() => import("../pages/user/compare/Compare.jsx"));
const Wishlist = lazy(() => import("../pages/user/Whishlist.jsx"));
const UserProfileLayout = lazy(() => import("../layouts/UserProfileLayout.jsx"));
const UserLogin = lazy(() => import("../pages/user/forms/UserLogin.jsx"));
const UserRegister = lazy(() => import("../pages/user/forms/UserRegister.jsx"));
const ProductDetails = lazy(() => import("../pages/user/ProductDetails.jsx"));
const ContactUs = lazy(() => import("../pages/user/ContactUs.jsx"));
const ActivationPage = lazy(() => import("../pages/user/ActivationPage.jsx"));
const NotFound = lazy(() => import("../pages/user/NotFound.jsx"));
const CheckoutPage = lazy(() => import("../pages/user/checkout/Checkout.jsx"));
const PaymentSuccess = lazy(() => import("../pages/user/PaymentSuccess.jsx"));
const ProceedToPaymentPage = lazy(() => import("../pages/payment/ProceedToPayment.jsx"));
const TrackOrder = lazy(() => import("../pages/user/userProfile/TrackOrder.jsx"));
const OrdersListGrouped = lazy(() => import("../pages/user/userProfile/OrdersListGrouped.jsx"));
const OrderDetailsPage = lazy(() => import("../pages/user/userProfile/OrderDetailsPage.jsx"));
const PaymentFailure = lazy(() => import("../pages/payment/PaymentFailure.jsx"));
const RetryPayment = lazy(() => import("../pages/payment/RetryPayment.jsx"));

// Admin Routes (lazy)
const UserManagement = lazy(() => import('../pages/admin/UserManagement.jsx'))
const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement.jsx'))
const AdminOrderManagementNew = lazy(() => import('../pages/admin/AdminOrderManagementNew.jsx'))
const AdminOrderDetailsPage = lazy(() => import('../pages/admin/AdminOrderDetailsPage.jsx'))
const SalesManagement = lazy(() => import('../pages/admin/Sales Management/SalesManagement.jsx'))
const CouponManagement = lazy(() => import('../pages/admin/CouponManagement.jsx'))
const AdminCreateCouponForm = lazy(() => import('../Forms/admin/Coupon Form/AdminCreateCoupensForm.jsx'))
const AdminUpdateCouponForm = lazy(() => import('../Forms/admin/Coupon Form/AdminUpdateCouponForm.jsx'))
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement.jsx'))
const AdminProductCreateForm = lazy(() => import('../Forms/admin/AdminProductCreateForm.jsx'))
const AdminProductUpdateForm = lazy(() => import('../Forms/admin/AdminProductUpdateForm.jsx'))
const AdminUsersForm = lazy(() => import('../Forms/admin/AdminUsersForm.jsx'))
const AdminDashboard = lazy(() => import('../pages/admin/Admin Dashboard/AdminDashboard.jsx'))
const ViewProductDetails = lazy(() => import("../pages/admin/views/ViewProductDetails.jsx"));
const ViewUserDetails = lazy(() => import("../pages/admin/views/ViewUserDetails.jsx"));
const AdminCategoryUpdateForm = lazy(() => import('../Forms/admin/AdminCategoryUpdateForm.jsx'))
const AdminCategoryCreateForm = lazy(() => import('../Forms/admin/AdminCategoryCreateForm.jsx'))
const ProductImageVarientAddModal = lazy(() => import('../modal/admin/ProductImageVarientAddModal.jsx'))
const ViewOrderDetails = lazy(() => import('../pages/admin/views/AllOrdersTable.jsx'))
const ViewCouponDetails = lazy(() => import('../pages/admin/views/ViewCouponDetails.jsx'))
const HelpComponent = lazy(() => import('../pages/admin/HelpComponent.jsx'))
const CurrencyConverter = lazy(() => import('../pages/admin/Admin Settings/CurrencyConverter.jsx'))
const TermsAndConditions = lazy(() => import('../pages/admin/Admin Settings/Terms&Condition.jsx'))
const ReviewManagement = lazy(() => import('../pages/admin/ReviewManagement.jsx'))

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
  { path: "/payment-failure", component: PaymentFailure, isProtected: true },
  { path: "/retry-payment", component: RetryPayment, isProtected: true },
  { path: "/track-order/:id", component: TrackOrder, isProtected: true },
  { path: "/orders", component: OrdersListGrouped, isProtected: true },
  { path: "/order-details/:orderId", component: OrderDetailsPage, isProtected: true },
  { path: "*", component: NotFound, isProtected: false },
];


export const adminRoutes = [
  { path: "/userManagement", component: UserManagement },
  { path: "/dashboard", component: AdminDashboard },
  { path: "/currency-converter", component: CurrencyConverter },
  { path: "/terms-and-conditions", component: TermsAndConditions },
  { path: "/help", component: HelpComponent },
  { path: "/categoryManagement", component: CategoryManagement },
  { path: "/orderManagement", component: AdminOrderManagementNew }, // Updated to use new page
  { path: "/order-details/:orderId", component: AdminOrderDetailsPage },
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
  { path: "/reviewManagement", component: ReviewManagement },
  { path: "*", component: NotFound },
];


