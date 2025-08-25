import { ProductsService } from "../services/repositories.js";

const getProducts = async (req, res) => {
  const result = await ProductsService.getProducts();
  if (!result) {
    return res.sendServerError("No se consiguieron productos");
  }
  return res.sendPayload(null, result);
};

const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const result = await ProductsService.getProductsByCategory(category);
  if (!result) {
    return res.sendServerError("No se consiguieron productos");
  }
  return res.sendPayload(null, result);
};

const getProductById = async (req, res) => {
  const { pid } = req.params;
  const result = await ProductsService.getProductById(pid);
  if (!result) {
    return res.sendServerError("No se consiguió el producto");
  }
  return res.sendPayload(null, result);
};

const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const newProduct = {
      title: data.title,
      description: data.description,
      code: data.code,
      price: data.price,
      category: data.category,
      status: data.status !== undefined ? data.status : true,
      variations: data.variations || [],
      // 👇 Si no se subió archivo, queda en null (o podés poner una imagen por defecto)
      image: req.file ? req.file.filename : null,
    };

    const exists = await ProductsService.searchProduct({ code: newProduct.code });
    if (exists.length > 0) {
      return res.sendBadRequest("El producto ya existe");
    }

    const product = await ProductsService.createProduct(newProduct);
    if (!product) {
      return res.sendServerError("No se pudo crear el producto");
    }

    return res.sendPayload("Producto creado con éxito", product);
  } catch (err) {
    console.error(err);
    return res.sendServerError("Error en creando el producto");
  }
};

const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const data = req.body;
  const update = {
    title: data.title,
    description: data.description,
    code: data.code,
    price: data.price,
    image: data.image,
    category: data.category,
    status: data.status,
    variations: data.variations || [], // <-- nueva funcionalidad
  };

  const updatedProduct = await ProductsService.updateProduct(pid, update);
  if (!updatedProduct) {
    return res.sendServerError("No se pudo actualizar el producto");
  }
  return res.sendPayload("Producto actualizado exitosamente", updatedProduct);
};

const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  const result = await ProductsService.deleteProduct(pid);
  if (!result) {
    return res.sendServerError("No se pudo eliminar el producto");
  }
  return res.sendPayload("Producto eliminado con éxito");
};

export default {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  getProductById,
  updateProduct,
};
