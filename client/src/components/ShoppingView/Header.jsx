import { Zap, LogOut, LogOutIcon, Menu, ShoppingCart, UserCog } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { shoppingViewHeaderMenuItems } from '@/config/registerFormControls'
import { Label } from '@radix-ui/react-label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { logOut } from '@/store/auth-slice'
import UserCartWrapper from './UserCartWrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'

function MenuItems({ onCloseMenu }) {
  const navigate = useNavigate();

  // Only set filter for real categories
  const categoryIds = ["men", "women", "kids", "footwear", "accessories"];

  function handleNavigate(getCurrentMenuItem) {
    if (categoryIds.includes(getCurrentMenuItem.id)) {
      sessionStorage.setItem('filter', JSON.stringify({ category: [getCurrentMenuItem.id] }));
    } else {
      sessionStorage.removeItem('filter');
    }
    // Close menu first, then navigate
    if (onCloseMenu) onCloseMenu();
    navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'>
      {shoppingViewHeaderMenuItems.map((menuitem) => (
        <Label className='text-sm font-medium cursor-pointer text-slate-700 hover:text-slate-900 transition-colors hover:underline underline-offset-8 decoration-2 decoration-blue-500/60' key={menuitem.id} onClick={() => handleNavigate(menuitem)}>
          {menuitem.label}
        </Label>
      ))}
    </nav>
  )
}

// Mobile-specific account section (replaces broken dropdown)
function MobileAccountSection({ user, onCloseMenu }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    if (onCloseMenu) onCloseMenu();
    dispatch(logOut());
  }

  function handleAccountClick() {
    if (onCloseMenu) onCloseMenu();
    navigate('/shop/account');
  }

  return (
    <div className="space-y-3">
      {/* User info */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
        <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
          {user?.userName?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-800 truncate">{user?.userName || "User"}</div>
          <div className="text-xs text-slate-500">Signed in</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-11 gap-2 text-slate-700 hover:bg-slate-50"
          onClick={handleAccountClick}
        >
          <UserCog className="h-4 w-4" />
          Account
        </Button>
        <Button
          variant="outline"
          className="h-11 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
          onClick={handleLogout}
        >
          <LogOutIcon className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

// Desktop header right content (unchanged, uses dropdown)
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);

  function handleLogout() {
    dispatch(logOut())
  }
  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <div className='relative'>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant={'outline'} size={'icon'} className={'hover:shadow-sm'}>
            <ShoppingCart className='w-6 h-6' />
            <span className='sr-only'>User Cart</span>
          </Button>
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            <span className='absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] h-5 min-w-[1.25rem] px-1 font-semibold'>
              {cartItems.items.length}
            </span>
          ) : null}
        </div>

        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black rounded-full w-10 h-10 flex items-center justify-center ring-2 ring-transparent hover:ring-blue-300 transition-shadow cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold rounded-full w-10 h-10 flex items-center justify-center text-lg">
              {user?.userName?.[0]?.toUpperCase() || ""}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='end' className='w-64 bg-white rounded-xl shadow-lg border p-2'>
          <div className='px-2 py-2 flex items-center gap-3'>
            <div className='h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold'>
              {user?.userName?.[0]?.toUpperCase() || ""}
            </div>
            <div className='min-w-0'>
              <div className='text-sm font-medium text-slate-800 truncate'>{user?.userName}</div>
              <div className='text-xs text-slate-500 truncate'>Signed in</div>
            </div>
          </div>
          <DropdownMenuSeparator className="my-2 h-px bg-gray-100" />

          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
            onClick={() => navigate('/shop/account')}
          >
            <UserCog className='h-4 w-4 text-slate-500' />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2 h-px bg-gray-100" />
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-700 hover:bg-red-50 focus:bg-red-50"
            onClick={handleLogout}
          >
            <LogOutIcon className='h-4 w-4' />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [openMobileCart, setOpenMobileCart] = useState(false);

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  // Handle opening cart from mobile menu
  function handleOpenMobileCart() {
    setOpenMenu(false); // Close menu
    // Small delay to let menu close animation start, then open cart
    setTimeout(() => setOpenMobileCart(true), 150);
  }

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={'/shop/home'} className='flex items-center gap-2 text-slate-800 hover:text-slate-900 transition-colors'>
          <Zap className='h-6 w-6' />
          <span className='font-bold'>PikaShop</span>
        </Link>

        {/* Mobile Menu - Controlled Sheet, slides from RIGHT */}
        <Sheet open={openMenu} onOpenChange={setOpenMenu}>
          <SheetTrigger asChild>
            <Button variant={'outline'} size={'icon'} className={'lg:hidden'}>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className={'w-full max-w-xs p-0'}>
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b">
                <div className='text-base font-semibold text-slate-800'>Menu</div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <MenuItems onCloseMenu={() => setOpenMenu(false)} />
              </div>

              {/* Bottom Section: Cart + Account */}
              <div className="border-t px-5 py-4 space-y-4">
                {/* Cart Button Row */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Your Cart</span>
                  <div className='relative inline-block'>
                    <Button
                      onClick={handleOpenMobileCart}
                      variant={'outline'}
                      size={'icon'}
                      className={'hover:shadow-sm h-11 w-11'}
                    >
                      <ShoppingCart className='w-5 h-5' />
                      <span className='sr-only'>User Cart</span>
                    </Button>
                    {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                      <span className='absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] h-5 min-w-[1.25rem] px-1 font-semibold'>
                        {cartItems.items.length}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Account Section */}
                <MobileAccountSection user={user} onCloseMenu={() => setOpenMenu(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Cart Sheet - OUTSIDE of menu so it persists when menu closes */}
        <Sheet open={openMobileCart} onOpenChange={setOpenMobileCart}>
          <UserCartWrapper
            setOpenCartSheet={setOpenMobileCart}
            cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []}
          />
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Desktop Right Content */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  )
}

export default Header