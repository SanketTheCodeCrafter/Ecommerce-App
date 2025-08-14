import express from 'express';
import { createOrder, capturePayment } from '../../controllers/shop/order-controller.js';


const router=express.Router();

router.post('/create', createOrder);
router.post('/capture-payment', capturePayment);

export default router;