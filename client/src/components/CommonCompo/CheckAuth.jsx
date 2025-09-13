import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const CheckAuth = ({ isAuthenticated, user, children }) => {
    const location = useLocation();

    // Allow PayPal return/cancel routes without authentication check
    if (location.pathname.includes('/paypal-return') || location.pathname.includes('/paypal-cancel')) {
        return <>{children}</>
    }

    if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        return <Navigate to={"/auth/login"} />
    }

    if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        if (user?.role === "admin") {
            return <Navigate to={"/admin/dashboard"} />
        } else {
            return <Navigate to={"/shop/home"} />
        }
    }

    if (isAuthenticated && user?.role !== "admin" && location.pathname.includes('admin')) {
        return <Navigate to={"/unauth-page"} />
    }

    if (isAuthenticated && user?.role === "admin" && location.pathname.includes('shop')) {
        return <Navigate to={"/unauth-page"} />
    }

    return <>{children}</>
}

export default CheckAuth