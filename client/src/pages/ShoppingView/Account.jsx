import React from 'react'
import accImg from '../../assets/account.jpg'
import { Tabs } from '@/components/ui/tabs'
import { TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import Address from '@/components/ShoppingView/Address'
import ShoppingOrders from '@/components/ShoppingView/ShoppingOrders'

const Account = () => {
  return (
    <div className='flex flex-col'>
      <div className="relative h-[300px] w-full overflow-hidden">
        <img 
          src={accImg}
          alt="Account banner"
          className='h-full w-full object-cover object-center'
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue='orders'>
            <TabsList className="space-x-4">
              <TabsTrigger 
                value='orders'
                className="px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value='address'
                className="px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Address
              </TabsTrigger>
            </TabsList>
            <TabsContent value='orders' className="mt-4 p-4">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value='address' className="mt-4 p-4">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Account