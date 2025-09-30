/**
 * Utility functions - Các hàm tiện ích dùng chung
 */

const Utils = {
    /**
     * Hiển thị loading spinner
     * @param {string} containerId - ID của container cần hiển thị loading
     */
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            `;
        }
    },

    /**
     * Ẩn loading spinner
     * @param {string} containerId - ID của container
     */
    hideLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const loading = container.querySelector('.loading-spinner');
            if (loading) {
                loading.remove();
            }
        }
    },

    /**
     * Hiển thị thông báo toast
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo (success, error, warning, info)
     * @param {number} duration - Thời gian hiển thị (ms)
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Thêm vào body
        document.body.appendChild(toast);

        // Hiện toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Tự động ẩn sau duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Format số thành tiền tệ VND
     * @param {number} amount - Số tiền
     * @returns {string} Số tiền đã format
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    /**
     * Format ngày tháng
     * @param {string|Date} date - Ngày cần format
     * @returns {string} Ngày đã format
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Debounce function để giảm số lần gọi hàm
     * @param {Function} func - Hàm cần debounce
     * @param {number} delay - Thời gian delay (ms)
     * @returns {Function} Hàm đã được debounce
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Validate email
     * @param {string} email - Email cần validate
     * @returns {boolean} Kết quả validate
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate số điện thoại Việt Nam
     * @param {string} phone - Số điện thoại cần validate
     * @returns {boolean} Kết quả validate
     */
    isValidPhone(phone) {
        const phoneRegex = /^(\+84|84|0)[3-9][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    /**
     * Tạo ID ngẫu nhiên
     * @param {number} length - Độ dài ID
     * @returns {string} ID ngẫu nhiên
     */
    generateId(length = 8) {
        return Math.random().toString(36).substring(2, 2 + length);
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

    /**
     * Scroll mượt đến element
     * @param {string} elementId - ID của element
     */
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    /**
     * Tạo confirmation dialog
     * @param {string} message - Nội dung xác nhận
     * @param {Function} onConfirm - Callback khi xác nhận
     * @param {Function} onCancel - Callback khi hủy
     */
    showConfirmDialog(message, onConfirm, onCancel = null) {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-modal-content">
                <h3>Xác nhận</h3>
                <p>${message}</p>
                <div class="confirm-modal-actions">
                    <button class="btn-cancel">Hủy</button>
                    <button class="btn-confirm">Xác nhận</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.btn-cancel').onclick = () => {
            modal.remove();
            if (onCancel) onCancel();
        };

        modal.querySelector('.btn-confirm').onclick = () => {
            modal.remove();
            if (onConfirm) onConfirm();
        };

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                if (onCancel) onCancel();
            }
        };
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text cần copy
     * @returns {Promise<boolean>} Kết quả copy
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Đã copy vào clipboard!', 'success');
            return true;
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showToast('Không thể copy!', 'error');
            return false;
        }
    },

    /**
     * Kiểm tra device là mobile hay không
     * @returns {boolean}
     */
    isMobile() {
        return window.innerWidth <= 768;
    },

    /**
     * Throttle function để giới hạn số lần gọi hàm
     * @param {Function} func - Hàm cần throttle
     * @param {number} limit - Thời gian giới hạn (ms)
     * @returns {Function} Hàm đã được throttle
     */
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export để sử dụng trong các file khác
window.Utils = Utils;