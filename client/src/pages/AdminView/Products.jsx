import AdminProductTile from '@/components/AdminView/AdminProductTile';
import ProductImageUpload from '@/components/AdminView/ProductImageUpload';
import Form from '@/components/CommonCompo/Form';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config/registerFormControls';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin/products-slic';
import { Item } from '@radix-ui/react-select';
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { data } from 'react-router-dom';
import { toast } from 'sonner';


const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: '',
};

const Products = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProductsSlice);

  function onSubmit(e) {
    e.preventDefault();

    currentEditedId !== null ? dispatch(editProduct({
      id: currentEditedId, formData
    })).then((data)=>{
      console.log(data, "edit")

      if(data?.payload.success){
        dispatch(fetchAllProducts());
        setOpenCreateProductsDialog(false);
        setFormData(initialFormData);
        setCurrentEditedId(null);
      }
    }) : 
    dispatch(addNewProduct({
      ...formData,
      image: uploadedImageUrl,
    })).then((data) => {
      console.log(data)

      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenCreateProductsDialog(false);
        setImageFile(null);
        setFormData(initialFormData);
        toast.success("Product added successfully!");
      }
    })
  }

  function handleDelete(getCurrentProductId){
    console.log(getCurrentProductId, "delete")
    dispatch(deleteProduct(getCurrentProductId)).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        toast.success("Product deleted successfully!");
      }
    })
  }

  function isFormValid() {
  return Object.values(formData).every(value => value !== '');
}

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])

  useEffect(() => {
    console.log("uploadedImageUrl changed:", uploadedImageUrl);
  }, [uploadedImageUrl]);

  console.log(productList, uploadedImageUrl)

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
          setCurrentEditedId(null);
          setFormData(initialFormData)
        }}
      >
        <SheetContent side='right' className={'overflow-auto p-6'}>
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? 'Edit Product' : 'Add New Product'}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <Form
            formControls={addProductFormElements}
            formData={formData}
            setFormData={setFormData}
            buttonText={ currentEditedId !== null ? 'Edit Product' : 'Add Product'}
            onSubmit={onSubmit}
            isBtnDisabled={!isFormValid()}
          />
        </SheetContent>
      </Sheet>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {
          productList && productList.length > 0 ?
            productList.map(productItem =>
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                handleDelete={handleDelete}
                product={productItem} />) : null
        }
      </div>
    </Fragment>
  )
}

export default Products