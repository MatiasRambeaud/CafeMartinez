import BaseRouter from "./BaseRouter.js";
import productsController from "../controllers/products.controller.js";


class ProductsRouter extends BaseRouter {
    init() {
        this.get("/", ["PUBLIC"], productsController.getProducts);
        this.get("/categoria/:category", ["PUBLIC"], productsController.getProductsByCategory);
        this.get("/:pid", ["PUBLIC"], productsController.getProductById);
        this.post("/", ["AUTHORIZED"], productsController.createProduct);
        this.put("/:pid", ["AUTHORIZED"], productsController.updateProduct);
        this.delete("/:pid", ["AUTHORIZED"], productsController.deleteProduct);
    }
}

const productsRouter = new ProductsRouter();
export default productsRouter.getRouter();