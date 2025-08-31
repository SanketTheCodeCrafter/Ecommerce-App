import Order from "../../models/Order.js";



export const getAllOrdersOfAllUsers = async (req, res) => {
    console.log('Admin order request received');
    try {
        const orders = await Order.find({});
        // console.log('Orders found:', orders);
        // console.log('Number of orders:', orders.length);

        if (!orders || orders.length === 0) {
            // console.log('No orders found in database');
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
        console.error('Error in getAllOrdersOfAllUsers:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching orders",
        })
    }
}

export const getOrderDetailsForAdmin = async (req, res) => {
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

export const updateOrderStatus = async (req, res)=>{
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const order=await Order.findById(id);

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }

        await Order.findByIdAndUpdate(id, { orderStatus });

        res.status(200).json({
            success: true,
            message: "Order status is updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
}