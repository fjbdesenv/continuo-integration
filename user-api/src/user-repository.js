const {ObjectId} = require('bson');

/**
 * Substitui o atributo "_id" por "id"
 * @param {User} user
 * @return {User}
 */
function addIdToUser(user) {
  user.id = user._id.toString();
  delete user._id;
  return user;
}

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

/**
 * UserRepository
 */
class UserRepository {
  /**
   * @param {Collection} collection
   */
  constructor(collection) {
    this.collection = collection;
  }

  /**
   * Procura um usuário por email
   * @param {string} email
   * @return {User}
   */
  async findOneByEmail(email) {
    const user = await this.collection.findOne({email});

    if (user === null) {
      throw new Error(`User with email ${email} does not exist`);
    }

    return addIdToUser(user);
  }

  /**
   * Procura um usuário por id
   * @param {ObjectId} id
   * @return {User}
   */
  async findOneById(id) {
    const user = await this.collection.findOne({_id: new ObjectId(id)});

    if (user === null) {
      throw new Error(`User with id ${id} does not exist`);
    }

    return addIdToUser(user);
  }

  /**
   * Persiste um usuário no banco de dados
   * @param {User} user
   * @return {User}
   */
  async insert(user) {
    await this.collection.insertOne(user);
    return addIdToUser(user);
  }

  /**
   * Atualiza os dados de um usuário
   * @param {string} id
   * @param {User} data
   * @return {User}
   */
  async update(id, data) {
    const result = await this.collection.findOneAndUpdate({_id: new ObjectId(id)}, {
      $set: data,
    }, {
      returnNewDocument: true,
    });

    if (result.value === null) {
      throw Error(`User with id ${id} was not found`);
    }

    return await this.findOneById(id);
  }

  /**
   * Remove um usuário do banco de dados
   * @param {ObjectId} id
   */
  async delete(id) {
    const result = await this.collection.deleteOne({_id: new ObjectId(id)});

    if (result.deletedCount === 0) {
      throw new Error(`User with id ${id} does not exist`);
    }
  }

  /**
   * Retorna a lista com todos os usuários
   * @return {Array.<User>}
   */
  async findAll() {
    const users = await this.collection.find().toArray();
    return users.map(addIdToUser);
  }

  /**
   * Remove todos os usuários do banco
   */
  async deleteAll() {
    await this.collection.deleteMany({});
  }
}

module.exports = UserRepository;
