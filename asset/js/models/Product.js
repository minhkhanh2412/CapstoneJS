/**
 * Product Model Class - Đại diện cho một sản phẩm điện thoại
 */

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
     * Lấy tên thương hiệu từ type
     * @returns {string} Tên thương hiệu
     */
    getBrand() {
        return this.type.charAt(0).toUpperCase() + this.type.slice(1);
    }

    /**
     * Kiểm tra xem sản phẩm có phải iPhone không
     * @returns {boolean}
     */
    isIPhone() {
        return this.type.toLowerCase().includes('iphone');
    }

    /**
     * Kiểm tra xem sản phẩm có phải Samsung không
     * @returns {boolean}
     */
    isSamsung() {
        return this.type.toLowerCase().includes('samsung');
    }

    /**
     * Lấy thông tin camera chính từ backCamera
     * @returns {string} Thông tin camera chính
     */
    getMainCamera() {
        // Extract số MP chính từ chuỗi backCamera
        const match = this.backCamera.match(/(\d+)\s*MP/i);
        return match ? `${match[1]} MP` : this.backCamera;
    }

    /**
     * Tạo URL slug từ tên sản phẩm
     * @returns {string} URL slug
     */
    getSlug() {
        return this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Kiểm tra xem giá có trong khoảng không
     * @param {number} min - Giá tối thiểu
     * @param {number} max - Giá tối đa
     * @returns {boolean}
     */
    isPriceInRange(min, max) {
        return this.price >= min && this.price <= max;
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

    /**
     * Tạo object để thêm vào giỏ hàng
     * @param {number} quantity - Số lượng
     * @returns {Object} Cart item object
     */
    toCartItem(quantity = 1) {
        return {
            productId: this.id,
            name: this.name,
            price: this.price,
            img: this.img,
            quantity: quantity,
            type: this.type
        };
    }

    /**
     * Validate dữ liệu sản phẩm
     * @returns {Object} {isValid: boolean, errors: Array}
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Tên sản phẩm không được để trống');
        }

        if (!this.price || this.price <= 0) {
            errors.push('Giá sản phẩm phải lớn hơn 0');
        }

        if (!this.img || !this.isValidImageUrl(this.img)) {
            errors.push('URL hình ảnh không hợp lệ');
        }

        if (!this.type || this.type.trim().length === 0) {
            errors.push('Loại sản phẩm không được để trống');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Kiểm tra URL hình ảnh có hợp lệ không
     * @param {string} url - URL cần kiểm tra
     * @returns {boolean}
     */
    isValidImageUrl(url) {
        try {
            new URL(url);
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        } catch {
            return false;
        }
    }

    /**
     * Tạo HTML card cho sản phẩm
     * @param {boolean} isAdmin - Có phải admin view không
     * @returns {string} HTML string
     */
    toHTML(isAdmin = false) {
        const adminButtons = isAdmin ? `
            <div class="admin-actions">
                <button class="btn-edit" onclick="editProduct('${this.id}')">Sửa</button>
                <button class="btn-delete" onclick="deleteProduct('${this.id}')">Xóa</button>
            </div>
        ` : `
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart('${this.id}')">
                    Thêm vào giỏ hàng
                </button>
            </div>
        `;

        return `
            <div class="product-card" data-id="${this.id}" data-type="${this.type}">
                <img src="${this.img}" alt="${this.name}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
                <div class="product-info">
                    <h3 class="product-name">${this.name}</h3>
                    <p class="product-price">${this.getFormattedPrice()}</p>
                    <p class="product-brand">${this.getBrand()}</p>
                    <p class="product-camera">Camera: ${this.getMainCamera()}</p>
                    <p class="product-description">${this.desc}</p>
                </div>
                ${adminButtons}
            </div>
        `;
    }

    /**
     * Tạo object JSON để gửi API
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            screen: this.screen,
            backCamera: this.backCamera,
            frontCamera: this.frontCamera,
            img: this.img,
            desc: this.desc,
            type: this.type
        };
    }

    /**
     * Tạo Product instance từ dữ liệu thô
     * @param {Object} rawData - Dữ liệu từ API
     * @returns {Product}
     */
    static fromJSON(rawData) {
        return new Product(rawData);
    }

    /**
     * Tạo danh sách Product từ array dữ liệu thô
     * @param {Array} rawDataArray - Mảng dữ liệu từ API
     * @returns {Array<Product>}
     */
    static fromJSONArray(rawDataArray) {
        return rawDataArray.map(data => Product.fromJSON(data));
    }
}

// Export để sử dụng trong các file khác
window.Product = Product;