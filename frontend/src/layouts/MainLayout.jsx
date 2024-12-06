import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from '../components/user/Header';
import Navbar from '../components/user/Navbar';
import Home from '../pages/user/Home';
import Cart from '../pages/user/Cart';
import Compare from '../pages/user/Compare';
import Wishlist from '../pages/user/Whishlist';
import Footer from '../components/user/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setScrolled } from '../redux/scrollSlice';


const MainLayout = () => {

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            dispatch(setScrolled(isScrolled));
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [dispatch])

  return (
    <div>
      <Header />
      <Navbar />

        <Routes>
        
            <Route index element={<Home />} />
            <Route 
                path='cart'
                element={ isAuthenticated ? <Cart /> : <Navigate to='/login' replace /> }
            />
            <Route 
                path='compare'
                element={ isAuthenticated ? <Compare /> : <Navigate to='/login' replace /> }
            />
            <Route
                path='wishlist'
                element={ isAuthenticated ? <Wishlist /> : <Navigate to='/login' replace /> }
            />


        </Routes>
            <Outlet />

        <Footer />

    </div>
  )
}

export default MainLayout
