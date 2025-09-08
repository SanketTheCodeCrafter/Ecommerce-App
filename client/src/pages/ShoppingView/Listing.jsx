import Filter from '@/components/ShoppingView/Filter'
import ShoppingProductTile from '@/components/ShoppingView/ShoppingProductTile'
import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { sortOptions } from '@/config/registerFormControls'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/product-slice'
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ArrowUpDownIcon, ParkingMeter } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import ProductDetails from './ProductDetails'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { useLocation } from 'react-router-dom';

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramVAlue = value.join(',');

      queryParams.push(`${key}=${encodeURIComponent(paramVAlue)}`)
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join('&');
}

const Listing = () => {
  const dispatch = useDispatch()
  const { productList, productDetails } = useSelector((state) => state.shopProducts)
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state)=>state.auth)
  const location = useLocation();
  const {cartItems}=useSelector((state)=>state.shopCart);
  const cartItemsArray = cartItems?.items || [];

  function handleSort(value) {
    console.log(value)
    setSort(value)
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilter = { ...filter };
    const indexOfCurrentSection = Object.keys(cpyFilter).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilter = {
        ...cpyFilter,
        [getSectionId]: [getCurrentOption]
      };
    } else {
      const indexOfCurrentOption =
        cpyFilter[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        cpyFilter[getSectionId].push(getCurrentOption);
      } else {
        cpyFilter[getSectionId].splice(indexOfCurrentOption, 1);
        if (cpyFilter[getSectionId].length === 0) {
          delete cpyFilter[getSectionId];
        }
      }
    }

    setFilter(cpyFilter);
    sessionStorage.setItem("filter", JSON.stringify(cpyFilter));
  }

  function handleGetProductDetails(productId) {
    console.log(productId, "productId")
    dispatch(fetchProductDetails(productId))
  }

  function handleAddToCart(getCurrentProductId, getTotalStock){
    const getCartItems = cartItemsArray;

    if(getCartItems.length){
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item)=>item.productId===getCurrentProductId
      );
      if(indexOfCurrentCartItem>-1){
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if(typeof getTotalStock === 'number' && getQuantity + 1 > getTotalStock){
          toast.warning(`Only ${getQuantity} items left in stock`)
          return;
        }
      }
    }
    
    dispatch(addToCart({
      userId: user?.id,
      productId: getCurrentProductId,
      quantity: 1,
    })).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchCartItems(user?.id));
        toast.success('Product added to cart!');
      }else{
        if(data?.payload?.message){
          toast.error(data?.payload?.message);
        }else{
          toast.error('Something went wrong!');
        }
      }
    })
  }



  // Set default sort ONCE on mount and fetch cart items
  useEffect(() => {
    setSort('price-lowtohigh');
    // Fetch cart items when component mounts if user is logged in
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [user?.id, dispatch]);

  // On mount or location change, set filter from searchParams (URL is source of truth)
  useEffect(() => {
    const paramsObj = {};
    for (const [key, value] of searchParams.entries()) {
      paramsObj[key] = value.split(',');
    }
    // If no params, fallback to sessionStorage (for first navigation)
    if (Object.keys(paramsObj).length > 0) {
      setFilter(paramsObj);
    } else {
      const sessionFilter = JSON.parse(sessionStorage.getItem('filter')) || {};
      setFilter(sessionFilter);
      // Also update the URL to reflect the session filter
      if (Object.keys(sessionFilter).length > 0) {
        const createQueryString = createSearchParamsHelper(sessionFilter);
        setSearchParams(createQueryString);
      }
    }
  }, [location]);

  // When filter or sort changes, fetch products
  useEffect(() => {
    if (filter !== null && sort !== null) {
      dispatch(fetchAllFilteredProducts({ filterParams: filter, sortParams: sort }))
    }
  }, [dispatch, sort, filter])

  // Only update search params if they are different from current
  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      const createQueryString = createSearchParamsHelper(filter);
      const newParams = new URLSearchParams(createQueryString).toString();
      if (newParams !== searchParams.toString()) {
        setSearchParams(newParams);
      }
    }
  }, [filter, searchParams, setSearchParams]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails])


  

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 md:p-4 bg-muted/30">
      <Filter filter={filter} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-md shadow border border-muted/40">
        <div className="p-3 border-b border-muted/30 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground/90">All Products</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground/80">{productList.length} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-foreground/80"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-xs">Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[180px] m-2 shadow-md border border-muted/30 p-4 rounded-md z-50 bg-white"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem, idx) => (
                    <React.Fragment key={sortItem.id}>
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        className="text-sm px-2 py-2 rounded cursor-pointer hover:bg-gray-100 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                      {/* Add separator except after the last item */}
                      {idx < sortOptions.length - 1 && (
                        <div className="my-1 h-px bg-gray-200" />
                      )}
                    </React.Fragment>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {
            productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  product={productItem}
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart} />
              ))
            ) : null
          }
        </div>

      </div>
      <ProductDetails open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  )
}

export default Listing