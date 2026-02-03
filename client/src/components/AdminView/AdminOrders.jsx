import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice'
import AdOrderDetails from './AdOrderDetails'
import { Badge } from '../ui/badge'
import { Package, Calendar, Eye, ChevronRight, ShoppingBag } from 'lucide-react'

// Helper function to get status badge styling
const getStatusStyles = (status) => {
  const statusLower = status?.toLowerCase() || '';
  switch (statusLower) {
    case 'confirmed':
      return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20';
    case 'rejected':
      return 'bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/20';
    case 'delivered':
      return 'bg-blue-500/15 text-blue-600 border-blue-500/30 hover:bg-blue-500/20';
    case 'inprocess':
    case 'in process':
      return 'bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/20';
    case 'inshipping':
    case 'in shipping':
      return 'bg-purple-500/15 text-purple-600 border-purple-500/30 hover:bg-purple-500/20';
    case 'pending':
      return 'bg-gray-500/15 text-gray-600 border-gray-500/30 hover:bg-gray-500/20';
    default:
      return 'bg-gray-500/15 text-gray-600 border-gray-500/30 hover:bg-gray-500/20';
  }
};

// Format status text
const formatStatus = (status) => {
  if (!status) return 'N/A';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Truncate Order ID for display
const truncateOrderId = (id) => {
  if (!id) return 'N/A';
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}...${id.slice(-4)}`;
};

const AdminOrderView = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleFetchOrderDetails = (orderId) => {
    dispatch(getOrderDetailsForAdmin(orderId));
  };

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
  }

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Mobile Order Card Component
  const OrderCard = ({ orderItem }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Card Header - Status & Price */}
      <div className="flex items-center justify-between mb-3">
        <Badge
          variant="outline"
          className={`py-1 px-3 font-medium border ${getStatusStyles(orderItem?.orderStatus)}`}
        >
          {formatStatus(orderItem?.orderStatus)}
        </Badge>
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
          ${orderItem?.totalAmount}
        </span>
      </div>

      {/* Order Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Package className="w-4 h-4" />
          <span className="font-medium">Order:</span>
          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded" title={orderItem?._id}>
            {truncateOrderId(orderItem?._id)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Date:</span>
          <span>{formatDate(orderItem?.orderDate)}</span>
        </div>
      </div>

      {/* View Details Button */}
      <Button
        onClick={() => handleFetchOrderDetails(orderItem?._id)}
        className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Details
        <ChevronRight className="w-4 h-4 ml-auto" />
      </Button>
    </div>
  );

  return (
    <>
      <Card className="border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            All Orders
            {orderList && orderList.length > 0 && (
              <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full ml-2">
                {orderList.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {/* Mobile View - Card Layout */}
          <div className="block md:hidden space-y-3">
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <OrderCard key={orderItem._id} orderItem={orderItem} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    <span>Loading orders...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Package className="w-12 h-12 text-gray-300" />
                    <span>No orders found</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden md:block">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Order ID</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Total</TableHead>
                    <TableHead className="text-right">
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderList && orderList.length > 0 ? orderList.map((orderItem) => (
                    <TableRow
                      key={orderItem._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="font-mono text-sm">
                        <span
                          className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded cursor-help"
                          title={orderItem?._id}
                        >
                          {truncateOrderId(orderItem?._id)}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {formatDate(orderItem?.orderDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`py-1 px-3 font-medium border ${getStatusStyles(orderItem?.orderStatus)}`}
                        >
                          {formatStatus(orderItem?.orderStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                        ${orderItem?.totalAmount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        {isLoading ? (
                          <div className="flex flex-col items-center gap-3 text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                            <span>Loading orders...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <Package className="w-12 h-12 text-gray-300" />
                            <span>No orders found</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single Dialog outside the loop - fixes aria-hidden focus issue */}
      <Dialog open={openDetailsDialog} onOpenChange={handleCloseDialog}>
        <AdOrderDetails orderDetails={orderDetails} onClose={handleCloseDialog} />
      </Dialog>
    </>
  )
}

export default AdminOrderView