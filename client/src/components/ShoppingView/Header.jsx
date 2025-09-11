import { HousePlug, LogOut, LogOutIcon, Menu, ShoppingCart, UserCog } from 'lucide-react'
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

function MenuItems() {
  const navigate = useNavigate();

  // Only set filter for real categories
  const categoryIds = ["men", "women", "kids", "footwear", "accessories"];

  function handleNavigate(getCurrentMenuItem){
    if (categoryIds.includes(getCurrentMenuItem.id)) {
      sessionStorage.setItem('filter', JSON.stringify({ category: [getCurrentMenuItem.id] }));
    } else {
      sessionStorage.removeItem('filter');
    }
    navigate(getCurrentMenuItem.path);
    console.log(getCurrentMenuItem.path, 'getCurrentMenuitem.path')
  }

  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'>
      {shoppingViewHeaderMenuItems.map((menuitem) => (
        <Label className='text-sm font-medium cursor-pointer text-slate-700 hover:text-slate-900 transition-colors hover:underline underline-offset-8 decoration-2 decoration-blue-500/60' key={menuitem.id} onClick={()=>handleNavigate(menuitem)}>
          {menuitem.label}
        </Label>
      ))}
    </nav>
  )
}



function HeaderRightContent({ compact = false }) {
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
    <div className={`flex ${compact ? 'items-center flex-row gap-3' : 'lg:items-center lg:flex-row flex-col gap-4'}`}>
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
          <Avatar className="bg-black rounded-full w-10 h-10 flex items-center justify-center ring-2 ring-transparent hover:ring-blue-300 transition-shadow">
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
  const { isAuthenticated, user } = useSelector((state) => state.auth)


  return (
    <header className='sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={'/shop/home'} className='flex items-center gap-2 text-slate-800 hover:text-slate-900 transition-colors'>
          <HousePlug className='h-6 w-6' />
          <span className='font-bold'>Ecommerce</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant={'outline'} size={'icon'} className={'lg:hidden'}>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className={'w-full max-w-sm p-0'}>
            <div className="flex h-full flex-col">
              <div className="px-5 py-4 border-b">
                <div className='text-sm font-semibold text-slate-800'>Menu</div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <MenuItems />
              </div>
              <div className="border-t px-5 py-4">
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-slate-600'>Quick actions</div>
                </div>
                <div className='mt-3'>
                  <HeaderRightContent compact={true} />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>

        {/* {
          isAuthenticated ? <div></div> : null
        } */}
      </div>
    </header>
  )
}

export default Header