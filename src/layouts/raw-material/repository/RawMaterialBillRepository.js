import api from "../../../axios/api";

export default class RawMaterialBillRepository {
  static async getAll() {
    return api
      .get("/raw-material-bill/list")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  } 
   static async getAllSeller() {
    return api
      .get("/seller/list")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/raw-material-bill/view/${id}`)
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
      .get(`/raw-material-bill/search?query=${query}`, {
        headers: headers,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async create(formData) {
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    return api
      .post("/raw-material-bill/create", formData, { headers })
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
      .post(`/raw-material-bill/update/${id}`, category, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async delete(id) {
    return api
      .get(`/raw-material-bill/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
