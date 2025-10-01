
class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.price = parseFloat(data.price);
        this.screen = data.screen;
        this.backCamera = data.backCamera;
        this.frontCamera = data.frontCamera;
        this.img = data.img;
        this.desc = data.desc;
        this.type = data.type;
    }

    /**
     * Format giá tiền theo định dạng VND
     * @returns {string} Giá đã format
     */
    getFormattedPrice() {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(this.price);
    }





    /**
     * Tìm kiếm trong tên và mô tả sản phẩm
     * @param {string} searchTerm - Từ khóa tìm kiếm
     * @returns {boolean}
     */
    matchesSearch(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.name.toLowerCase().includes(term) ||
               this.desc.toLowerCase().includes(term) ||
               this.type.toLowerCase().includes(term);
    }


}

// Export để sử dụng trong các file khác
window.Product = Product;