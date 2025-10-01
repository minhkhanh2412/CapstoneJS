// ProductAPI Service - Tương tự service.js trong demo ToDoList

let productService = {
  // Lấy danh sách tất cả sản phẩm
  getList: () => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
      method: "GET",
    });
  },

  // Lấy sản phẩm theo ID
  getById: (idProduct) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${idProduct}`,
      method: "GET",
    });
  },

  // Tạo sản phẩm mới (cho admin)
  createProduct: (newProduct) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
      method: "POST",
      data: newProduct,
    });
  },

  // Cập nhật sản phẩm (cho admin)
  updateProduct: (updatedProduct, idProduct) => {
    return axios.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${idProduct}`, updatedProduct);
  },

  // Xóa sản phẩm theo ID (cho admin)
  deleteById: (idProduct) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${idProduct}`,
      method: "DELETE",
    });
  },

  // Tìm kiếm sản phẩm (tùy chọn - nếu MockAPI hỗ trợ search)
  searchProducts: (searchTerm) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}?search=${searchTerm}`,
      method: "GET",
    });
  },

  // Lọc sản phẩm theo type (iPhone, Samsung)
  getByType: (type) => {
    return axios({
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}?type=${type}`,
      method: "GET",
    });
  }
};
