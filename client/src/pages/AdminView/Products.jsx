import ProductImageUpload from '@/components/AdminView/ProductImageUpload';
import Form from '@/components/CommonCompo/Form';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config/registerFormControls';
import React, { Fragment, useState } from 'react'


const initialFormData={
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  pirce: '',
  salePrice: '',
};

const Products = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData]=useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={()=> setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Sheet 
        open={openCreateProductsDialog}
        onOpenChange={()=>{
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
        }}
        >
          <SheetContent side='right' className={'overflow-auto p-6'}>
            <SheetHeader>
              <SheetTitle>
                Add New Product
              </SheetTitle>
            </SheetHeader>

            <ProductImageUpload 
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
            />

            <Form 
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={'Add Product'}
            />
          </SheetContent>
        </Sheet>
      </div>
    </Fragment>
  )
}

export default Products