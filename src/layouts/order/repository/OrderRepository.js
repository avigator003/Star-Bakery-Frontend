import api from "../../../axios/api";

export default class OrderRepository {
  static async getAll() {
    return await api
      .get(`/order/list`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(id) {
    return api
      .get(`/order/view/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });  
  }

  static async getByDateOrUser(startDate,endDate,user) {
    return api
      .post("/order/view_by_date_or_user",{startDate,endDate,orderCreatedUserId:user})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getTruckLoadingData(orderDate,categoryId) {
    return api
      .post("/order/truck_loading",{orderDate,categoryId})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
  static async create(order,userId) {
    return api
      .post("/order/create", {products:order,userId:localStorage.getItem('user'),orderCreatedUserId:userId})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async update(order, id,rowId) {
    return api
      .post(`/order/update/${rowId}`, {products:order,orderCreatedUserId:id,userId:localStorage.getItem('user')})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }


  static async updateOrderStatus(status, id) {
    return api
      .post(`/order/update_order_status/${id}`,{status:status})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }


  static async updatePaymentStatus(id,payment,paymentStatus) {
    return api
      .post(`/order/update_payment_status/${id}`,{payment:payment,paymentStatus:paymentStatus})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async downloadInvoice(id) {
    return api
      .get(`/order/download_invoice/${id}`,{ responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `order-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        throw new Error(error);
      });
  }


  
  static async delete(id) {
    return api
      .get(`/order/delete/${id}`)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
