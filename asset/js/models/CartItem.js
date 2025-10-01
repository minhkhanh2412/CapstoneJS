/**
 * CartItem Model Class - Đại diện cho một item trong giỏ hàng
 * Cấu trúc: { product: Product object, soLuong: number }
 */

class CartItem {
    constructor(data) {
        this.product = data.product; // Đối tượng sản phẩm hoàn chỉnh
        this.soLuong = parseInt(data.soLuong) || 1;
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


}

// Export để sử dụng trong các file khác
window.CartItem = CartItem;