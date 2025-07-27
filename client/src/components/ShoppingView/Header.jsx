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
        <Label className='text-sm font-medium cursor-pointer' key={menuitem.id} onClick={()=>handleNavigate(menuitem)}>
          {menuitem.label}
        </Label>
      ))}
    </nav>
  )
}



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
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant={'outline'} size={'icon'} >
          <ShoppingCart className='w-6 h-6' />
          <span className='sr-only'>User Cart</span>
        </Button>

        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black rounded-full w-10 h-10 flex items-center justify-center">
            <AvatarFallback className="bg-black text-white font-extrabold rounded-full w-10 h-10 flex items-center justify-center text-lg">
              {user?.userName?.[0]?.toUpperCase() || ""}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' className='w-56 bg-white' >
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2 h-px bg-gray-100" />

          <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={() => navigate('/shop/account')}
          >
            <UserCog className='mr-2 h-4 w-4' />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2 h-px bg-gray-100" />
          <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={handleLogout}
          >
            <LogOutIcon className='mr-2 h-4 w-4' />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)


  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={'/shop/home'} className='flex items-center gap-2'>
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
          <SheetContent side='left' className={'w-full max-w-5xl'}>
            <MenuItems />
            <HeaderRightContent />
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