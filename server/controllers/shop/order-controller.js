import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import paypalClient from '../../helper/paypal.js';
import Order from '../../models/Order.js';
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

export const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
        } = req.body;
        if (!userId || !cartItems || !addressInfo || !orderStatus || !paymentMethod || !paymentStatus || !totalAmount || !orderDate || !orderUpdateDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create PayPal order
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");

        const itemTotal = cartItems
            .reduce((sum, item) => sum + (item.price * item.quantity), 0)
            .toFixed(2);

        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: totalAmount.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: itemTotal
                        }
                    }
                },
                items: cartItems.map((item) => ({
                    name: item.title,
                    sku: item.productId,
                    unit_amount: {
                        currency_code: 'USD',
                        value: item.price.toFixed(2)
                    },
                    quantity: item.quantity
                }))
            }],
            application_context: {
                return_url: process.env.FRONTEND_URL + "/paypal-return",
                cancel_url: process.env.FRONTEND_URL + "/paypal-cancel"
            }
        });

        const paypalOrder = await paypalClient.execute(request);

        // Find approval URL
        const approvalUrl = paypalOrder.result.links.find(link => link.rel === 'approve')?.href;

        // Save order in DB
        const newlyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId: paypalOrder.result.id
        });

        await newlyCreatedOrder.save();
        console.log('Order saved successfully:', newlyCreatedOrder._id);

        res.status(201).json({
            success: true,
            orderId: newlyCreatedOrder._id,
            paypalOrderId: paypalOrder.result.id,
            approvalUrl
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while creating order"
        });
    }
}

export const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Capture the PayPal order
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(paymentId);
        request.prefer("return=representation");

        const capture = await paypalClient.execute(request);

        if (capture.result.status === 'COMPLETED') {
            order.paymentStatus = 'Paid';
            order.orderStatus = 'Confirmed';
            order.paymentId = paymentId;
            order.payerId = payerId;

            for (let item of order.cartItems) {
                let product = await Product.findById(item.productId);

                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: `Not enough stock for this product ${product.title}`,
                    })
                }

                product.totalStock -= item.quantity;

                await product.save();
            }

            const getCartId = order.cartId;
            await Cart.findByIdAndDelete(getCartId);

            await order.save();

            res.status(200).json({
                success: true,
                message: "Order confirmed",
                data: order,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment capture failed",
            });
        }
    } catch (error) {
        console.error("Error capturing payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while capturing payment",
        })
    }
}

export const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId });

        if (!orders) {
            return res.status(404).json({
                success: false,
                message: "No orders found",
            });
        }
        res.status(200).json({
            success: true,
            data: orders,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching orders",
        })
    }
}

export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }

        res.status(200).json({
            success: true,
            data: order,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching order details",
        })
    }
}