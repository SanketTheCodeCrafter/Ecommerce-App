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

  // console.log(orderList, 'orderList')

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

            {orderList && orderList.length > 0 ? orderList.map((orderItem) => {
              return (

                <TableRow>
                  <TableCell>{orderItem?._id}</TableCell>
                  <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge className={`py-1 px-3 
                  ${orderItem?.orderStatus === "Confirmed" ? "bg-green-500" :
                        orderItem?.orderStatus === 'Rejected' ? "bg-red-600" : "bg-black"}`}>
                      {orderItem?.orderStatus}
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
              )
            }) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders