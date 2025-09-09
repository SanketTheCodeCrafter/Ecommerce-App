import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { fetchProductDetails } from '@/store/shop/product-slice';
import ProductDetails from './ProductDetails';
import { Input } from '@/components/ui/input';
import ShoppingProductTile from '@/components/ShoppingView/ShoppingProductTile';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const cartItemsArray = cartItems?.items || [];

  useEffect(() => {
    if (keyword && keyword.trim() !== '' && keyword.trim().length > 0) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 500);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword])

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItemsArray;

    if (getCartItems.length) {
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (typeof getTotalStock === 'number' && getQuantity + 1 > getTotalStock) {
          toast.warning(`Only ${getQuantity} items left in stock`)
          return;
        }
      }
    }

    dispatch(addToCart({
      userId: user?.id,
      productId: getCurrentProductId,
      quantity: 1,
    })).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success('Product added to cart!');
      } else {
        if (data?.payload?.message) {
          toast.error(data?.payload?.message);
        } else {
          toast.error('Something went wrong!');
        }
      }
    })
  }

  function handleGetProductDetails(productId) {
    console.log(productId, "productId")
    dispatch(fetchProductDetails(productId))
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddToCart={handleAddToCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetails
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default Search