import api from "../../../axios/api";

export default class LabourRepository {
  static async getAll(month,status) {
    return await api
      .post(`/labour/list`,{month:month,status})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async updateLabourStatus(status,id) {
    return await api
      .post(`/labour/labour_status`,{status,id})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id,month) {
    return api
      .post(`/labour/view/${id}`,month)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }


  static async getAttendanceHistoryByDate(date) {
    return api
      .get(`/labour/attendance/list/${date}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getSalaryHistoryByMonth(month) {
    return api
      .get(`/labour/salary/list/${month}`)
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
      .get(`/labour/search?query=${query}`, {
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
      .post("/labour/create", user, { headers: headers })
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
      .post(`/labour/update/${id}`, user,{ headers: headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async updateSalaryHistory(data) {
    return api
      .post('/labour/salary/update', data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
  

  static async updateAttendanceHistory(data) {
    return api
      .post('/labour/attendance/update', data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }

  static async delete(id) {
    return api
      .get(`/labour/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
