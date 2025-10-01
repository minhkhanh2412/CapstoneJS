// Admin Page Logic

// === LOADING FUNCTIONS ===
let turnOnLoading = () => {
  document.getElementById("loading").style.display = "flex";
};

let turnOffLoading = () => {
  document.getElementById("loading").style.display = "none";
};

// === VARIABLES ===
let allProducts = []; // Lưu tất cả sản phẩm từ API
let editingProductId = null; // ID sản phẩm đang được edit

// === FETCH PRODUCTS LIST ===
let fetchListProducts = () => {
  turnOnLoading();
  productService
    .getList()
    .then((res) => {
      turnOffLoading();
      let products = res.data;
      console.log("🚀 - Products:", products);
      allProducts = products;
      renderProductsTable(products);
    })
    .catch((err) => {
      turnOffLoading();
      console.log("Lỗi khi lấy danh sách sản phẩm:", err);
      alert("Có lỗi xảy ra khi tải danh sách sản phẩm!");
    });
};

// Gọi khi trang load
fetchListProducts();

// === RENDER PRODUCTS TABLE ===
let renderProductsTable = (products) => {
  let contentHTML = "";

  products.forEach((product) => {
    let { id, name, price, screen, backCamera, frontCamera, img, desc, type } = product;
    
    let rowHTML = `
      <tr>
        <td><img src="${img}" alt="${name}" class="product-image-small" /></td>
        <td>${name}</td>
        <td>${formatPrice(price)} VND</td>
        <td>${type}</td>
        <td>${screen}</td>
        <td class="product-actions">
          <button onclick="editProduct('${id}')" class="btn-edit">Sửa</button>
          <button onclick="deleteProduct('${id}')" class="btn-delete">Xóa</button>
          <button onclick="viewProductDetail('${id}')" class="btn-view">Xem</button>
        </td>
      </tr>
    `;
    contentHTML += rowHTML;
  });

  document.querySelector("tbody").innerHTML = contentHTML;
};

// === FORMAT PRICE ===
let formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

// === DELETE PRODUCT  ===
let deleteProduct = (productId) => {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    turnOnLoading();
    productService
      .deleteById(productId)
      .then((res) => {
        turnOffLoading();
        console.log("Xóa sản phẩm thành công:", res);
        alert("Xóa sản phẩm thành công!");
        // Gọi lại API để lấy danh sách mới nhất
        fetchListProducts();
      })
      .catch((err) => {
        turnOffLoading();
        console.log("Lỗi khi xóa sản phẩm:", err);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      });
  }
};

// === CREATE PRODUCT ===
let createProduct = () => {
  // Lấy dữ liệu từ form
  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const screen = document.getElementById("productScreen").value;
  const backCamera = document.getElementById("productBackCamera").value;
  const frontCamera = document.getElementById("productFrontCamera").value;
  const img = document.getElementById("productImg").value;
  const desc = document.getElementById("productDesc").value;
  const type = document.getElementById("productType").value;

  // Validate dữ liệu
  if (!name || !price || !type) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    return;
  }

  const newProduct = {
    name: name,
    price: price,
    screen: screen,
    backCamera: backCamera,
    frontCamera: frontCamera,
    img: img,
    desc: desc,
    type: type
  };

  turnOnLoading();
  productService
    .createProduct(newProduct)
    .then((res) => {
      turnOffLoading();
      console.log("Thêm sản phẩm thành công:", res);
      alert("Thêm sản phẩm thành công!");
      // Reset form
      resetForm();
      // Gọi lại API để lấy danh sách mới nhất
      fetchListProducts();
      // Đóng modal
      closeProductModal();
    })
    .catch((err) => {
      turnOffLoading();
      console.log("Lỗi khi thêm sản phẩm:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm!");
    });
};

// === EDIT PRODUCT ===
let editProduct = (productId) => {
  editingProductId = productId;
  
  productService
    .getById(productId)
    .then((res) => {
      let product = res.data;
      console.log("Dữ liệu sản phẩm cần edit:", product);
      
      // Điền dữ liệu vào form
      document.getElementById("productName").value = product.name;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productScreen").value = product.screen;
      document.getElementById("productBackCamera").value = product.backCamera;
      document.getElementById("productFrontCamera").value = product.frontCamera;
      document.getElementById("productImg").value = product.img;
      document.getElementById("productDesc").value = product.desc;
      document.getElementById("productType").value = product.type;
      
      // Thay đổi title và button của modal
      document.querySelector(".modal-header h3").textContent = "Chỉnh sửa sản phẩm";
      document.querySelector(".btn-save").textContent = "Cập nhật";
      
      // Hiển thị modal
      showProductModal();
    })
    .catch((err) => {
      console.log("Lỗi khi lấy thông tin sản phẩm:", err);
      alert("Có lỗi xảy ra khi lấy thông tin sản phẩm!");
    });
};

