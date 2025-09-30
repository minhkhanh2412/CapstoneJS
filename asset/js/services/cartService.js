// CartAPI Service - Tương tự service.js trong demo ToDoList
// API Cart có structure: { id, product: {...}, soLuong: number }

let cartService = {
  // Lấy danh sách tất cả items trong giỏ hàng
  getList: () => {
    // console.log("Fetching cart items from:", `${BASE_URL}`);
    return axios({
      url: `${BASE_URL}/cart`,
      method: "GET",
    });
  },

  // Lấy cart item theo ID
  getById: (idCart) => {
    return axios({
      url: `${BASE_URL}/cart/${idCart}`,
      method: "GET",
    });
  },

  // Thêm item vào giỏ hàng
  addToCart: (cartItem) => {
    return axios({
      url: `${BASE_URL}/cart`,
      method: "POST",
      data: cartItem, // Gửi trực tiếp cartItem thay vì wrap trong { cartItem: ... }
    });
  },

  // Cập nhật cart item (số lượng, thông tin)
  updateCartItem: (updatedCartItem, idCart) => {
    return axios.put(`${BASE_URL}/cart/${idCart}`, updatedCartItem); // Gửi trực tiếp thay vì wrap
  },

  // Xóa item khỏi giỏ hàng
  deleteById: (idCart) => {
    return axios({
      url: `${BASE_URL}/cart/${idCart}`,
      method: "DELETE",
    });
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: () => {
    return cartService.getList().then((res) => {
      const deletePromises = res.data.map(item => 
        cartService.deleteById(item.id)
      );
      return Promise.all(deletePromises);
    });
  }
};