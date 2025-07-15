import { ProductsService } from "../services/repositories.js";


const getProducts = async(req,res) => {
    const result = await ProductsService.getProducts();
    if(!result){
        return res.sendServerError("Could not get products");
    }
    return res.sendPayload(null,result);
}

const getProductById = async(req,res) => {
    const data = req.params;
    const result = await ProductsService.getProductById(data.pid);
    if(!result){
        return res.sendServerError("Could not get product");
    }
    return res.sendPayload(null,result);
}

const createProduct = async(req,res) => {
    const data = req.body;
    const newProduct = {
        title: data.title,
        description: data.description,
        code: data.code,
        price: data.price,
        image: data.image || null,
        category: data.category,
        status: data.status || true
    }
    const exists = await ProductsService.searchProduct({ code: newProduct.code });
    if (exists.lenght>1) {
        return res.sendBadRequest("El producto ya existe");
    }else {
        const product = await ProductsService.createProduct(newProduct);
        if (!product) {
            return res.sendServerError("Could not create product");
        }
        return res.sendPayload("Product created successfully", product);
    }
}

const updateProduct = async(req,res) => {
    const pid = req.params.pid;
    const data = req.body;
    const update = {
        title: data.title,
        description: data.description,
        code: data.code,
        price: data.price,
        image: data.image,
        category: data.category,
        status: data.status
    }
    const updatedProduct = await ProductsService.updateProduct(pid, update);
    if (!updatedProduct) {
        return res.sendServerError("Could not update product");
    }
    return res.sendPayload("Product updated successfully", updateProduct);
}

const deleteProduct = async(req,res) => {
    const pid = req.params.pid;
    const result = await ProductsService.deleteProduct(pid);
    if(!result){
        return res.sendServerError("Could not delete product");
    }
    return res.sendPayload("Product deleted successfully");
}

export default {
    createProduct,
    deleteProduct,
    getProducts,
    getProductById,
    updateProduct
}