// === UPDATE PRODUCT ===
let updateProduct = () => {
  if (!editingProductId) {
    createProduct(); // Nếu không có ID thì tạo mới
    return;
  }

  // Lấy dữ liệu từ form
  const updatedProduct = {
    name: document.getElementById("productName").value,
    price: parseFloat(document.getElementById("productPrice").value),
    screen: document.getElementById("productScreen").value,
    backCamera: document.getElementById("productBackCamera").value,
    frontCamera: document.getElementById("productFrontCamera").value,
    img: document.getElementById("productImg").value,
    desc: document.getElementById("productDesc").value,
    type: document.getElementById("productType").value
  };

  // Validate dữ liệu
  if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.type) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    return;
  }

  turnOnLoading();
  productService
    .updateProduct(updatedProduct, editingProductId)
    .then((res) => {
      turnOffLoading();
      console.log("Cập nhật sản phẩm thành công:", res);
      alert("Cập nhật sản phẩm thành công!");
      
      // Reset variables
      editingProductId = null;
      resetForm();
      
      // Gọi lại API để lấy danh sách mới nhất
      fetchListProducts();
      
      // Đóng modal
      closeProductModal();
    })
    .catch((err) => {
      turnOffLoading();
      console.log("Lỗi khi cập nhật sản phẩm:", err);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
    });
};

// === VIEW PRODUCT DETAIL ===
let viewProductDetail = (productId) => {
  productService
    .getById(productId)
    .then((res) => {
      let product = res.data;
      console.log("Chi tiết sản phẩm:", product);
      showProductDetailModal(product);
    })
    .catch((err) => {
      console.log("Lỗi khi lấy chi tiết sản phẩm:", err);
    });
};

// === MODAL FUNCTIONS ===
let showProductModal = () => {
  document.querySelector(".product-form-modal").style.display = "flex";
};

let closeProductModal = () => {
  document.querySelector(".product-form-modal").style.display = "none";
  resetForm();
  editingProductId = null;
  
  // Reset modal title và button
  document.querySelector(".modal-header h3").textContent = "Thêm sản phẩm mới";
  document.querySelector(".btn-save").textContent = "Lưu";
};

let showProductDetailModal = (product) => {
  let modalHTML = `
    <div class="product-detail-modal" id="productDetailModal">
      <div class="modal-content">
        <span class="close" onclick="closeProductDetailModal()">&times;</span>
        <h2>${product.name}</h2>
        <img src="${product.img}" alt="${product.name}" style="width: 200px; height: 200px; object-fit: cover;" />
        <p><strong>Giá:</strong> ${formatPrice(product.price)} VND</p>
        <p><strong>Loại:</strong> ${product.type}</p>
        <p><strong>Màn hình:</strong> ${product.screen}</p>
        <p><strong>Camera sau:</strong> ${product.backCamera}</p>
        <p><strong>Camera trước:</strong> ${product.frontCamera}</p>
        <p><strong>Mô tả:</strong> ${product.desc}</p>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

let closeProductDetailModal = () => {
  let modal = document.getElementById("productDetailModal");
  if (modal) {
    modal.remove();
  }
};

// === FORM FUNCTIONS ===
let resetForm = () => {
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productScreen").value = "";
  document.getElementById("productBackCamera").value = "";
  document.getElementById("productFrontCamera").value = "";
  document.getElementById("productImg").value = "";
  document.getElementById("productDesc").value = "";
  document.getElementById("productType").value = "";
};

// === SEARCH FUNCTION ===
let searchProducts = () => {
  let searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  let filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.type.toLowerCase().includes(searchTerm) ||
    product.desc.toLowerCase().includes(searchTerm)
  );
  
  renderProductsTable(filteredProducts);
};

// === VALIDATE FORM ===
let validateForm = () => {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const type = document.getElementById("productType").value;
  const saveBtn = document.querySelector(".btn-save");
  
  if (name.length > 0 && price > 0 && type.length > 0) {
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
};

