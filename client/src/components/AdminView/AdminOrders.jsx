import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice'
import AdOrderDetails from './AdOrderDetails'
import { Badge } from '../ui/badge'

const AdminOrderView = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('Dispatching getAllOrdersForAdmin...');
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleFetchOrderDetails = (orderId) => {
    dispatch(getOrderDetailsForAdmin(orderId));
  };

  // console.log('orderDetails:', orderDetails);
  // console.log('isLoading:', isLoading);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
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
                    open={openDetailsDialog && selectedOrderId === orderItem._id}
                    onOpenChange={() => {
                      setOpenDetailsDialog(false);
                      dispatch(resetOrderDetails())
                    }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setSelectedOrderId(orderItem._id);
                        setOpenDetailsDialog(true);
                        handleFetchOrderDetails(orderItem?._id)
                      }}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <AdOrderDetails orderDetails={orderDetails} />
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

export default AdminOrderView