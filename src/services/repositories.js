import ProductsDao from "../db/dao/ProductsDao.js";

import ProductsRepository from "../repositories/ProductsRepository.js";

export const ProductsService = new ProductsRepository(new ProductsDao());
