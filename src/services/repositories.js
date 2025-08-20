import ProductsDao from "../db/dao/ProductsDao.js";
import UsersDao from "../db/dao/UsersDao.js";

import ProductsRepository from "../repositories/ProductsRepository.js";
import UsersRepository from "../repositories/UsersRepository.js";

export const ProductsService = new ProductsRepository(new ProductsDao());
export const UsersService = new UsersRepository(new UsersDao());