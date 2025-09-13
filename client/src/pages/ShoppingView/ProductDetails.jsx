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
import { X } from "lucide-react"

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
        const existingCartItem = cartItemsArray.find((item) => item.productId === getCurrentProductId);
        const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;

        if (currentQuantity >= getTotalStock) {
            toast.error('Maximum stock limit reached!');
            return;
        }

        dispatch(addToCart({
            userId: user?.id,
            productId: getCurrentProductId,
            quantity: 1,
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast.success('Product added to cart successfully!');
            }
        });
    }

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails(null));
    }

    function handleRatingChange(newRating) {
        setRating(newRating);
    }

    function handleAddReview(){
        if(!user?.id){
            toast.error('Please login to add a review!');
            return;
        }

        if(rating === 0){
            toast.error('Please select a rating!');
            return;
        }

        if(reviewMsg.trim() === ''){
            toast.error('Please write a review message!');
            return;
        }

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
            <DialogContent className='p-0 max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw] max-h-[90vh] overflow-hidden'>
                <div className='flex flex-col h-full'>
                    {/* Mobile Header with Close Button */}
                    <div className="flex items-center justify-between p-4 border-b sm:hidden">
                        <h2 className="text-lg font-semibold truncate pr-2">{productDetails?.title}</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDialogClose}
                            className="h-8 w-8 shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className='flex-1 overflow-y-auto'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 p-4 sm:p-6'>
                            {/* Product Image Section */}
                            <div className="w-full order-1">
                                <img
                                    src={productDetails?.image}
                                    alt={productDetails?.title}
                                    className='w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-lg'
                                />
                            </div>

                            {/* Product Details Section */}
                            <div className="flex flex-col order-2">
                                <div className="flex-1">
                                    {/* Desktop Title */}
                                    <DialogTitle className="text-xl sm:text-2xl font-bold mb-2 hidden sm:block">
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
                                                    className={`w-4 sm:w-5 ${star <= roundedAverage ? 'fill-primary' : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            ({reviews.length} reviews)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`text-xl sm:text-2xl font-bold ${productDetails?.salePrice > 0 ? 'line-through text-muted-foreground' : ''}`}>
                                            ${productDetails?.price}
                                        </span>
                                        {productDetails?.salePrice > 0 && (
                                            <span className="text-xl sm:text-2xl font-bold text-primary">
                                                ${productDetails?.salePrice}
                                            </span>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                                        disabled={productDetails?.totalStock === 0}
                                        className="w-full mb-6"
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
                                                    <div key={rev?._id} className="border rounded-lg p-3 sm:p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="text-xs">
                                                                    {rev?.userName?.[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm truncate">{rev?.userName}</p>
                                                                <div className="flex">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <StarIcon
                                                                            key={star}
                                                                            className={`w-3 sm:w-4 ${star <= (Number(rev?.reviewValue) || 0) ? 'fill-primary' : ''}`}
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
                                                className="w-full"
                                            />
                                            <Button
                                                onClick={handleAddReview}
                                                disabled={reviewMsg.trim() === ''}
                                                className="w-full"
                                            >
                                                Submit Review
                                            </Button>
                                        </div>
                                    </div>
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