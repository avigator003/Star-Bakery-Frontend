import api from "../../../axios/api";

export default class UserRepository {
  static async getAll(admin) {
    return await api
      .post(`/user/list`, {admin:admin})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/user/view/${id}`)
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
      .get(`/users/search?query=${query}`, {
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
      .post("/user/create", user, { headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async login(mobileNumber,password) {
    return api
      .post("/user/login", {mobileNumber:mobileNumber,password:password})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  
  static async update(user,id) {
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    return api
      .post(`/user/update/${id}`, user,{ headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async delete(id) {
    return api
      .get(`/user/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getDashboardData() {
    return api
      .get(`/user/dashboard_details`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
