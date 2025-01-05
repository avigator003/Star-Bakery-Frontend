import api from "../../../axios/api";

export default class VehicleRepository {
  static async getAll() {
    return api
      .get("/vehicle/list")
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
      .post("/vehicle/create", formData, { headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/vehicle/view/${id}`)
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
      .post(`/vehicle/update/${id}`, category, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async delete(id) {
    return api
      .get(`/vehicle/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
