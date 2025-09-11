import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogDescription, DialogTitle, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { StarIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { setProductDetails } from '@/store/shop/product-slice'
import StarRatingComponent from '@/components/CommonCompo/StarRating'
import { Label } from '@/components/ui/label'
import { addReview, getReviews } from '@/store/shop/review-slice'

const ProductDetails = ({ open, setOpen, productDetails }) => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { reviews = [] } = useSelector((state) => state.shopReview);
    const cartItemsArray = cartItems?.items || [];
    const [rating, setRating] = useState(0);
    const [reviewMsg, setReviewMsg] = useState('');

    useEffect(() => {
        if (open) {
            setRating(0);
            setReviewMsg('');
        }
    }, [open, productDetails?._id]);

    useEffect(() => {
        if (open && productDetails?._id) {
            dispatch(getReviews(productDetails._id));
        }
    }, [open, productDetails?._id]);

    const averageRating = (() => {
        if (reviews && reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + (Number(r?.reviewValue) || 0), 0);
            return sum / reviews.length;
        }
        return Number(productDetails?.averageReview) || 0;
    })();
    const roundedAverage = Math.round(averageRating || 0);

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

    function handleRatingChange(newRating) {
        setRating(newRating);
    }

    function handleAddReview(){
        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
        })).then((data)=>{
            const success = data?.payload?.success;
            const message = data?.payload?.message;
            if(success){
                setRating(0);
                setReviewMsg('');
                dispatch(getReviews(productDetails?._id));
                toast.success('Review added successfully!');
            }else{
                if(message){
                    toast.error(message);
                }else{
                    toast.error('Something went wrong!');
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='p-4 sm:p-6 max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw]'>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>

                    {/* Product Image Section */}
                    <div className="w-full">
                        <img
                            src={productDetails?.image}
                            alt={productDetails?.title}
                            className='w-full h-[300px] md:h-[400px] object-cover rounded-lg'
                        />
                    </div>

                    {/* Product Details Section */}
                    <div className="flex flex-col">
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold mb-2">
                                {productDetails?.title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mb-4">
                                {productDetails?.description}
                            </DialogDescription>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            className={`w-5 ${star <= roundedAverage ? 'fill-primary' : ''}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    ({reviews.length} reviews)
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <span className={`text-2xl font-bold ${productDetails?.salePrice > 0 ? 'line-through text-muted-foreground' : ''}`}>
                                    ${productDetails?.price}
                                </span>
                                {productDetails?.salePrice > 0 && (
                                    <span className="text-2xl font-bold text-primary">
                                        ${productDetails?.salePrice}
                                    </span>
                                )}
                            </div>

                            <Button
                                onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                                disabled={productDetails?.totalStock === 0}
                                className="w-full md:w-auto mb-6"
                            >
                                {productDetails?.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>

                            <Separator className="my-6" />

                            {/* Reviews Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                                <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                    {reviews.length === 0 ? (
                                        <p className="text-muted-foreground">No reviews yet</p>
                                    ) : (
                                        reviews.map((rev) => (
                                            <div key={rev?._id} className="border rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {rev?.userName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{rev?.userName}</p>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <StarIcon
                                                                    key={star}
                                                                    className={`w-4 ${star <= (Number(rev?.reviewValue) || 0) ? 'fill-primary' : ''}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    {rev?.reviewMessage}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Add Review Section */}
                                <div className="space-y-4 mt-6">
                                    <Label>Write a review</Label>
                                    <div className="flex gap-1">
                                        <StarRatingComponent
                                            rating={rating}
                                            handleRatingChange={handleRatingChange}
                                        />
                                    </div>
                                    <Input
                                        name="reviewMsg"
                                        value={reviewMsg}
                                        onChange={(event) => setReviewMsg(event.target.value)}
                                        placeholder="Write a review..."
                                    />
                                    <Button
                                        onClick={handleAddReview}
                                        disabled={reviewMsg.trim() === ''}
                                        className="w-full md:w-auto"
                                    >
                                        Submit Review
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetails