// Customer Page Logic

// === LOADING FUNCTIONS ===
let turnOnLoading = () => {
    document.getElementById("loading").style.display = "flex";
};

let turnOffLoading = () => {
    document.getElementById("loading").style.display = "none";
};

// === VARIABLES ===
let allProducts = []; // Lưu tất cả sản phẩm từ API
let cartItems = []; // Lưu giỏ hàng
let currentFilter = "all"; // Bộ lọc hiện tại

// === FETCH PRODUCTS ===
let fetchListProducts = () => {
    turnOnLoading();
    productService
        .getList()
        .then((res) => {
            turnOffLoading();
            let products = res.data;
            console.log("🚀 - Products:", products);
            allProducts = products; // Lưu để filter
            renderListProducts(products);
        })
        .catch((err) => {
            turnOffLoading();
            console.log("Lỗi khi lấy danh sách sản phẩm:", err);
        });
};

// Gọi khi trang load
fetchListProducts();

// === RENDER PRODUCTS ===
let renderListProducts = (products) => {
    let contentHTML = "";

    products.forEach((product) => {
        let { id, name, price, screen, backCamera, frontCamera, img, desc, type } = product;

        let productCard = `
      <div class="product-card" data-id="${id}" onclick="viewProductDetail('${id}')" style="cursor: pointer;">
        <img src="${img}" alt="${name}" class="product-image" />
        <div class="product-info">
          <h3 class="product-name">${name}</h3>
          <p class="product-price">${formatPrice(price)} VND</p>
        </div>
        <div class="product-actions">
          <button onclick="event.stopPropagation(); addToCart('${id}')" class="add-to-cart-btn">
            🛒 Thêm vào giỏ
          </button>
        </div>
      </div>
    `;
        contentHTML += productCard;
    });

    document.querySelector(".product-grid").innerHTML = contentHTML;
};

// === FORMAT PRICE ===
let formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
};

// === ADD TO CART ===
let addToCart = (productId) => {
    // Tìm sản phẩm trong danh sách
    let product = allProducts.find(p => p.id === productId);
    if (!product) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    cartService
        .getList()
        .then((res) => {
            let existingItems = res.data;
            let existingItem = existingItems.find(item => {
                return item.product && item.product.id === productId;
            });

            if (existingItem) {
                // Nếu đã có, tăng số lượng
                existingItem.soLuong += 1;

                cartService
                    .updateCartItem(existingItem, existingItem.id)
                    .then(() => {
                        console.log("Cập nhật số lượng thành công");
                        alert(`Đã tăng số lượng ${product.name} trong giỏ hàng!`);
                        fetchCartItems();
                    })
                    .catch((err) => {
                        console.log("Lỗi khi cập nhật:", err);
                    });
            } else {
                // Nếu chưa có, thêm mới
                let cartItem = {
                    product: product,
                    soLuong: 1
                };

                cartService
                    .addToCart(cartItem)
                    .then((res) => {
                        console.log("Thêm vào giỏ hàng thành công:", res);
                        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
                        fetchCartItems();
                    })
                    .catch((err) => {
                        console.log("Lỗi khi thêm vào giỏ hàng:", err);
                        alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
                    });
            }
        })
        .catch((err) => {
            console.log("Lỗi khi kiểm tra giỏ hàng:", err);
            alert("Có lỗi xảy ra!");
        });
};

// === FETCH CART ITEMS ===
let fetchCartItems = () => {
    cartService
        .getList()
        .then((res) => {
            cartItems = res.data;
            console.log("🚀 - Cart Items:", cartItems);
            updateCartUI();
        })
        .catch((err) => {
            console.log("Lỗi khi lấy giỏ hàng:", err);
        });
};

// Gọi khi trang load
fetchCartItems();

// === UPDATE CART UI ===
let updateCartUI = () => {
    let cartCount = cartItems.length;
    let cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
};

