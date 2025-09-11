import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Form from '../CommonCompo/Form';
import { addressFormControls } from '@/config/registerFormControls';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, deleteAddress, editanAddress, fetchAllAddress } from '@/store/shop/address-slice';
import { toast } from 'sonner';
import AddressCard from './AddressCard';

const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
};

const Address = ({currentSelectedAddress, setCurrentSelectedAddress}) => {
    const [formData, setFormData] = useState(initialAddressFormData);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { addressList } = useSelector(state => state.shopAddress);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    function handleManageAddress(event) {
    event.preventDefault();

    if(addressList.length >= 3 && currentEditedId === null) {
        setFormData(initialAddressFormData);
        toast.warning('You can only have up to 3 addresses. Please delete an existing address before adding a new one.');
        return;
    }

    currentEditedId !== null ? dispatch(editanAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddress(user?.id)); // Also fixed typo: fetchAllAdress -> fetchAllAddress
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);
                toast.success('Address updated successfully!');
            }
        })
        :
        dispatch(addNewAddress({
            ...formData,
            userId: user?.id
        })).then(data => {
            console.log(data)
            if (data?.payload?.success) {
                dispatch(fetchAllAddress(user?.id));
                setFormData(initialAddressFormData);
                toast.success("Address added successfully!")
            }
        })
    
}

    function isFormValid() {
        return Object.keys(formData).map((key) => formData[key].trim() !== '').every((item) => item);
    }

    function handleDeleteAddress(getCurrentAddress) {
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddress(user?.id));
                toast.success("Address deleted successfully!");
            }
        })
    }

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes,
        })
    }

    useEffect(() => {
    if(user?.id){
        dispatch(fetchAllAddress(user?.id)).then((data) => {
            // console.log('Fetched addresses:', data);
        });
    }
}, [dispatch, user?.id])

    // console.log(addressList, 'addressList');

    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {addressList && addressList.length > 0 ? addressList.map((singleAddressItem) => (
                    <AddressCard
                        handleDeleteAddress={handleDeleteAddress}
                        handleEditAddress={handleEditAddress}
                        addressInfo={singleAddressItem} key={singleAddressItem._id} 
                        isSelected={currentSelectedAddress?._id === singleAddressItem._id}
                        setCurrentSelectedAddress={setCurrentSelectedAddress}
                        />
                )) : null}
            </div>
            <CardHeader>
                <CardTitle>{
                    currentEditedId == null ? 'Add New Address' : 'Edit Address'
                }</CardTitle>
            </CardHeader>
            <CardContent className={'space-y-3'}>
                <Form
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId == null ? 'Add New' : 'Edit'}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    )
}

export default Address