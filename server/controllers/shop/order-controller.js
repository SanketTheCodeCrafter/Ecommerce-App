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
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: totalAmount.toFixed(2)
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
                return_url: "http://localhost:5173/shop/paypal-return",
                cancel_url: "http://localhost:5173/shop/paypal-cancel"
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
        // ...existing code...
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while capturing payment",
        })
    }
}

