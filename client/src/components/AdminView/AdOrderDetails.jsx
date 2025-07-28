import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import Form from '../CommonCompo/Form'

const initialFormData={
  status: "",
};

const AdOrderDetails = () => {
  const [formData, setFormData]=useState(initialFormData);

  function handleUpdateStatus(e){
    e.preventDefault();
  }

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
              <span>Sarika Mangaonkar</span>
              <span>Address</span>
              <span>City</span>
              <span>Pincode</span>
              <span>Phone</span>
              <span>Notes</span>
            </div>
          </div>
        </div>

        <div>
          <Form 
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={'Update Order Status'}
            onSubmit={handleUpdateStatus}
          >

          </Form>
        </div>
      </div>
    </DialogContent>
  )
}

export default AdOrderDetails