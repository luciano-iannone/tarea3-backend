const fs = require('fs').promises;

class ProductManager {
    constructor(path = "cls.json") {
        this.path = path;
        this.counterId = 0;
        this.products = [];
        this.initializeProducts();
    }

    async initializeProducts() {
        const exists = await fs.access(this.path).then(() => true).catch(() => false);

        if (exists) {
            const productsData = await fs.readFile(this.path, "utf-8");
            this.products = JSON.parse(productsData);
        }
    }

    async getProducts(synchronize = false) {
        let obtainedProducts;

        const fileExists = await fs.access(this.path).then(() => true).catch(() => false);

        if (!fileExists) {
            obtainedProducts = [];
        } else {
            const productsData = await fs.readFile(this.path, "utf-8");
            obtainedProducts = JSON.parse(productsData);
        }

        if (synchronize) {
            this.products = obtainedProducts;
        }

        return obtainedProducts;
    }

    async getProductsById(id) {
        const products = await this.getProducts();
        const product = products.find((prod) => prod.id === id);
        return product || "Product not found";
    }

    async addProduct({ title, description, price, code, thumbnail, stock }) {
        if (!title || !description || !price || !code || !thumbnail || !stock) {
            return "ERROR: Please complete all fields";
        }

        const exists = this.products.some((p) => p.code === code);

        if (exists) {
            return "ERROR: Duplicate code";
        }

        const newProduct = {
            id: this.counterId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        await this.saveProductsToFile();
        return this.products;
    }

    async updateProduct(id, changes) {
        const productIndex = this.products.findIndex((elm) => elm.id === id);

        if (productIndex === -1) {
            return "Product not found";
        }

        Object.keys(changes).forEach((key) => {
            this.products[productIndex][key] = changes[key];
        });

        await this.saveProductsToFile();
        return this.products;
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex((elm) => elm.id === id);

        if (productIndex === -1) {
            return "Product not found";
        }

        this.products.splice(productIndex, 1);
        await this.saveProductsToFile();
        return this.products;
    }

    async saveProductsToFile() {
        const jsonProducts = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, jsonProducts);
    }
}

const rutaPrueba = "resultado_prueba.txt";
const prueba = new ProductManager("./product.json");

const Desafio02 = async () => {
    await fs.writeFile(rutaPrueba, "*************************************************** \n \n ---------------- \n");

    const obj01 = await prueba.getProducts();
    await fs.appendFile(rutaPrueba, JSON.stringify(obj01, null, 2));

    await fs.appendFile(rutaPrueba, "\n \n *************************************************** \n\n ---------------- \n");
    const obj02 = {
        title: "product test",
        description: "This is a test product",
        price: 200,
        thumbnail: "No image",
        code: "abc123",
        stock: 25,
    };
    await fs.appendFile(rutaPrueba, JSON.stringify(await prueba.addProduct(obj02), null, 2));

    await fs.appendFile(rutaPrueba, "\n \n *************************************************** \n  \n ---------------- \n");
    const obj03 = await prueba.getProducts();
    await fs.appendFile(rutaPrueba, JSON.stringify(obj03, null, 2));

    await fs.appendFile(rutaPrueba, "\n \n *************************************************** \n \n ---------------- \n");
    const obj04 = await prueba.getProductsById(0);
    await fs.appendFile(rutaPrueba, JSON.stringify(obj04, null, 2));

    await fs.appendFile(rutaPrueba, "\n \n *************************************************** \n \n ---------------- \n");
    const obj042 = await prueba.getProductsById(3);
    await fs.appendFile(rutaPrueba, JSON.stringify(obj042, null, 2));

    await fs.appendFile(rutaPrueba, "\n \n *************************************************** \n \n ---------------- \n");
    const obj05 = await prueba.updateProduct(0, {
        title: "changed product",
        description: "This is a test product",
        price: 500,
        thumbnail: "No image",
        code: "abc123",
        stock: 20,
    });
    await fs.appendFile(rutaPrueba, JSON.stringify(obj05, null, 2));

    await fs.appendFile(rutaPrueba, "\n \n *************************************************** \n  \n ---------------- \n");
    const obj06 = await prueba.deleteProduct(0);
    await fs.appendFile(rutaPrueba, JSON.stringify(obj06, null, 2));

    await fs.appendFile(rutaPrueba, "\n \n *************************************************** \n \n ---------------- \n");
    const obj062 = await prueba.deleteProduct(0);
    await fs.appendFile(rutaPrueba, JSON.stringify(obj062, null, 2));
};

Desafio02();