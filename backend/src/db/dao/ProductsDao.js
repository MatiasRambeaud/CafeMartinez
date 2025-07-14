import productsModel from "../models/product.model.js";
export default class ProductsDao {

    get() {
        return productsModel.find();
    }
    create(product) {
        return productsModel.create(product);
    }
    getOne(params){
        return productsModel.find(params);
    }
    getById(params) {
        return productsModel.findOne(params);
    }
    update(id,data) {
        return productsModel.updateOne({_id:id}, data);
    }
    delete(id) {
        return productsModel.deleteOne({_id:id});
    }
}