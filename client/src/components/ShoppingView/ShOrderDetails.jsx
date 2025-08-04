import React from 'react'
import { DialogContent, DialogTitle, } from '@/components/ui/dialog'
import { Separator } from '../ui/separator'
import { Label } from '@radix-ui/react-label'

const ShOrderDetails = () => {
  return (
    <DialogContent className='sm:max-w-[600px]'>
      <div className="grid gap-6">
        <div className="flex mt-6 items-center justify-between">
          <DialogTitle>Order ID</DialogTitle>
          <Label>1234</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className='font-medium'>Order Date</p>
          <Label>27/07/2025</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className='font-medium'>Order Price</p>
          <Label>$200</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className='font-medium'>Order Date</p>
          <Label>In Process</Label>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className='grid gap-3'>
              <li className='flex items-center justify-between'>
                <span>Product one</span>
                <span>Quantity</span>
                <span>Price</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>Sanket Nagap</span>
              <span>Address</span>
              <span>City</span>
              <span>Pincode</span>
              <span>Phone</span>
              <span>Notes</span>
            </div>
          </div>
        </div>

        
      </div>
    </DialogContent>
  )
}

export default ShOrderDetails