import express from 'express';
import { getAllOrdersOfAllUsers, getOrderDetailsForAdmin } from '../../controllers/admin/order-controller.js';

const router = express.Router();

router.get('/get', getAllOrdersOfAllUsers);
router.get('/details/:id', getOrderDetailsForAdmin);

export default router;