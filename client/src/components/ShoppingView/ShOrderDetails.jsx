import React from 'react'
import { DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Separator } from '../ui/separator'
import { Label } from '@radix-ui/react-label'
import { useSelector } from 'react-redux'
import { Badge } from '../ui/badge'
import { Package, Truck, CreditCard, Calendar, Hash, MapPin, User, Phone, FileText, X } from 'lucide-react'
import { Button } from '../ui/button'

// Helper function to get status badge styling
const getStatusStyles = (status) => {
  const statusLower = status?.toLowerCase() || '';
  switch (statusLower) {
    case 'confirmed':
      return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30';
    case 'rejected':
      return 'bg-red-500/15 text-red-600 border-red-500/30';
    case 'delivered':
      return 'bg-blue-500/15 text-blue-600 border-blue-500/30';
    case 'inprocess':
    case 'in process':
      return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
    case 'inshipping':
    case 'in shipping':
      return 'bg-purple-500/15 text-purple-600 border-purple-500/30';
    case 'pending':
      return 'bg-gray-500/15 text-gray-600 border-gray-500/30';
    default:
      return 'bg-gray-500/15 text-gray-600 border-gray-500/30';
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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const ShOrderDetails = ({ orderDetails, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  // Loading state
  if (!orderDetails) {
    return (
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0'>
      {/* Close Button */}
      <DialogClose asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogClose>

      {/* Header Section */}
      <DialogHeader className="p-4 sm:p-6 pb-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-10">
          <div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Order Details
            </DialogTitle>
            <DialogDescription className="flex items-center gap-1.5 mt-1 text-sm">
              <Hash className="w-3.5 h-3.5" />
              <span className="font-mono text-xs bg-white dark:bg-gray-700 px-2 py-0.5 rounded border">
                {orderDetails?._id?.slice(-8)?.toUpperCase()}
              </span>
            </DialogDescription>
          </div>
          <Badge
            variant="outline"
            className={`py-1.5 px-4 font-semibold border text-sm ${getStatusStyles(orderDetails?.orderStatus)}`}
          >
            {formatStatus(orderDetails?.orderStatus)}
          </Badge>
        </div>
      </DialogHeader>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Order Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Order Date</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {formatDate(orderDetails?.orderDate)}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Total Amount</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              ${orderDetails?.totalAmount}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment Method</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm capitalize">
              {orderDetails?.paymentMethod || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Payment Status</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm capitalize">
              {orderDetails?.paymentStatus || 'N/A'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Order Items Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Order Items
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {orderDetails?.cartItems?.length || 0} items
            </span>
          </div>

          <div className="space-y-2">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white dark:bg-gray-800/30 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      ${item.price}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)} total
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <Package className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p>No items found</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Shipping Info Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Shipping Information
            </h3>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700/50">
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.userName || 'N/A'}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  <p>{orderDetails?.addressInfo?.address || 'N/A'}</p>
                  <p>
                    {orderDetails?.addressInfo?.city}
                    {orderDetails?.addressInfo?.pincode && ` - ${orderDetails.addressInfo.pincode}`}
                  </p>
                </div>
              </div>

              {orderDetails?.addressInfo?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {orderDetails.addressInfo.phone}
                  </span>
                </div>
              )}

              {orderDetails?.addressInfo?.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivery Notes:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{orderDetails.addressInfo.notes}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default ShOrderDetails