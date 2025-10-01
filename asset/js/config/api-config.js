// API Configuration
const API_CONFIG = {
    BASE_URL: "https://68b2bd99c28940c9e69d3d5a.mockapi.io", //KHNguyen
    // BASE_URL: "https://68b2bc9ac28940c9e69d39e3.mockapi.io", //Minh khanh
    ENDPOINTS: {
        PRODUCTS: "/products",
        CART: "/cart"
    }
};

// Export để sử dụng trong các file khác
window.API_CONFIG = API_CONFIG;