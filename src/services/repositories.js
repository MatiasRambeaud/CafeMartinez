import ProductsDao from "../db/dao/ProductsDao.js";
import UsersDao from "../db/dao/UsersDao.js";
import CategoriesDao from "../db/dao/CategoriesDao.js";
import SubcategoriesDao from "../db/dao/SubcategoriesDao.js";

import ProductsRepository from "../repositories/ProductsRepository.js";
import UsersRepository from "../repositories/UsersRepository.js";
import CategoriesRepository from "../repositories/CategoriesRepository.js";
import SubcategoriesRepository from "../repositories/SubcategoriesRepository.js";

export const ProductsService = new ProductsRepository(new ProductsDao());
export const UsersService = new UsersRepository(new UsersDao());
export const CategoriesService = new CategoriesRepository(new CategoriesDao());
export const SubcategoriesService = new SubcategoriesRepository(new SubcategoriesDao());