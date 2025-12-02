import BaseRouter from "./BaseRouter.js";
import categoriesController from "../controllers/categories.controller.js";

class CategoriesRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], categoriesController.getCategories);
    this.get("/:id", ["PUBLIC"], categoriesController.getCategoryById);
    this.post("/", ["AUTHORIZED"], categoriesController.createCategory);
    this.put("/:id", ["AUTHORIZED"], categoriesController.updateCategory);
    this.delete("/:id", ["AUTHORIZED"], categoriesController.deleteCategory);
  }
}

const categoriesRouter = new CategoriesRouter();
export default categoriesRouter.getRouter();