// === VIEW PRODUCT DETAIL ===
let viewProductDetail = (productId) => {
    productService
        .getById(productId)
        .then((res) => {
            let product = res.data;
            console.log("Chi tiết sản phẩm:", product);
            // Hiển thị modal hoặc chuyển trang
            showProductModal(product);
        })
        .catch((err) => {
            console.log("Lỗi khi lấy chi tiết sản phẩm:", err);
        });
};

// === SHOW PRODUCT MODAL ===
let showProductModal = (product) => {
    let modalHTML = `
    <div class="product-modal" id="productModal" onclick="closeProductModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <button class="close-btn" onclick="closeProductModal()">
            <i class="fas fa-times"></i>
            <span style="display: none;">&times;</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="product-image-section">
            <img src="${product.img}" alt="${product.name}" class="modal-product-image" />
          </div>
          
          <div class="product-details-section">
            <h2 class="product-title">${product.name}</h2>
            <div class="product-price">${formatPrice(product.price)} VND</div>
            
            <div class="product-specs">
              <div class="spec-item">
                <span class="spec-label">Loại:</span>
                <span class="spec-value">${product.type}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Màn hình:</span>
                <span class="spec-value">${product.screen}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Camera sau:</span>
                <span class="spec-value">${product.backCamera}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Camera trước:</span>
                <span class="spec-value">${product.frontCamera}</span>
              </div>
            </div>
            
            <div class="product-description">
              <h4>Mô tả sản phẩm</h4>
              <p>${product.desc}</p>
            </div>
            
            <div class="modal-actions">
              <button onclick="addToCart('${product.id}')" class="modal-add-to-cart-btn">
                <i class="fas fa-shopping-cart"></i>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Thêm animation vào modal
    setTimeout(() => {
        document.getElementById("productModal").classList.add('show');
    }, 10);
};

let closeProductModal = () => {
    let modal = document.getElementById("productModal");
    if (modal) {
        modal.classList.add('hide');
        // Đợi animation xong rồi mới xóa element
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
};

// === FILTER FUNCTIONS ===
let filterByType = (type) => {
    currentFilter = type;
    let filteredProducts = allProducts;

    // Nếu type rỗng hoặc "all" thì hiển thị tất cả
    if (type && type !== "all" && type !== "") {
        filteredProducts = allProducts.filter(product =>
            product.type.toLowerCase() === type.toLowerCase()
        );
    }

    console.log(`🔍 Filter by type: "${type}", Found: ${filteredProducts.length} products`);
    renderListProducts(filteredProducts);
};

// === SEARCH FUNCTION ===
let searchProducts = () => {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();

    let filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.desc.toLowerCase().includes(searchTerm) ||
        product.type.toLowerCase().includes(searchTerm)
    );

    renderListProducts(filteredProducts);
};

// === SHOW CART ===
let showCart = () => {
    cartService
        .getList()
        .then((res) => {
            let cartItems = res.data;
            console.log("Cart Items từ API:", cartItems);

            let cartHTML = `
        <div class="cart-modal" id="cartModal" onclick="closeCart()">
          <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h2 class="cart-title">Giỏ hàng của bạn</h2>
              <button class="close-btn" onclick="closeCart()">
                <i class="fas fa-times"></i>
                <span style="display: none;">&times;</span>
              </button>
            </div>
            <div class="cart-items">
      `;
            let total = 0;
            if (cartItems.length === 0) {
                cartHTML += `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart empty-cart-icon"></i>
            <p class="empty-cart-message">Giỏ hàng của bạn đang trống</p>
            <p class="empty-cart-submessage">Bắt đầu mua sắm nào!</p>
          </div>
        `;
            } else {

                
                cartItems.forEach(item => {
                    console.log("Processing cart item:", item);

                    // Cấu trúc mới: item trực tiếp có { product: {...}, soLuong: number }
                    if (item.product && item.soLuong) {
                        total += item.product.price * item.soLuong;

                        cartHTML += `
            <div class="cart-item">
              <img src="${item.product.img}" alt="${item.product.name}" />
              <div class="item-info">
                <h4>${item.product.name}</h4>
                <p class="item-price">Giá: ${formatPrice(item.product.price)} VND</p>
                <div class="quantity-controls">
                  <button onclick="updateQuantity('${item.id}', ${item.soLuong - 1})" class="quantity-btn decrease">-</button>
                  <span class="quantity-display">${item.soLuong}</span>
                  <button onclick="updateQuantity('${item.id}', ${item.soLuong + 1})" class="quantity-btn increase">+</button>
                </div>
              </div>
              <button onclick="removeFromCart('${item.id}')" class="remove-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
                    } else {
                        console.warn("Cấu trúc cart item không hợp lệ:", item);
                    }
                });
            } // Đóng block else của empty cart check

            cartHTML += `
            </div>`;

            // Chỉ hiển thị total và actions khi có sản phẩm
            if (cartItems.length > 0) {
                cartHTML += `
            <div class="cart-total">
              <h3>Tổng cộng: ${formatPrice(total)} VND</h3>
            </div>
            <div class="cart-actions">
              <button onclick="clearCart()" class="clear-cart-btn">Xóa tất cả</button>
              <button onclick="checkout()" class="checkout-btn">Thanh toán</button>
            </div>`;
            }

            cartHTML += `
          </div>
        </div>
      `;

            document.body.insertAdjacentHTML('beforeend', cartHTML);
        })
        .catch((err) => {
            console.error("Lỗi khi tải giỏ hàng:", err);
            alert("Có lỗi khi tải giỏ hàng!");
        });
};

