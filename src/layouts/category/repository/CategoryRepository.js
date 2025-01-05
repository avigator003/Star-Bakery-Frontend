import api from "../../../axios/api";

export default class CategoryRepository {
  static async getAll(pagenumber, pageSize) {
    const headers = {
      page_no: `${pagenumber}`,
      size: `${pageSize}`,
    };
    return await api
      .get(`/category/list`, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/category/view/${id}`)
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
      .get(`/category/search?query=${query}`, {
        headers: headers,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async create(user) {
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    return api
      .post("/category/create", user, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async update(category,id) {
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    return api
      .post(`/category/update/${id}`, category, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async delete(id) {
    return api
      .get(`/category/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
