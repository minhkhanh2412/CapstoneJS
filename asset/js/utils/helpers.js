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
    },

    /**
     * Tìm kiếm trong mảng objects
     * @param {Array} items - Mảng cần tìm kiếm
     * @param {string} searchTerm - Từ khóa tìm kiếm
     * @param {Array} searchFields - Các trường cần tìm kiếm
     * @returns {Array} Kết quả tìm kiếm
     */
    searchItems(items, searchTerm, searchFields = ['name', 'desc', 'type']) {
        if (!searchTerm || searchTerm.trim() === '') return items;
        
        const term = searchTerm.toLowerCase();
        return items.filter(item => 
            searchFields.some(field => 
                item[field] && item[field].toLowerCase().includes(term)
            )
        );
    },



    /**
     * Lưu dữ liệu vào localStorage
     * @param {string} key - Key để lưu
     * @param {*} data - Dữ liệu cần lưu
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Lấy dữ liệu từ localStorage
     * @param {string} key - Key cần lấy
     * @param {*} defaultValue - Giá trị mặc định nếu không tìm thấy
     * @returns {*} Dữ liệu đã lưu
     */
    getFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Xóa dữ liệu khỏi localStorage
     * @param {string} key - Key cần xóa
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },


};

// Export để sử dụng trong các file khác
window.Utils = Utils;