let closeCart = () => {
    let modal = document.getElementById("cartModal");
    if (modal) {
        modal.remove();
    }
};

// === REFRESH CART CONTENT ===
let refreshCartContent = () => {
  const cartModal = document.getElementById("cartModal");
  if (!cartModal) return; // Không có modal đang mở
  
  cartService
    .getList()
    .then((res) => {
      let cartItems = res.data;
      console.log("Refreshing cart content:", cartItems);
      
      // Tạo nội dung cart items mới
      let cartItemsHTML = '';
      let total = 0;
      
      if (cartItems.length === 0) {
        cartItemsHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart empty-cart-icon"></i>
            <p class="empty-cart-message">Giỏ hàng của bạn đang trống</p>
            <p class="empty-cart-submessage">Hãy thêm sản phẩm để bắt đầu mua sắm!</p>
          </div>
        `;
      } else {
        cartItems.forEach(item => {
          // Cấu trúc: item trực tiếp có { product: {...}, soLuong: number }
          if (item.product && item.soLuong) {
            total += item.product.price * item.soLuong;
            
            cartItemsHTML += `
              <div class="cart-item">
                <img src="${item.product.img}" alt="${item.product.name}" />
                <div class="item-info">
                  <h4>${item.product.name}</h4>
                  <p class="item-price">Giá: ${formatPrice(item.product.price)} VND</p>
                  <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.id}', ${item.soLuong - 1})" class="quantity-btn decrease">-</button>
                    <span class="quantity-display">${item.soLuong}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.soLuong + 1})" class="quantity-btn increase">+</button>
                  </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="remove-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `;
          }
        });
      }
      
      // Cập nhật nội dung cart items
      const cartItemsContainer = cartModal.querySelector('.cart-items');
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cartItemsHTML;
      }
      
      // Cập nhật hoặc ẩn/hiện phần total và actions
      let cartTotal = cartModal.querySelector('.cart-total');
      let cartActions = cartModal.querySelector('.cart-actions');
      
      if (cartItems.length > 0) {
        // Hiển thị total
        if (cartTotal) {
          cartTotal.innerHTML = `<h3>Tổng cộng: ${formatPrice(total)} VND</h3>`;
          cartTotal.style.display = 'block';
        } else {
          // Tạo mới nếu chưa có
          const totalHTML = `
            <div class="cart-total">
              <h3>Tổng cộng: ${formatPrice(total)} VND</h3>
            </div>
          `;
          cartItemsContainer.insertAdjacentHTML('afterend', totalHTML);
        }
        
        // Hiển thị actions
        if (cartActions) {
          cartActions.style.display = 'flex';
        } else {
          // Tạo mới nếu chưa có
          const actionsHTML = `
            <div class="cart-actions">
              <button onclick="clearCart()" class="clear-cart-btn">Xóa tất cả</button>
              <button onclick="checkout()" class="checkout-btn">Thanh toán</button>
            </div>
          `;
          (cartTotal || cartItemsContainer).insertAdjacentHTML('afterend', actionsHTML);
        }
      } else {
        // Ẩn total và actions khi giỏ hàng trống
        if (cartTotal) cartTotal.style.display = 'none';
        if (cartActions) cartActions.style.display = 'none';
      }
      
      // Cập nhật số lượng ở nút giỏ hàng floating
      fetchCartItems();
    })
    .catch((err) => {
      console.error("Lỗi khi refresh cart content:", err);
    });
};

