// app.js
const express = require('express');
const fs = require('fs').promises;
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager();


app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json({ products: products.slice(0, limit) });
        } else {
            res.json({ products });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductsById(productId);

        if (product !== 'Product not found') {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


app.listen(port, () => {
    console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
