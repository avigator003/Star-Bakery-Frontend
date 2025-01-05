import api from "../../../axios/api";

export default class SellerRepository {
    static async getAll() {
      return api
        .get("/seller/list")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
    }

  static async create(formData) {
    const headers = {
      "Content-Type": "application/json",
    };

    return api
      .post("/seller/create", formData, { headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/seller/view/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async update(category, id) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api
      .post(`/seller/update/${id}`, category, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async delete(id) {
    return api
      .get(`/seller/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  //   static async getAllUser() {
  //     return await api
  //       .post(`/labour/list`)
  //       .then((response) => {
  //         return response.data;
  //       })
  //       .catch((error) => {
  //         throw new Error(error);
  //       });
  //   }
}
