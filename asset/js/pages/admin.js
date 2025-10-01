// Admin Page Logic

// === VARIABLES ===
let allProducts = []; // Lưu tất cả sản phẩm từ API
let editingProductId = null; // ID sản phẩm đang được edit

// === FETCH PRODUCTS LIST ===
let fetchListProducts = () => {
  console.log("📞 Calling fetchListProducts...");
  console.log("🔍 Utils:", Utils);
  console.log("🔍 productService:", productService);
  console.log("🔍 API_CONFIG:", API_CONFIG);
  
  Utils.turnOnLoading();
  productService
    .getList()
    .then((res) => {
      Utils.turnOffLoading();
      let products = res.data;
      console.log("🚀 - Products:", products);
      console.log("🚀 - Products length:", products.length);
      allProducts = products;
      renderProductsTable(products);
    })
    .catch((err) => {
      Utils.turnOffLoading();
      console.log("❌ Lỗi khi lấy danh sách sản phẩm:", err);
      console.error("❌ Full error:", err);
      alert("Có lỗi xảy ra khi tải danh sách sản phẩm!");
    });
};

// Gọi khi trang load
console.log("🏁 Starting admin.js...");

// Đảm bảo DOM đã load xong
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchListProducts);
} else {
  fetchListProducts();
}

// === RENDER PRODUCTS TABLE === 
let renderProductsTable = (products) => {
  console.log("Rendering products table...");
  console.log("Products to render:", products);
  console.log("Products count:", products.length);
  
  let contentHTML = "";

  products.forEach((product) => {
    let { id, name, price, img, desc } = product;
    
    let rowHTML = `
      <tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${Utils.formatPrice(price)}</td>
        <td><img src="${img}" width="100" height="100" style="border-radius: 6px; object-fit: cover;"></td>
        <td>${desc}</td>
        <td>
          <button onclick="deleteProduct('${id}')" class="btn btn-info">DELETE</button>
          <button onclick="editProduct('${id}')" data-bs-toggle="modal" data-bs-target="#phoneModal" class="btn btn-warning">EDIT</button>
        </td>
      </tr>
    `;
    contentHTML += rowHTML;
  });

  // console.log("Generated HTML:", contentHTML);
  
  const tbodyElement = document.querySelector("#tbody");
  // console.log("tbody element:", tbodyElement);
  
  if (tbodyElement) {
    tbodyElement.innerHTML = contentHTML;
    console.log("✅Table rendered successfully!");
  } else {
    console.error("❌ tbody element not found!");
  }
};

// === DELETE PRODUCT ===
let deleteProduct = (productId) => {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    Utils.turnOnLoading();
    productService
      .deleteById(productId)
      .then((res) => {
        Utils.turnOffLoading();
        console.log("Xóa sản phẩm thành công:", res);
        alert("Xóa sản phẩm thành công!");
        fetchListProducts();
      })
      .catch((err) => {
        Utils.turnOffLoading();
        console.log("Lỗi khi xóa sản phẩm:", err);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      });
  }
};

// === VALIDATE DUPLICATE NAME ===
let validateProductName = (name, excludeId = null) => {
  return allProducts.some(product => 
    product.name.toLowerCase().trim() === name.toLowerCase().trim() && 
    product.id !== excludeId
  );
};

// === CREATE PRODUCT === 
let createProduct = () => {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value;
  const screen = document.getElementById("screen").value;
  const backCamera = document.getElementById("backCamera").value;
  const frontCamera = document.getElementById("frontCamera").value;
  const img = document.getElementById("img").value;
  const desc = document.getElementById("desc").value;
  const type = document.getElementById("type").value;

  // Kiểm tra nếu bất kỳ trường nào rỗng
  if (!name || !price || !screen || !backCamera || !frontCamera || !img || !desc || !type || type === "Select brand") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Kiểm tra trùng tên sản phẩm
  if (validateProductName(name)) {
    alert("Tên sản phẩm đã tồn tại! Vui lòng chọn tên khác.");
    return;
  }

  // Kiểm tra giá tiền hợp lệ
  if (isNaN(price) || parseFloat(price) <= 0) {
    alert("Giá sản phẩm phải là số dương!");
    return;
  }

  const newProduct = {
    name: name,
    price: parseFloat(price),
    screen: screen,
    backCamera: backCamera,
    frontCamera: frontCamera,
    img: img,
    desc: desc,
    type: type
  };

  Utils.turnOnLoading();
  productService
    .createProduct(newProduct)
    .then((res) => {
      Utils.turnOffLoading();
      console.log("Thêm sản phẩm thành công:", res);
      alert("Thêm sản phẩm thành công!");
      fetchListProducts();
      resetForm();
      // Đóng modal Bootstrap
      var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("phoneModal"));
      modal.hide();
    })
    .catch((err) => {
      Utils.turnOffLoading();
      console.log("Lỗi khi thêm sản phẩm:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm!");
    });
};

