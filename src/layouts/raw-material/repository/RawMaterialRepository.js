import api from "../../../axios/api";

export default class RawMaterialRepository {
  static async getAll(pagenumber, pageSize) {
    const headers = {
      page_no: `${pagenumber}`,
      size: `${pageSize}`,
    };
    return await api
      .get(`/raw-material/list`, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/raw-material/view/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getHistoryById(id) {
    return api
      .get(`/raw-material/view-history/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async buy(id, quantity) {
    return api
      .post(`/raw-material/buy/${id}`, { quantity: quantity })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async use(id, quantity) {
    return api
      .post(`/raw-material/use/${id}`, { quantity: quantity })
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
      .get(`/raw-material/search?query=${query}`, {
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
      "Content-Type": "multipart/form-data",
    };
    return api
      .post("/raw-material/create", user, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async createCategory(categoryName) {
    return api
      .post("/raw-material/create/category", { categoryName })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async deleteCategory(id) {
    return api
      .post(`/raw-material/delete/category/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async updateCategory(id, name) {
    return api
      .post(`/raw-material/update/category/${id}`, { name })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getCategories() {
    return api
      .post("/raw-material/get/category")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async update(category, id) {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    return api
      .post(`/raw-material/update/${id}`, category, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async delete(id) {
    return api
      .get(`/raw-material/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
