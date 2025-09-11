import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Button } from '../ui/button'

const AddressCard = ({
    addressInfo,
    handleEditAddress,
    handleDeleteAddress,
    setCurrentSelectedAddress,
    isSelected
}) => {
  return (
    <Card
      onClick={setCurrentSelectedAddress ? ()=>setCurrentSelectedAddress(addressInfo) : null}
      className={`relative cursor-pointer rounded-xl border transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500/70 border-transparent shadow-lg bg-blue-50/60' : 'hover:shadow-md hover:border-blue-200'}`}
    >
        {/* Selected radio indicator */}
        <div className={`absolute right-3 top-3 flex items-center justify-center h-5 w-5 rounded-full border ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'} transition-colors`}>
          <span className={`text-white text-[10px] leading-none ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
            ✓
          </span>
        </div>
        <CardContent className={'grid p-4 gap-2'}>
            <div className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>Delivery Address</div>
            <div className={'mt-1 space-y-1.5'}>
              <div className={'text-sm text-slate-800'}>{addressInfo?.address}</div>
              <div className={'text-sm text-slate-600'}>{addressInfo?.city} · {addressInfo?.pincode}</div>
              <div className={'text-sm text-slate-600'}>Phone: {addressInfo?.phone}</div>
              {addressInfo?.notes ? (
                <div className={'text-sm text-slate-500 italic'}>“{addressInfo?.notes}”</div>
              ) : null}
            </div>
        </CardContent>
        <CardFooter className={'p-3 pt-0 flex justify-end gap-2'}>
          <Button
            onClick={(e)=> { e.stopPropagation(); handleEditAddress(addressInfo)}}
            className={'h-8 px-3 text-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}
          >
            Edit
          </Button>
          <Button
            onClick={(e)=> { e.stopPropagation(); handleDeleteAddress(addressInfo)}}
            className={'h-8 px-3 text-sm border border-red-200 bg-red-50 hover:bg-red-100 text-red-700'}
          >
            Delete
          </Button>
        </CardFooter>
    </Card>
  )
}

export default AddressCard