// === UPDATE QUANTITY ===
let updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
        removeFromCart(cartId);
        return;
    }

    cartService
        .getById(cartId)
        .then((res) => {
            let cartData = res.data; 
            cartData.soLuong = newQuantity;

            return cartService.updateCartItem(cartData, cartId);
        })
        .then(() => {
            console.log("Cập nhật số lượng thành công");
            // Chỉ refresh nội dung, không đóng popup
            refreshCartContent();
        })
        .catch((err) => {
            console.error("Lỗi khi cập nhật số lượng:", err);
            alert("Có lỗi khi cập nhật số lượng!");
        });
};

// === REMOVE FROM CART ===
let removeFromCart = (cartId) => {
    cartService
        .deleteById(cartId)
        .then((res) => {
            console.log("Xóa khỏi giỏ hàng thành công:", res);
            // Chỉ refresh nội dung, không đóng popup
            refreshCartContent();
        })
        .catch((err) => {
            console.log("Lỗi khi xóa khỏi giỏ hàng:", err);
        });
};

// === CLEAR CART ===
let clearCart = () => {
    if (confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
        cartService
            .clearCart()
            .then(() => {
                console.log("Xóa toàn bộ giỏ hàng thành công");
                // Refresh nội dung để hiển thị empty state
                refreshCartContent();
                alert("Đã xóa toàn bộ giỏ hàng!");
            })
            .catch((err) => {
                console.log("Lỗi khi xóa giỏ hàng:", err);
            });
    }
};

// === CHECKOUT ===
let checkout = () => {
    // Lấy dữ liệu giỏ hàng hiện tại
    cartService
        .getList()
        .then((res) => {
            let cartItems = res.data;
            if (cartItems.length === 0) {
                alert("Giỏ hàng trống!");
                return;
            }
            
            // Đóng modal giỏ hàng
            closeCart();
            
            // Hiển thị popup bill
            showCheckoutBill(cartItems);
        })
        .catch((err) => {
            console.error("Lỗi khi lấy giỏ hàng:", err);
            alert("Có lỗi xảy ra!");
        });
};

