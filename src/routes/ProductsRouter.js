import BaseRouter from "./BaseRouter.js";
import productsController from "../controllers/products.controller.js";


class ProductsRouter extends BaseRouter {
    init(){
        this.get("/",productsController.getProducts);
        this.post("/",productsController.createProduct);
        this.put("/:pid",productsController.updateProduct);
        this.delete("/:pid",productsController.deleteProduct);
    }
}

const productsRouter = new ProductsRouter();
export default productsRouter.getRouter();