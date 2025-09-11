import { Navigate, Routes } from "react-router-dom"
import { Route } from "react-router-dom";
import AuthLayout from "./components/Auth/AuthLayout";
import AuthLogin from "./pages/Auth/AuthLogin";
import AuthRegister from "./pages/Auth/AuthRegister";
import AdminLayout from "./components/AdminView/AdminLayout";
import Features from "./pages/AdminView/Features";
import AdminOrders from './pages/AdminView/Order';
import Products from "./pages/AdminView/Products";
import ShopLayout from "./components/ShoppingView/ShopLayout";
import NotFound from "./pages/NotFound/NotFound";
import Account from "./pages/ShoppingView/Account";
import CheckOut from "./pages/ShoppingView/CheckOut";
import Home from "./pages/ShoppingView/Home";
import Listing from "./pages/ShoppingView/Listing";
import CheckAuth from "./components/CommonCompo/CheckAuth";
import UnauthPage from "./pages/UnauthPage/UnauthPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import PaypalReturn from "./pages/ShoppingView/PaypalReturn";
import PaymentSuccess from "./pages/ShoppingView/PaymentSuccess";
import Search from "./pages/ShoppingView/Search";


function App() {
  const {isAuthenticated, user, isLoading} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth());
  }, [dispatch])

  if(isLoading){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">

      <Routes>
        <Route path="/" element={<Navigate to="/auth/register" replace />} />
        <Route path='/auth' element={<CheckAuth isAuthenticated={isAuthenticated} user={user} >
          <AuthLayout />
        </CheckAuth>}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} >
          <AdminLayout />
        </CheckAuth>}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="features" element={<Features />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<Products />} />
        </Route>
        {/* Backward compatibility: redirect old dashboard path */}
        <Route path="/admin/dashboard" element={<Navigate to="/admin/products" replace />} />
        <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} >
          <ShopLayout />
        </CheckAuth>}>
          <Route path="account" element={<Account />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="home" element={<Home />} />
          <Route path="listing" element={<Listing />} />
          <Route path="paypal-return" element={<PaypalReturn />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path='search' element={<Search/>} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/unauth-page" element={<UnauthPage />}></Route>
      </Routes>
    </div>
  )
}

export default App

//14.01.46