/**
 * Utility functions - Các hàm tiện ích dùng chung
 */

const Utils = {
    /**
     * Hiển thị loading spinner
     * @param {string} loadingId - ID của loading element (mặc định "loading")
     */
    turnOnLoading(loadingId = "loading") {
        const loading = document.getElementById(loadingId);
        if (loading) {
            loading.style.display = "flex";
        }
    },

    /**
     * Ẩn loading spinner
     * @param {string} loadingId - ID của loading element (mặc định "loading")
     */
    turnOffLoading(loadingId = "loading") {
        const loading = document.getElementById(loadingId);
        if (loading) {
            loading.style.display = "none";
        }
    },

    /**
     * Format số thành tiền tệ VND
     * @param {number} price - Số tiền
     * @returns {string} Số tiền đã format (không có VND)
     */
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
    }

};

// Export để sử dụng trong các file khác
window.Utils = Utils;