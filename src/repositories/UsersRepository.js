export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUser(id) {
        return this.dao.getOne({ _id: id });
    }
    getUserByName(name) {
        return this.dao.getOne({ name: name })
    }
    createUser(user) {
        return this.dao.create(user);
    }
}