// === EDIT PRODUCT === 
let editProduct = (productId) => {
  editingProductId = productId;
  console.log("Edit product ID:", productId);
  
  // Chuyển modal sang chế độ Edit
  document.getElementById("phoneModalLabel").textContent = "Edit Phone";
  document.getElementById("addPhoneBtn").style.display = "none";
  document.getElementById("savePhoneBtn").style.display = "inline-block";
  
  productService
    .getById(productId)
    .then((res) => {
      let product = res.data;
      console.log("Dữ liệu sản phẩm cần edit:", product);
      
      // Điền dữ liệu vào form
      document.getElementById("name").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("screen").value = product.screen;
      document.getElementById("backCamera").value = product.backCamera;
      document.getElementById("frontCamera").value = product.frontCamera;
      document.getElementById("img").value = product.img;
      document.getElementById("desc").value = product.desc;
      document.getElementById("type").value = product.type;
    })
    .catch((err) => {
      console.log("Lỗi khi lấy thông tin sản phẩm:", err);
      alert("Có lỗi xảy ra khi lấy thông tin sản phẩm!");
    });
};

// === UPDATE PRODUCT === 
let saveUpdate = () => {
  let name = document.getElementById("name").value.trim();
  let price = document.getElementById("price").value;
  let screen = document.getElementById("screen").value;
  let backCamera = document.getElementById("backCamera").value;
  let frontCamera = document.getElementById("frontCamera").value;
  let img = document.getElementById("img").value;
  let desc = document.getElementById("desc").value;
  let type = document.getElementById("type").value;

  // Kiểm tra nếu bất kỳ trường nào rỗng
  if (!name || !price || !screen || !backCamera || !frontCamera || !img || !desc || !type || type === "Select brand") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Kiểm tra trùng tên sản phẩm (trừ sản phẩm hiện tại)
  if (validateProductName(name, editingProductId)) {
    alert("Tên sản phẩm đã tồn tại! Vui lòng chọn tên khác.");
    return;
  }

  // Kiểm tra giá tiền hợp lệ
  if (isNaN(price) || parseFloat(price) <= 0) {
    alert("Giá sản phẩm phải là số dương!");
    return;
  }

  const updatedProduct = {
    name: name,
    price: parseFloat(price),
    screen: screen,
    backCamera: backCamera,
    frontCamera: frontCamera,
    img: img,
    desc: desc,
    type: type
  };

  Utils.turnOnLoading();
  productService
    .updateProduct(updatedProduct, editingProductId)
    .then((res) => {
      Utils.turnOffLoading();
      console.log("Cập nhật sản phẩm thành công:", res);
      alert("Cập nhật sản phẩm thành công!");
      
      editingProductId = null;
      fetchListProducts();
      resetForm();
      
      // Đóng modal Bootstrap
      var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("phoneModal"));
      modal.hide();
    })
    .catch((err) => {
      Utils.turnOffLoading();
      console.log("Lỗi khi cập nhật sản phẩm:", err);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
    });
};

// === SEARCH FUNCTION === 
let searchProducts = () => {
  let searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();

  // Lọc danh sách theo tên sản phẩm
  const filteredProducts = allProducts.filter(
    (product) => product.name && product.name.toLowerCase().includes(searchTerm)
  );

  // Hiển thị kết quả
  renderProductsTable(filteredProducts);
};

// === FORM FUNCTIONS ===
let resetForm = () => {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("backCamera").value = "";
  document.getElementById("frontCamera").value = "";
  document.getElementById("img").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("type").value = "Select brand";
  editingProductId = null;
};

// === SETUP ADD MODE ===
let setupAddMode = () => {
  // Chuyển modal sang chế độ Add
  document.getElementById("phoneModalLabel").textContent = "Add New Phone";
  document.getElementById("addPhoneBtn").style.display = "inline-block";
  document.getElementById("savePhoneBtn").style.display = "none";
  
  // Reset form
  resetForm();
};

