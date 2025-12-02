import BaseRouter from "./BaseRouter.js";
import subcategoriesController from "../controllers/subcategories.controller.js";

class SubcategoriesRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], subcategoriesController.getSubcategories);
    this.get("/byCategory/:categoryId", ["PUBLIC"], subcategoriesController.getByCategoryId);
    this.get("/:id", ["PUBLIC"], subcategoriesController.getSubcategoryById);
    this.post("/", ["AUTHORIZED"], subcategoriesController.createSubcategory);
    this.put("/:id", ["AUTHORIZED"], subcategoriesController.updateSubcategory);
    this.delete("/:id", ["AUTHORIZED"], subcategoriesController.deleteSubcategory);
  }
}

const subcategoriesRouter = new SubcategoriesRouter();
export default subcategoriesRouter.getRouter();
