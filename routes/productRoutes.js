const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');

// Product routes
router.get('/', productController.getAllProducts);
router.get('/admin', authenticate, productController.getAllProductsAdmin);
router.get('/add', productController.getAddProduct);
router.post('/add', productController.postAddProduct);
router.get('/edit/:id',authenticate, productController.getEditProduct);
router.post('/edit/:id', authenticate, productController.postEditProduct);
router.get('/delete/:id', authenticate, productController.deleteProduct);

module.exports = router;
