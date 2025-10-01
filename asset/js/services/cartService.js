// CartAPI Service
// API Cart có structure: { id, product: {...}, soLuong: number }

let cartService = {
  // Lấy danh sách tất cả items trong giỏ hàng
  getList: () => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}`,
      method: "GET",
    });
  },

  // Lấy cart item theo ID
  getById: (idCart) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}/${idCart}`,
      method: "GET",
    });
  },

  // Thêm item vào giỏ hàng
  addToCart: (cartItem) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}`,
      method: "POST",
      data: cartItem,
    });
  },

  // Cập nhật cart item (số lượng, thông tin)
  updateCartItem: (updatedCartItem, idCart) => {
    return axios.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}/${idCart}`, updatedCartItem); // Gửi trực tiếp thay vì wrap
  },

  // Xóa item khỏi giỏ hàng
  deleteById: (idCart) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}/${idCart}`,
      method: "DELETE",
    });
  },

  // Xóa toàn bộ giỏ hàng - Sequential deletion để tránh race condition  
  clearCart: () => {
    const deleteAllItems = async () => {
      let remainingAttempts = 3; // Số lần thử lại tối đa
      
      while (remainingAttempts > 0) {
        try {
          // Lấy danh sách hiện tại
          const res = await cartService.getList();
          const items = res.data;
          
          console.log(`🗑️ Attempt ${4 - remainingAttempts}: Found ${items.length} items to delete`);
          
          if (items.length === 0) {
            console.log("✅ Cart is now empty");
            return;
          }
          
          // Xóa từng item một cách tuần tự
          for (let item of items) {
            try {
              console.log(`🗑️ Deleting item: ${item.id} (${item.product?.name || 'Unknown'})`);
              await cartService.deleteById(item.id);
              console.log(`✅ Successfully deleted item: ${item.id}`);
              
              // Thêm delay nhỏ để API kịp xử lý
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (err) {
              console.error(`❌ Failed to delete item ${item.id}:`, err);
              // Tiếp tục xóa các item khác
            }
          }
          
          // Kiểm tra lại sau khi xóa
          const verifyRes = await cartService.getList();
          if (verifyRes.data.length === 0) {
            console.log("✅ All cart items deleted successfully");
            return;
          } else {
            console.warn(`⚠️ ${verifyRes.data.length} items still remain, retrying...`);
            remainingAttempts--;
          }
          
        } catch (err) {
          console.error("❌ Error during cart clearing:", err);
          remainingAttempts--;
        }
      }
      
      // Nếu sau 3 lần vẫn không xóa hết
      const finalCheck = await cartService.getList();
      if (finalCheck.data.length > 0) {
        console.error(`❌ Failed to clear cart completely. ${finalCheck.data.length} items remaining.`);
        throw new Error(`Unable to clear cart completely. ${finalCheck.data.length} items remaining.`);
      }
    };
    
    return deleteAllItems();
  }
};