import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import Form from '../CommonCompo/Form'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from '@/store/admin/order-slice'
import { toast } from 'sonner'

const initialFormData = {
  status: "",
};

const AdOrderDetails = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateStatus(e) {
    e.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.info(data?.payload?.message)
      }
    })
  }

  // Add a guard clause to prevent rendering if orderDetails is null
  if (!orderDetails) {
    return (
      <DialogContent className='sm:max-w-[600px]'>
        <div className="text-center py-8">
          <p>Loading order details...</p>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className='sm:max-w-[600px]'>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>
              {orderDetails?.orderDate ? orderDetails.orderDate.split("T")[0] : 'N/A'}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 
                  ${orderDetails?.orderStatus?.toLowerCase() === "confirmed" ? "bg-green-500" :
                    orderDetails?.orderStatus?.toLowerCase() === "rejected" ? "bg-red-600" :
                      orderDetails?.orderStatus?.toLowerCase() === "delivered" ? "bg-blue-500" :
                        orderDetails?.orderStatus?.toLowerCase() === "inprocess" || orderDetails?.orderStatus?.toLowerCase() === "in process" ? "bg-yellow-500" :
                          orderDetails?.orderStatus?.toLowerCase() === "inshipping" || orderDetails?.orderStatus?.toLowerCase() === "in shipping" ? "bg-purple-500" :
                            "bg-gray-500"}`}
              >
                {orderDetails?.orderStatus ?
                  orderDetails.orderStatus.charAt(0).toUpperCase() + orderDetails.orderStatus.slice(1).toLowerCase()
                  : 'N/A'}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>Title: {item.title}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: ${item.price}</span>
                  </li>
                ))
                : <li>No items found</li>}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
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
          />
        </div>
      </div>
    </DialogContent>
  )
}

export default AdOrderDetails