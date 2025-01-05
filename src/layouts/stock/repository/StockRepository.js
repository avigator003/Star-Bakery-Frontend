import api from "../../../axios/api";

export default class StockRepository {
  static async getAll(orderDate,selectedCategory) {
    return await api
      .post(`/stock/list`, { orderDate: orderDate,categoryId:selectedCategory })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/stock/view/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getAllWithFilter(pagenumber, pageSize, query) {
    const headers = {
      page_no: `${pagenumber}`,
      size: `${pageSize}`,
    };
    return await api
      .get(`/stock/search?query=${query}`, {
        headers: headers,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async create(stock) {
    return api
      .post("/stock/create", stock)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async update(newQuantity,id) {
    return api
      .post(`/stock/update/${id}`, {newQuantity})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async completeWork(date,productData) {
    return api
      .post(`/stock/completeWork`, {date,productData})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }


  static async delete(id) {
    return api
      .get(`/stock/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
