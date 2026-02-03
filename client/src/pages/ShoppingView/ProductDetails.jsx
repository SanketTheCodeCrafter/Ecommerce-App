import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogDescription, DialogTitle, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { StarIcon, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { setProductDetails } from '@/store/shop/product-slice'
import StarRatingComponent from '@/components/CommonCompo/StarRating'
import { Label } from '@/components/ui/label'
import { addReview, getReviews } from '@/store/shop/review-slice'
import LazyImage from '@/components/CommonCompo/LazyImage'

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

    function handleAddReview() {
        if (!user?.id) {
            toast.error('Please login to add a review!');
            return;
        }

        if (rating === 0) {
            toast.error('Please select a rating!');
            return;
        }

        if (reviewMsg.trim() === '') {
            toast.error('Please write a review message!');
            return;
        }

        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
        })).then((data) => {
            const success = data?.payload?.success;
            const message = data?.payload?.message;
            if (success) {
                setRating(0);
                setReviewMsg('');
                dispatch(getReviews(productDetails?._id));
                toast.success('Review added successfully!');
            } else {
                if (message) {
                    toast.error(message);
                } else {
                    toast.error('Something went wrong!');
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='p-0 max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col'>
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white sticky top-0 z-10 shrink-0">
                    <h2 className="text-base sm:text-lg font-semibold truncate pr-2">{productDetails?.title}</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDialogClose}
                        className="h-8 w-8 shrink-0 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className='flex-1 overflow-y-auto overscroll-contain'>
                    <div className='p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6'>
                        {/* Product Image */}
                        <div className="w-full bg-gray-50 rounded-lg">
                            <LazyImage
                                src={productDetails?.image}
                                alt={productDetails?.title || 'Product image'}
                                className='w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] object-contain rounded-lg'
                                loading="eager"
                                decoding="async"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-3 sm:space-y-4">
                            <DialogDescription className="text-sm text-muted-foreground">
                                {productDetails?.description}
                            </DialogDescription>

                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= roundedAverage ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm text-muted-foreground">
                                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                <span className={`text-lg sm:text-xl md:text-2xl font-bold ${productDetails?.salePrice > 0 ? 'line-through text-muted-foreground' : 'text-primary'}`}>
                                    ${productDetails?.price}
                                </span>
                                {productDetails?.salePrice > 0 && (
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                                        ${productDetails?.salePrice}
                                    </span>
                                )}
                            </div>

                            <Button
                                onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                                disabled={productDetails?.totalStock === 0}
                                className="w-full text-sm sm:text-base"
                            >
                                {productDetails?.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                        </div>

                        <Separator />

                        {/* Reviews Section */}
                        <div className="space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold">Customer Reviews</h3>

                            {/* Existing Reviews */}
                            <div className="space-y-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {reviews.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev?._id} className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-8 w-8 shrink-0">
                                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                        {rev?.userName?.[0]?.toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                        <p className="font-medium text-sm">{rev?.userName || 'Anonymous'}</p>
                                                        <div className="flex shrink-0">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <StarIcon
                                                                    key={star}
                                                                    className={`w-3 h-3 ${star <= (Number(rev?.reviewValue) || 0) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm leading-relaxed break-words">
                                                        {rev?.reviewMessage}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Review Section */}
                            <div className="space-y-3 sm:space-y-4 pt-4 border-t">
                                <Label className="text-sm sm:text-base font-medium">Write a review</Label>
                                <div className="flex gap-1 flex-wrap">
                                    <StarRatingComponent
                                        rating={rating}
                                        handleRatingChange={handleRatingChange}
                                    />
                                </div>
                                <Input
                                    name="reviewMsg"
                                    value={reviewMsg}
                                    onChange={(event) => setReviewMsg(event.target.value)}
                                    placeholder="Write your review here..."
                                    className="w-full text-sm sm:text-base"
                                />
                                <Button
                                    onClick={handleAddReview}
                                    disabled={reviewMsg.trim() === '' || rating === 0}
                                    className="w-full text-sm sm:text-base"
                                >
                                    Submit Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetails