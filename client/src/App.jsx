import { Routes } from "react-router-dom"
import { Route } from "react-router-dom";
import AuthLayout from "./components/Auth/AuthLayout";
import AuthLogin from "./pages/Auth/AuthLogin";
import AuthRegister from "./pages/Auth/AuthRegister";
import AdminLayout from "./components/AdminView/AdminLayout";
import Dashboard from "./pages/AdminView/Dashboard";
import Features from "./pages/AdminView/Features";
import Orders from "./pages/AdminView/Orders";
import Products from "./pages/AdminView/Products";


function App() {
  return (
     <div className="flex flex-col overflow-hidden bg-white">

      <Routes>
        <Route path='/auth' element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path="features" element={<Features />}/>
          <Route path="orders" element={<Orders />}/>
          <Route path="products" element={<Products />}/>
        </Route>
      </Routes>
     </div>
  )
}

export default App
