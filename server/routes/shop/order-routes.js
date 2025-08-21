import express from 'express';
import { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails } from '../../controllers/shop/order-controller.js';


const router = express.Router();

router.post('/create', createOrder);
router.post('/capture-payment', capturePayment);
router.get('/list/:userId', getAllOrdersByUser);
router.get('/details/:id', getOrderDetails);

export default router;