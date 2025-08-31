import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import ShOrderDetails from './ShOrderDetails'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUser, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, isLoading, orderDetails } = useSelector((state) => state.shopOrder);

  function fetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUser(user.id));
  }, [dispatch, user?.id])

  useEffect(()=>{
    if(orderDetails!==null){
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className='sr-only'>Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? orderList.map((orderItem) => (
              <TableRow key={orderItem._id}>
                <TableCell>{orderItem?._id}</TableCell>
                <TableCell>{orderItem?.orderDate ? orderItem.orderDate.split("T")[0] : 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={`py-1 px-3 
                    ${orderItem?.orderStatus?.toLowerCase() === "confirmed" ? "bg-green-500" :
                      orderItem?.orderStatus?.toLowerCase() === "rejected" ? "bg-red-600" : 
                      orderItem?.orderStatus?.toLowerCase() === "delivered" ? "bg-blue-500" :
                      orderItem?.orderStatus?.toLowerCase() === "inprocess" || orderItem?.orderStatus?.toLowerCase() === "in process" ? "bg-yellow-500" :
                      orderItem?.orderStatus?.toLowerCase() === "inshipping" || orderItem?.orderStatus?.toLowerCase() === "in shipping" ? "bg-purple-500" :
                      "bg-gray-500"}`}>
                    {orderItem?.orderStatus ?
                      orderItem.orderStatus.charAt(0).toUpperCase() + orderItem.orderStatus.slice(1).toLowerCase()
                      : 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>${orderItem?.totalAmount}</TableCell>
                <TableCell>
                  <Dialog 
                    open={openDetailsDialog} onOpenChange={()=>{
                      setOpenDetailsDialog(false);
                      dispatch(resetOrderDetails());
                    }}>
                    <Button onClick={() => {
                      setOpenDetailsDialog(true);
                      fetchOrderDetails(orderItem?._id);
                    }}>View Details</Button>
                    <ShOrderDetails orderDetails={orderDetails}/>
                  </Dialog>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {isLoading ? 'Loading orders...' : 'No orders found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders