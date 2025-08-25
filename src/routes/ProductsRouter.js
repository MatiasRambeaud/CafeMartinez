import multer from "multer";
import BaseRouter from "./BaseRouter.js";
import productsController from "../controllers/products.controller.js";

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // guarda en public/images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // mantiene nombre original
  },
});
const upload = multer({ storage });

class ProductsRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], productsController.getProducts);
    this.get("/categoria/:category", ["PUBLIC"], productsController.getProductsByCategory);
    this.get("/:pid", ["PUBLIC"], productsController.getProductById);

    // 👇 importante: `upload.single("image")` NO falla si no se manda archivo
    this.post("/", ["AUTHORIZED"], upload.single("image"), productsController.createProduct);

    this.put("/:pid", ["AUTHORIZED"], productsController.updateProduct);
    this.delete("/:pid", ["AUTHORIZED"], productsController.deleteProduct);
  }
}

const productsRouter = new ProductsRouter();
export default productsRouter.getRouter();
