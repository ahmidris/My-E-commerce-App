import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

// Global Variables
const currency = 'usd';
const deliveryCharge = 10;

// Gateway Initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Place order using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user cart after order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(200).json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
};

// Place order using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.status(200).json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to place order with Stripe" });
    }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Stripe verification failed" });
    }
};

// Place order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to place order with Razorpay" });
    }
};

// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, userId } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ success: true, message: "Payment Successful" });
        } else {
            res.status(400).json({ success: false, message: "Payment Failed" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Razorpay verification failed" });
    }
};

// Get all orders for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

// Get user orders for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch user orders" });
    }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: "Status Updated" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

// Cancel order (user can only cancel if status is 'Order Placed' or 'Packing')
const cancelOrder = async (req, res) => {
    try {
        const { orderId, userId } = req.body;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify the order belongs to the user
        if (order.userId !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
        }

        // Only allow cancellation for certain statuses
        const cancellableStatuses = ['Order Placed', 'Packing'];
        if (!cancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order. Order is already ${order.status}`
            });
        }

        // Update order status to cancelled
        await orderModel.findByIdAndUpdate(orderId, { status: 'Cancelled' });

        res.status(200).json({ success: true, message: "Order cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to cancel order" });
    }
};

// Get dashboard statistics for admin panel
const getDashboardStats = async (req, res) => {
    try {
        // Get total orders count
        const totalOrders = await orderModel.countDocuments({});

        // Get orders by status
        const pendingOrders = await orderModel.countDocuments({ status: 'Order Placed' });
        const processingOrders = await orderModel.countDocuments({ status: { $in: ['Packing', 'Shipped', 'Out for delivery'] } });
        const deliveredOrders = await orderModel.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await orderModel.countDocuments({ status: 'Cancelled' });

        // Get total revenue (from paid orders)
        const revenueResult = await orderModel.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get total users count
        const totalUsers = await userModel.countDocuments({});

        // Get total products count
        const productModel = (await import('../models/productModel.js')).default;
        const totalProducts = await productModel.countDocuments({});

        // Get recent orders (last 10)
        const recentOrders = await orderModel
            .find({})
            .sort({ date: -1 })
            .limit(10)
            .select('_id amount status paymentMethod date');

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await orderModel.countDocuments({ date: { $gte: today.getTime() } });

        const todayRevenueResult = await orderModel.aggregate([
            { $match: { date: { $gte: today.getTime() }, payment: true } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].total : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                ordersByStatus: {
                    pending: pendingOrders,
                    processing: processingOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders
                },
                totalRevenue,
                totalUsers,
                totalProducts,
                todayOrders,
                todayRevenue,
                recentOrders
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
};

export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyRazorpay,
    cancelOrder,
    getDashboardStats
};
