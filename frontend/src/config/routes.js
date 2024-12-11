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
import CheckoutPage from "../pages/user/Checkout";
import PaymentSuccess from "../pages/user/PaymentSuccess";

const routes = [
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

export default routes;