// === SHOW CHECKOUT BILL ===
let showCheckoutBill = (cartItems) => {
    let total = 0;
    let itemsHTML = '';
    
    cartItems.forEach(item => {
        if (item.product && item.soLuong) {
            let itemTotal = item.product.price * item.soLuong;
            total += itemTotal;
            
            itemsHTML += `
                <tr class="bill-item">
                    <td class="item-name">${item.product.name}</td>
                    <td class="item-price">${formatPrice(item.product.price)} VND</td>
                    <td class="item-quantity">x${item.soLuong}</td>
                    <td class="item-total">${formatPrice(itemTotal)} VND</td>
                </tr>
            `;
        }
    });
    
    const currentDate = new Date().toLocaleDateString('vi-VN');
    const currentTime = new Date().toLocaleTimeString('vi-VN');
    
    let billHTML = `
        <div class="checkout-modal" id="checkoutModal" onclick="closeCheckoutBill()">
            <div class="bill-content" onclick="event.stopPropagation()">
                <div class="bill-header">
                    <h2 class="bill-title">🧾 Hóa đơn thanh toán</h2>
                    <button class="close-btn" onclick="closeCheckoutBill()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="bill-info">
                    <div class="shop-info">
                        <h3>🏪 Cửa Hàng Điện Thoại</h3>
                        <p>📍 Địa chỉ: 123 Đường ABC, Quận XYZ</p>
                        <p>📞 Hotline: 0123-456-789</p>
                    </div>
                    
                    <div class="bill-date">
                        <p>📅 Ngày: ${currentDate}</p>
                        <p>🕐 Giờ: ${currentTime}</p>
                    </div>
                </div>
                
                <div class="bill-items">
                    <table class="bill-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>SL</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>
                </div>
                
                <div class="bill-summary">
                    <div class="bill-total">
                        <h3>💰 Tổng cộng: ${formatPrice(total)} VND</h3>
                    </div>
                    
                    <div class="payment-method">
                        <h4>💳 Hình thức thanh toán:</h4>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="cash" checked>
                                <span>💵 Tiền mặt</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="bill-actions">
                    <button onclick="closeCheckoutBill()" class="cancel-btn">❌ Hủy</button>
                    <button onclick="confirmPayment()" class="confirm-btn">✅ Xác nhận thanh toán</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', billHTML);
    
    // Thêm animation
    setTimeout(() => {
        document.getElementById("checkoutModal").classList.add('show');
    }, 10);
};

// === CLOSE CHECKOUT BILL ===
let closeCheckoutBill = () => {
    let modal = document.getElementById("checkoutModal");
    if (modal) {
        modal.classList.add('hide');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
};

// === CONFIRM PAYMENT ===
let confirmPayment = () => {
    // Hiển thị loading
    const confirmBtn = document.querySelector('.confirm-btn');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '⏳ Đang xử lý...';
    confirmBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        console.log("🔄 Starting payment process...");
        
        // Clear toàn bộ giỏ hàng
        cartService
            .clearCart()
            .then(() => {
                console.log("✅ Payment successful - Cart cleared");
                
                // Verify cart is actually empty
                return cartService.getList();
            })
            .then((res) => {
                console.log("📋 Cart verification after payment:", res.data.length, "items remaining");
                
                // Đóng bill modal
                closeCheckoutBill();
                
                // Cập nhật UI giỏ hàng
                fetchCartItems();
                
                // Hiển thị thông báo thành công
                showPaymentSuccess();
                
                // Nếu vẫn còn items, log warning
                if (res.data.length > 0) {
                    console.warn("⚠️ Warning: Some items still remain in cart after payment!");
                    console.warn("Remaining items:", res.data);
                }
            })
            .catch((err) => {
                console.error("❌ Payment failed - Error clearing cart:", err);
                
                // Restore button
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
                
                alert("Có lỗi xảy ra trong quá trình thanh toán! Vui lòng thử lại.");
            });
    }, 1500); // Simulate processing time
};

// === SHOW PAYMENT SUCCESS ===
let showPaymentSuccess = () => {
    let successHTML = `
        <div class="success-modal" id="successModal">
            <div class="success-content">
                <div class="success-icon">✅</div>
                <h2>Thanh toán thành công!</h2>
                <p>Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi</p>
                <button onclick="closeSuccessModal()" class="success-btn">Tiếp tục mua sắm</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 3000);
};

// === CLOSE SUCCESS MODAL ===
let closeSuccessModal = () => {
    let modal = document.getElementById("successModal");
    if (modal) {
        modal.remove();
    }
};

// === SCROLL TO TOP ===
let scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// === SHOW/HIDE SCROLL TO TOP BUTTON ===
window.addEventListener('scroll', () => {
    let scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
});