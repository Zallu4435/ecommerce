import { Route, Routes } from 'react-router-dom';
import UserProfile from '../pages/user/userProfile/UserProfile';
import SideBar from '../components/user/SideBar';
import Address from '../pages/user/userProfile/Address'
import NotFound from '../pages/user/NotFound';
import Password from '../pages/user/userProfile/Password'
import Wallet from '../pages/user/userProfile/Wallet';
import OrdersList from '../pages/user/userProfile/Order';
import TrackOrder from '../pages/user/userProfile/TrackOrder';


const UserProfileLayout = () => {
  return (
    <div className="flex justify-start space-x-6 m-16 mx-32"> {/* Adding space between sidebar and content */}
      {/* Sidebar with some margin to the right */}
      <SideBar className="w-1/4" />

      <div className="flex-1 p-2">
        <Routes>
          <Route index element={<UserProfile />} />
          <Route path='address' element={<Address />} />
          <Route path='password' element={<Password />} />
          <Route path='order' element={<OrdersList />} />
          <Route path='wallet' element={<Wallet />} />

          <Route path='*' element={<NotFound notFound={1}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default UserProfileLayout;
