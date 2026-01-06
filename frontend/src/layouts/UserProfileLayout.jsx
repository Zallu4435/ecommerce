import { Route, Routes } from "react-router-dom";
import UserProfile from "../pages/user/userProfile/UserProfile";
import SideBar from "../components/user/SideBar";
import Address from "../pages/user/userProfile/Address";
import NotFound from "../pages/user/NotFound";
import Password from "../pages/user/userProfile/ChangePassword";
import Wallet from "../pages/user/userProfile/Wallet";
import OrdersListGrouped from "../pages/user/userProfile/OrdersListGrouped";

const UserProfileLayout = () => {
  return (
    <div className="flex justify-start lg:space-x-6 lg:m-16 lg:mx-32">
      <SideBar className="w-1/4" />

      <div className="flex-1 p-2">
        <Routes>
          <Route index element={<UserProfile />} />
          <Route path="address" element={<Address />} />
          <Route path="password" element={<Password />} />
          <Route path="order" element={<OrdersListGrouped />} />
          <Route path="wallet" element={<Wallet />} />

          <Route path="*" element={<NotFound notFound={1} />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserProfileLayout;
