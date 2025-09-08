import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogDescription, DialogTitle, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { StarIcon } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { setProductDetails } from '@/store/shop/product-slice'

const ProductDetails = ({ open, setOpen, productDetails }) => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const cartItemsArray = cartItems?.items || [];

    function handleAddToCart(getCurrentProductId, getTotalStock) {
        // console.log(getCurrentProductId, 'getCurrentProductId')
        // console.log(user, 'user')

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

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]'>
                <div className="relative overflow-hidden rounded-lg w-full max-w-[400px] aspect-[4/5] flex items-center justify-center bg-gray-100">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <div>
                        <DialogTitle asChild>
                            <h1 className='text-[3rem] font-extrabold'>
                                {productDetails?.title}
                            </h1>
                        </DialogTitle>
                        <DialogDescription asChild>
                            <p className='text-2xl mb-5 mt-4'>
                                {productDetails?.description || "No description available."}
                            </p>
                        </DialogDescription>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={`text-xl font-semibold text-primary ${productDetails?.salePrice > 0 ? 'line-through' : ''}`}>
                            ${productDetails?.price}
                        </p>
                        {productDetails?.salePrice > 0 ? (
                            <p className='text-2xl font-bold text-primary'>
                                ${productDetails?.salePrice}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarIcon className='w-5 fill-primary' />
                            <StarIcon className='w-5 fill-primary' />
                            <StarIcon className='w-5 fill-primary' />
                            <StarIcon className='w-5 fill-primary' />
                            <StarIcon className='w-5 fill-primary' />
                        </div>
                        <span className='text-muted-foreground'>(4.5)</span>
                    </div>

                    <div className="mt-5">
                        {productDetails?.totalStock === 0 ? (
                            <Button className="w-full opacity-60 cursor-not-allowed">
                                Out of Stock
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                onClick={() =>
                                    handleAddToCart(
                                        productDetails?._id,
                                        productDetails?.totalStock
                                    )
                                }
                            >
                                Add to Cart
                            </Button>
                        )}

                    </div>
                    <Separator />

                    <div className="max-h-[300px] overflow-auto">
                        <h2 className='text-2xl font-bold mb-4 mt-4'>Reviews</h2>
                        <div className="grid gap-6">
                            <div className="flex items-center gap-x-3">
                                <Avatar className={'w-10 h-10 border'}>
                                    <AvatarFallback>SM</AvatarFallback>
                                </Avatar>
                                <h3 className='font-bold'>Sanket Nagap</h3>
                                <div className="flex items-center gap-0.5">
                                    <StarIcon className='w-5 fill-primary' />
                                    <StarIcon className='w-5 fill-primary' />
                                    <StarIcon className='w-5 fill-primary' />
                                    <StarIcon className='w-5 fill-primary' />
                                    <StarIcon className='w-5 fill-primary' />
                                </div>
                            </div>
                            <p className='text-muted-foreground'>
                                This is an awesome product
                            </p>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <Input placeholder="Write a review..." />
                            <Button>Submit</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetails