/**
 * CartItem Model Class - Đại diện cho một item trong giỏ hàng
 * Cấu trúc: { product: Product object, soLuong: number }
 */

class CartItem {
    constructor(data) {
        // Nếu data có product object (cấu trúc mới)
        if (data.product) {
            this.product = data.product; // Đối tượng sản phẩm hoàn chỉnh
            this.soLuong = parseInt(data.soLuong) || 1;
        } 
        // Bỏ dateAdded - không cần lưu thời gian thêm vào giỏ hàng
    }

    /**
     * Tính tổng giá cho item này
     * @returns {number} Tổng giá
     */
    getTotalPrice() {
        return this.product.price * this.soLuong;
    }

    /**
     * Format tổng giá theo định dạng VND
     * @returns {string} Tổng giá đã format
     */
    getFormattedTotalPrice() {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(this.getTotalPrice());
    }

    /**
     * Format giá đơn vị theo định dạng VND
     * @returns {string} Giá đơn vị đã format
     */
    getFormattedUnitPrice() {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(this.product.price);
    }

    /**
     * Tăng số lượng
     * @param {number} amount - Số lượng tăng (mặc định 1)
     */
    increaseQuantity(amount = 1) {
        this.soLuong += amount;
    }

    /**
     * Giảm số lượng
     * @param {number} amount - Số lượng giảm (mặc định 1)
     * @returns {boolean} Trả về false nếu số lượng <= 0
     */
    decreaseQuantity(amount = 1) {
        this.soLuong -= amount;
        return this.soLuong > 0;
    }

    /**
     * Cập nhật số lượng
     * @param {number} newQuantity - Số lượng mới
     * @returns {boolean} Trả về false nếu số lượng <= 0
     */
    updateQuantity(newQuantity) {
        this.soLuong = Math.max(0, parseInt(newQuantity));
        return this.soLuong > 0;
    }

    /**
     * Validate dữ liệu cart item
     * @returns {Object} {isValid: boolean, errors: Array}
     */
    validate() {
        const errors = [];

        if (!this.product || !this.product.id) {
            errors.push('Product ID không được để trống');
        }

        if (!this.product || !this.product.name || this.product.name.trim().length === 0) {
            errors.push('Tên sản phẩm không được để trống');
        }

        if (!this.product || !this.product.price || this.product.price <= 0) {
            errors.push('Giá sản phẩm phải lớn hơn 0');
        }

        if (!this.soLuong || this.soLuong <= 0) {
            errors.push('Số lượng phải lớn hơn 0');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Tạo HTML row cho bảng giỏ hàng
     * @returns {string} HTML string
     */
    toHTML() {
        return `
            <tr class="cart-item" data-id="${this.id || ''}" data-product-id="${this.product.id}">
                <td>
                    <img src="${this.product.img}" alt="${this.product.name}" class="cart-item-image" 
                         onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                </td>
                <td>
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${this.product.name}</h4>
                        <p class="cart-item-type">${this.product.type}</p>
                    </div>
                </td>
                <td class="cart-item-price">${this.getFormattedUnitPrice()}</td>
                <td>
                    <div class="quantity-controls">
                        <button class="btn-quantity-decrease" onclick="updateCartQuantity('${this.id}', ${this.soLuong - 1})">-</button>
                        <input type="number" class="quantity-input" value="${this.soLuong}" 
                               min="1" onchange="updateCartQuantity('${this.id}', this.value)">
                        <button class="btn-quantity-increase" onclick="updateCartQuantity('${this.id}', ${this.soLuong + 1})">+</button>
                    </div>
                </td>
                <td class="cart-item-total">${this.getFormattedTotalPrice()}</td>
                <td>
                    <button class="btn-remove-item" onclick="removeCartItem('${this.id}')">
                        🗑️ Xóa
                    </button>
                </td>
            </tr>
        `;
    }

    /**
     * Tạo HTML card cho mobile view
     * @returns {string} HTML string
     */
    toMobileHTML() {
        return `
            <div class="cart-item-mobile" data-id="${this.id}" data-product-id="${this.productId}">
                <div class="cart-item-mobile-img">
                    <img src="${this.img}" alt="${this.name}" 
                         onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
                </div>
                <div class="cart-item-mobile-info">
                    <h4 class="cart-item-name">${this.name}</h4>
                    <p class="cart-item-type">${this.type}</p>
                    <p class="cart-item-price">${this.getFormattedUnitPrice()}</p>
                    
                    <div class="cart-item-mobile-controls">
                        <div class="quantity-controls">
                            <button onclick="updateCartQuantity('${this.id}', ${this.quantity - 1})">-</button>
                            <span class="quantity">${this.quantity}</span>
                            <button onclick="updateCartQuantity('${this.id}', ${this.quantity + 1})">+</button>
                        </div>
                        <button class="btn-remove-item" onclick="removeCartItem('${this.id}')">Xóa</button>
                    </div>
                    
                    <div class="cart-item-total">
                        Tổng: ${this.getFormattedTotalPrice()}
                    </div>
                </div>
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
            productId: this.productId,
            name: this.name,
            price: this.price,
            img: this.img,
            quantity: this.quantity,
            type: this.type,
            dateAdded: this.dateAdded
        };
    }

    /**
     * Tạo CartItem instance từ dữ liệu thô
     * @param {Object} rawData - Dữ liệu từ API
     * @returns {CartItem}
     */
    static fromJSON(rawData) {
        return new CartItem(rawData);
    }

    /**
     * Tạo danh sách CartItem từ array dữ liệu thô
     * @param {Array} rawDataArray - Mảng dữ liệu từ API
     * @returns {Array<CartItem>}
     */
    static fromJSONArray(rawDataArray) {
        return rawDataArray.map(data => CartItem.fromJSON(data));
    }

    /**
     * Tạo CartItem từ Product và quantity
     * @param {Product} product - Sản phẩm
     * @param {number} quantity - Số lượng
     * @returns {CartItem}
     */
    static fromProduct(product, quantity = 1) {
        return new CartItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: quantity,
            type: product.type
        });
    }
}

// Export để sử dụng trong các file khác
window.CartItem = CartItem;