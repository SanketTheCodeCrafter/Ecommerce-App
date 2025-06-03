import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar]= useState(false);

  return (
    <div className='flex min-h-screen w-full'>
        {/* sidebar */}
        <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
        <div className="flex flex-1 flex-col">
            {/* header */}
            <Header setOpen={setOpenSidebar} />
            <main className='flex-1 flex bgmuted/40 p-4 md:p-6'>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default AdminLayout