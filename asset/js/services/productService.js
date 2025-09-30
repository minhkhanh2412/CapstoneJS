// ProductAPI Service - Tương tự service.js trong demo ToDoList
const BASE_URL = "https://68b2bd99c28940c9e69d3d5a.mockapi.io"; // Thay đổi URL này theo MockAPI của bạn

let productService = {
  // Lấy danh sách tất cả sản phẩm
  getList: () => {
    return axios({
      url: `${BASE_URL}/products`,
      method: "GET",
    });
  },

  // Lấy sản phẩm theo ID
  getById: (idProduct) => {
    return axios({
      url: `${BASE_URL}/products/${idProduct}`,
      method: "GET",
    });
  },

  // Tạo sản phẩm mới (cho admin)
  createProduct: (newProduct) => {
    return axios({
      url: `${BASE_URL}/products`,
      method: "POST",
      data: newProduct,
    });
  },

  // Cập nhật sản phẩm (cho admin)
  updateProduct: (updatedProduct, idProduct) => {
    return axios.put(`${BASE_URL}/products/${idProduct}`, updatedProduct);
  },

  // Xóa sản phẩm theo ID (cho admin)
  deleteById: (idProduct) => {
    return axios({
      url: `${BASE_URL}/products/${idProduct}`,
      method: "DELETE",
    });
  },

  // Tìm kiếm sản phẩm (tùy chọn - nếu MockAPI hỗ trợ search)
  searchProducts: (searchTerm) => {
    return axios({
      url: `${BASE_URL}/products?search=${searchTerm}`,
      method: "GET",
    });
  },

  // Lọc sản phẩm theo type (iPhone, Samsung)
  getByType: (type) => {
    return axios({
      url: `${BASE_URL}/products?type=${type}`,
      method: "GET",
    });
  }
};
