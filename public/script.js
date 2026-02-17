let currentView = "dashboard"

const sidebar = document.getElementById("sidebar")
const sidebarToggle = document.getElementById("sidebarToggle")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const navLinks = document.querySelectorAll(".nav-link")
const pageTitle = document.getElementById("pageTitle")
const views = document.querySelectorAll(".view")
const themeToggle = document.getElementById("themeToggle")
const userMenuToggle = document.getElementById("userMenuToggle")
const userDropdown = document.getElementById("userDropdown")
const itemModal = document.getElementById("itemModal")
const itemForm = document.getElementById("itemForm")
const modalTitle = document.getElementById("modalTitle")
const searchInput = document.getElementById("searchInput")
const categoryFilter = document.getElementById("categoryFilter")
const categoryForm = document.getElementById("categoryForm")

document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
})

function initializeApp() {
  const isDarkMode = localStorage.getItem("darkMode") === "true"
  if (isDarkMode) {
    document.body.classList.add("dark-theme")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }
  showView("dashboard")
}

function setupEventListeners() {
  sidebarToggle?.addEventListener("click", toggleSidebar)
  mobileMenuToggle?.addEventListener("click", toggleMobileSidebar)

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const view = link.dataset.view
      showView(view)
      setActiveNavLink(link)
    })
  })

  themeToggle?.addEventListener("click", toggleTheme)
  userMenuToggle?.addEventListener("click", toggleUserMenu)

  document.getElementById("addItemBtn")?.addEventListener("click", () => openItemModal())

  setupModalEvents()

  itemForm?.addEventListener("submit", handleFormSubmit)
  searchInput?.addEventListener("input", filterInventory)
  categoryFilter?.addEventListener("change", filterInventory)
}

function toggleSidebar() {
  sidebar.classList.toggle("collapsed")
  localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"))
}

function toggleMobileSidebar() {
  sidebar.classList.toggle("show")
}

function showView(viewName) {
  views.forEach((view) => view.classList.remove("active"))
  const targetView = document.getElementById(`${viewName}View`)
  if (targetView) {
    targetView.classList.add("active")
    currentView = viewName
    const titles = {
      dashboard: "Dashboard",
      inventory: "Inventory Management",
      categories: "Categories",
      suppliers: "Suppliers",
      orders: "Purchase Orders",
      reports: "Product Salling",
      settings: "History of Transactions",
    }
    pageTitle.textContent = titles[viewName] || "Dashboard"
  }
}

function setActiveNavLink(activeLink) {
  navLinks.forEach((link) => link.classList.remove("active"))
  activeLink.classList.add("active")
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme")
  const isDarkMode = document.body.classList.contains("dark-theme")
  themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'
  localStorage.setItem("darkMode", isDarkMode)
}

function toggleUserMenu() {
  userDropdown.classList.toggle("show")
}

function setupModalEvents() {
  const modalClose = itemModal?.querySelector(".modal-close")
  const cancelBtn = document.getElementById("cancelBtn")

  modalClose?.addEventListener("click", closeItemModal)
  cancelBtn?.addEventListener("click", closeItemModal)

  itemModal?.addEventListener("click", (e) => {
    if (e.target === itemModal) {
      closeItemModal()
    }
  })
}

function openItemModal(item = null) {
  if (!itemModal || !itemForm) return
  modalTitle.textContent = item ? "Edit Item" : "Add New Item"

  if (!item) {
    itemForm.reset()
    document.getElementById("itemId").value = ""
  }

  itemModal.classList.add("show")
}

function closeItemModal() {
  itemModal?.classList.remove("show")
}

function handleFormSubmit(e) {
  e.preventDefault()
}

document.getElementById("exportBtn")?.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/product/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })

    const data = await res.json()

    if (data.success && data.products.length > 0) {
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Inventory Report</title>
          <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 15px; 
                    padding: 0;
                    box-sizing: border-box;
                }
                
                h1 { 
                    color: #333; 
                    text-align: center; 
                    margin-bottom: 25px; 
                    font-size: 24px;
                    page-break-after: avoid;
                }
                
                table { 
                    width: 100%; 
                    max-width: 100%;
                    border-collapse: collapse; 
                    margin: 15px 0;
                    table-layout: fixed;
                    word-wrap: break-word;
                }
                
                th, td { 
                    border: 1px solid #ccc; 
                    padding: 8px 6px; 
                    text-align: left;
                    vertical-align: top;
                    overflow: hidden;
                    word-wrap: break-word;
                    hyphens: auto;
                }
                
                th { 
                    background-color: #f5f5f5; 
                    font-weight: bold;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                td {
                    font-size: 11px;
                    line-height: 1.3;
                }
                
                tr:nth-child(even) { 
                    background-color: #fafafa; 
                }
                
                tr:hover {
                    background-color: #f0f0f0;
                }
                
                .report-info { 
                    margin-bottom: 15px; 
                    font-size: 12px; 
                    color: #666;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                    th:nth-child(1), td:nth-child(1) { width: 12%; } 
                th:nth-child(2), td:nth-child(2) { width: 20%; } 
                th:nth-child(3), td:nth-child(3) { width: 15%; } 
                th:nth-child(4), td:nth-child(4) { width: 8%; }  
                th:nth-child(5), td:nth-child(5) { width: 10%; } 
                th:nth-child(6), td:nth-child(6) { width: 10%; } 
                th:nth-child(7), td:nth-child(7) { width: 10%; } 
                th:nth-child(8), td:nth-child(8) { width: 15%; } 
            </style>
        </head>
        <body>
          <h1>Inventory Report</h1>
          <div class="report-info">
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p><strong>Total Items:</strong> ${data.products.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Value (₹)</th>
                <th>Status</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
      `

      data.products.forEach((product) => {
        htmlContent += `
          <tr>
            <td>${product.sku || "N/A"}</td>
            <td>${product.name || "N/A"}</td>
            <td>${product.category?.name || "N/A"}</td>
            <td>${product.quantity || 0}</td>
            <td>${product.price || 0}</td>
            <td>${product.value || 0}</td>
            <td>${product.status || "N/A"}</td>
            <td>${product.supplier?.name || "N/A"}</td>
          </tr>
        `
      })

      htmlContent += `
            </tbody>
          </table>
        </body>
        </html>
      `

      const blob = new Blob([htmlContent], {
        type: "application/msword;charset=utf-8",
      })

      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = `Inventory_Report_${new Date().toISOString().split("T")[0]}.doc`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      console.log("Inventory exported successfully!")
    } else {
      alert("No inventory data available to export")
    }
  } catch (error) {
    console.error("Error exporting inventory:", error)
    alert("Failed to export inventory data")
  }
})

function filterInventory() {
  const searchTerm = searchInput.value.toLowerCase()
  const category = categoryFilter.value

  fetch("/api/product/products", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        let filteredProducts = data.products

        if (searchTerm) {
          filteredProducts = filteredProducts.filter(
            (item) => item.name.toLowerCase().includes(searchTerm) || item.sku.toLowerCase().includes(searchTerm),
          )
        }

        if (category) {
          filteredProducts = filteredProducts.filter((item) => item.category && item.category._id === category)
        }

        renderInventoryTable(filteredProducts)
      }
    })
    .catch((error) => {
      console.error("Error filtering inventory:", error)
    })
}

async function editItem(sku) {
  openItemModal()

  try {
    const res = await fetch("/api/product/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })

    const data = await res.json()

    if (data.success) {
      const item = data.products.find((product) => product.sku === sku)
      if (item) {
        document.getElementById("itemName").value = item.name
        document.getElementById("itemSKU").value = item.sku
        document.getElementById("itemQuantity").value = item.quantity
        document.getElementById("itemPrice").value = item.price
        document.getElementById("itemCategory").value = item.category._id
        document.getElementById("itemSupplier").value = item.supplier._id
        document.getElementById("sellingPrice").value = item.sellingPrice
      }
    }
  } catch (error) {
    console.error("Error fetching inventory:", error)
  }
}

async function getUser() {
  try {
    const res = await fetch("/api/user/user", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      document.querySelector(".user-name").innerHTML = data.user.name;
      document.querySelector(".user-role").innerHTML = data.user.role;
    } else {
      window.location.href = "authentication.html"
    }
  } catch (error) {
    console.error("Error fetching user:", error)
  }
}

window.onload = getUser()

async function getInventryData() {
  try {
    const res = await fetch("/api/product/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      renderInventoryTable(data.products)
    }
  } catch (error) {
    console.error("Error fetching inventory:", error)
  }
}

function renderInventoryTable(products) {
  const inventoryTable = document.getElementById("inventoryTableBody")
  inventoryTable.innerHTML = ""
  products.forEach((e) => {
    const tableRow = document.createElement("tr")
    tableRow.className = "tableR"
    tableRow.innerHTML = `
            <td>${e.sku}</td>
            <td>${e.name}</td>
            <td>${e.category?.name || "N/A"}</td>
            <td>${e.quantity}</td>
            <td>₹ ${e.price.toFixed(2)}</td>
            <td>₹ ${e.value.toFixed(2)}</td>
            <td>${e.status}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn-sm" onclick="editItem('${e.sku}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-sm" onclick="deleteItem('${e._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `
    inventoryTable.appendChild(tableRow)
  })
}

async function getCategory() {
  const options = document.getElementById("itemCategory")

  try {
    const res = await fetch("/api/product/category", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()

    if (data.success) {
      data.categories.forEach((e) => {
        const opt = document.createElement("option")
        opt.value = e._id
        opt.textContent = e.name
        options.appendChild(opt)
      })
    }
    return data
  } catch (error) {
    console.error(error)
  }
}

async function getSuppilers() {
  const optionSupplier = document.getElementById("itemSupplier")

  try {
    const res = await fetch("/api/product/suppliers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()

    if (data.success) {
      data.suppiler.forEach((e) => {
        const opt = document.createElement("option")
        opt.value = e._id
        opt.textContent = e.name
        optionSupplier.appendChild(opt)
      })
    }
  } catch (error) {
    console.error(error)
  }
}

function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter")
  if (!categoryFilter) return

  // Clear existing options except the first one
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1)
  }

  fetch("/api/product/category", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.categories.forEach((category) => {
          const option = document.createElement("option")
          option.value = category._id
          option.textContent = category.name
          categoryFilter.appendChild(option)
        })
      }
    })
    .catch((error) => {
      console.error("Error loading categories:", error)
    })
}

document.addEventListener("DOMContentLoaded", () => {
  getSuppilers()
  getCategory()
  AllCategorySession()
  getAllSuppliers()
  populateCategoryFilter()
})

getInventryData()

async function AllCategorySession() {
  const categoriesGrid = document.getElementById("categoriesGrid")
  try {
    const res = await fetch("/api/product/category", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      data.categories.forEach((e) => {
        categoriesGrid.innerHTML += `
                <div class="category-card">
                <div class="category-icon">
                    <i class="${e.name.toLowerCase()} || fa-solid fa-layer-group"></i>
                </div>
                <div class="category-name">${e.name}</div>
                <div class="category-count">${e.description} items</div>
                <div style="margin-top: 1rem;">
                    <button class="btn-secondary" onclick="editCategory('${e._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="deleteCategory('${e._id}')" style="margin-left: 0.5rem;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `
      })
    }
  } catch (error) {
    console.error("Error related to category", error)
  }
}

async function getAllSuppliers() {
  const suppliersList = document.getElementById("suppliersList")
  try {
    const res = await fetch("/api/product/suppliers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()
    suppliersList.innerHTML = ""
    if (data.success) {
      data.suppiler.forEach((e) => {
        suppliersList.innerHTML += `
            <div class="supplier-card" style="background-color: var(--bg-primary); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1rem; box-shadow: var(--shadow-md);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h3 style="margin-bottom: 0.5rem;">${e.name}</h3>
                        <p style="color: var(--text-muted); margin-bottom: 0.5rem;">
                            <i class="fas fa-envelope"></i> ${e.email}
                        </p>
                        <p style="color: var(--text-muted); margin-bottom: 0.5rem;">
                            <i class="fas fa-phone"></i> ${e.contact}
                        </p>
                        <p style="color: var(--text-muted); margin-bottom: 0.5rem;">
                            <i class="fa-solid fa-building"></i> ${e.company}
                        </p>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">
                            <i class="fa-solid fa-location-dot"></i> ${e.address} 
                        </p>
                    </div>
                    <div>
                        <button class="btn-secondary" onclick="editSupplier('${e._id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-danger" onclick="deleteSupplier('${e._id}')" style="margin-left: 0.5rem;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `
      })
    }
  } catch (error) {
    console.error(error)
  }
}

async function editCategory(id) {
  const input = document.getElementById("categoryIdType")
  input.value = id
  openModalCategory()
  try {
    const res = await fetch("/api/product/category", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()

    if (data.success) {
      const item = data.categories.find((e) => e._id === id)
      document.getElementById("categoryName").value = item.name;
      document.getElementById("categoryDescription").value = item.description
    }
  } catch (error) {
    console.error(error)
  }
}

async function deleteCategory(id) {
  try {
    const res = await fetch("/api/product/delete/category", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      console.log(data)
      successToast(data.message)
    }
  } catch (error) {
    console.error("Category deletion error:", error)
  }
}

const closeIconButton = document.querySelector(".modal-close-category")
const modalCategory = document.getElementById("categoryModal")

function openModalCategory() {
  if (modalCategory) {
    modalCategory.classList.add("show")
    document.body.style.overflow = "hidden"
  }
}

function closeModalCategory() {
  if (modalCategory) {
    modalCategory.classList.remove("show")
    document.body.style.overflow = "auto"
  }
}

if (closeIconButton) {
  closeIconButton.addEventListener("click", closeModalCategory)
}

document.getElementById("cancelCategoryBtn").addEventListener("click", () => {
  closeModalCategory()
  categoryForm.reset()
  document.getElementById("categoryIdType").value = ""
})

document.getElementById("addCategoryBtn").addEventListener("click", async () => {
  openModalCategory()
  categoryForm.reset()
  document.getElementById("categoryIdType").value = ""
})

document.getElementById("saveData").addEventListener("click", async () => {
  const id = document.getElementById("categoryIdType").value
  const name = document.getElementById("categoryName").value
  const description = document.getElementById("categoryDescription").value

  try {
    const res = await fetch(id ? `/api/product/update/category/${id}` : "/api/product/add/category", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
      credentials: "include",
    })

    const data = await res.json()
    if (data.success) {
      console.log(data)
      successToast(data.message)
    }
  } catch (error) {
    console.error("Fetch Error:", error)
  }
})

const closeIconButtons = document.querySelector(".modal-close-supplier")
const modalSupplier = document.getElementById("supplierModal")

function openModalSupplier() {
  if (modalSupplier) {
    modalSupplier.classList.add("show")
    document.body.style.overflow = "hidden"
  }
}

function closeModalSupplier() {
  if (modalSupplier) {
    modalSupplier.classList.remove("show")
    document.body.style.overflow = "auto"
  }
}

if (closeIconButtons) {
  closeIconButtons.addEventListener("click", closeModalSupplier)
}

async function editSupplier(id) {
  document.getElementById("supplierId").value = id
  openModalSupplier()
  try {
    const res = await fetch("/api/product/suppliers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      const item = data.suppiler.find((e) => e._id === id)
      document.getElementById("supplierName").value = item.name
      document.getElementById("supplierEmail").value = item.email
      document.getElementById("supplierContact").value = item.contact
      document.getElementById("supplierCompany").value = item.company
      document.getElementById("supplierAddress").value = item.address
    }
  } catch (error) {
    console.log(error)
  }
}

async function deleteSupplier(id) {
  try {
    const res = await fetch("/api/user/delete/suppiler", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      getInventryData()
    }
  } catch (error) {
    console.error("Category deletion error:", error)
  }
}

const supplierForm = document.getElementById("supplierForm")

document.getElementById("addSupplierBtn").addEventListener("click", async () => {
  openModalSupplier()
  supplierForm.reset()
})

document.getElementById("saveSupplierData").addEventListener("click", async () => {
  const id = document.getElementById("supplierId").value
  const name = document.getElementById("supplierName").value
  const email = document.getElementById("supplierEmail").value
  const contact = document.getElementById("supplierContact").value
  const company = document.getElementById("supplierCompany").value
  const address = document.getElementById("supplierAddress").value

  try {
    const res = await fetch(id ? `/api/user/update/suppiler/${id}` : "/api/user/create/suppiler", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, company, contact, address }),
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      console.log(data)
      successToast(data.message)
    } else {
      errorToast(data.message)
    }
  } catch (error) {
    console.error(error)
  }
})

document.getElementById("itemFormSubmit").addEventListener("click", async (e) => {
  e.preventDefault()

  const id = document.getElementById("itemSKU").value.trim()
  const name = document.getElementById("itemName").value.trim()
  const category = document.getElementById("itemCategory").value
  const supplier = document.getElementById("itemSupplier").value
  const quantity = document.getElementById("itemQuantity").value
  const price = document.getElementById("itemPrice").value
  const sellingPrice = document.getElementById("sellingPrice").value

  try {
    const url = id ? `/api/product/update/product/${id}` : "/api/product/add/product"
    const method = id ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, quantity, price, supplier, sellingPrice }),
      credentials: "include",
    })

    const data = await res.json()

    if (data.success) {
      getInventryData();
      successToast(data.message)
    } else {
      console.error("Failed to save product:", data.message)
      errorToast(data.message)
    }
  } catch (error) {
    console.error("Error submitting form:", error)
  }
})

async function deleteItem(id) {
  try {
    const res = await fetch("/api/product/delete/product", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      getInventryData();
      successToast(data.message)
    } else {
      errorToast(data.message)
    }
  } catch (error) {
    console.error("Category deletion error:", error)
  }
}

const modalTransaction = document.getElementById("transactionModal")
const closeIconTransaction = document.querySelector(".modal-close-transaction")

let products = []

async function fetchProducts() {
  try {
    const res = await fetch("/api/product/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      products = data.products
    }
  } catch (err) {
    console.error("Failed to load products", err)
  }
}

fetchProducts()

const input = document.getElementById("productName")
const skuInput = document.getElementById("transactionSku")
const suggestionList = document.getElementById("suggestionList")

input.addEventListener("input", () => {
  const query = input.value.toLowerCase()
  const matched = products.filter((p) => p.name.toLowerCase().includes(query))

  suggestionList.innerHTML = ""
  if (matched.length > 0) {
    suggestionList.style.display = "block"
    matched.forEach((product) => {
      const li = document.createElement("li")
      li.textContent = product.name
      li.onclick = () => {
        input.value = product.name
        skuInput.value = product.sku
        suggestionList.style.display = "none"
      }
      suggestionList.appendChild(li)
    })
  } else {
    suggestionList.style.display = "none"
  }
})

document.addEventListener("click", (e) => {
  if (!input.contains(e.target) && !suggestionList.contains(e.target)) {
    suggestionList.style.display = "none"
  }
})

document.getElementById("submitTransactionBtn").addEventListener("click", async (e) => {
  e.preventDefault()
  const productName = document.getElementById("productName").value
  const sku = document.getElementById("transactionSku").value
  const type = document.getElementById("transactionType").value
  const quantity = document.getElementById("transactionQuantity").value
  const costPrice = document.getElementById("transactionPrice").value
  const note = document.getElementById("transactionNote").value

  if (!productName || !sku || !type || !quantity || !costPrice) {
    alert("All fields except note are required!")
    return
  }

  if (isNaN(quantity) || quantity <= 0 || isNaN(costPrice) || costPrice <= 0) {
    alert("Please enter a valid quantity and cost price greater than 0")
    return
  }

  try {
    const res = await fetch("/api/product/add/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, sku, type, quantity, costPrice, note }),
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      console.log(data);
      successToast(data.message)

    } else {
      errorToast(data.message)

    }
  } catch (err) {
    console.error("Failed to add stock", err)
  }
})

const input2 = document.getElementById("saleProductName")
const skuInput2 = document.getElementById("saleSku")
const suggestionList2 = document.getElementById("saleSuggestionList")
const units = document.getElementById("units")

input2.addEventListener("input", () => {
  const query = input2.value.toLowerCase()
  const matched = products.filter((p) => p.name.toLowerCase().includes(query))

  suggestionList2.innerHTML = ""
  if (matched.length > 0) {
    suggestionList2.style.display = "block"
    matched.forEach((product) => {
      const li = document.createElement("li")
      li.textContent = product.name
      li.onclick = () => {
        input2.value = product.name
        skuInput2.value = product.sku
        units.value = product.quantity
        suggestionList2.style.display = "none"
      }
      suggestionList2.appendChild(li)
    })
  } else {
    suggestionList2.style.display = "none"
  }
})

document.addEventListener("click", (e) => {
  if (!input2.contains(e.target) && !suggestionList2.contains(e.target)) {
    suggestionList2.style.display = "none"
  }
})

document.getElementById("saleSubmitBtn").addEventListener("click", async (e) => {
  e.preventDefault()

  const productName = document.getElementById("saleProductName").value
  const sku = document.getElementById("saleSku").value
  const type = document.getElementById("saleType").value
  const quantity = document.getElementById("saleQuantity").value
  const costPrice = document.getElementById("salePrice").value
  const customerName = document.getElementById("saleCustomerName").value
  const customerContact = document.getElementById("saleCustomerContact").value
  const note = document.getElementById("saleNote").value
  const units = document.getElementById("units").value

  if (!productName || !sku || !type || !quantity || !costPrice || !customerName || !customerContact) {
    alert("All fields except note are required!")
    return
  }

  if (isNaN(quantity) || quantity <= 0 || isNaN(costPrice) || costPrice <= 0) {
    alert("Please enter a valid quantity and cost price greater than 0")
    return
  }

  if (Number.parseInt(quantity) >= Number.parseInt(units)) {
    alert("Quantity must be less than available stock units.")
    return
  }

  try {
    const res = await fetch("/api/product/sale/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        sellingPrice: costPrice,
        quantity,
        type,
        sku,
        note,
        customerName,
        customerContact,
      }),
      credentials: "include",
    })

    const data = await res.json()
    if (data.success) {

      successToast(data.message)

      document.getElementById("saleForm").reset()
      getInventryData()
    } else {
      errorToast(data.message)
      document.getElementById("saleForm").reset()
    }
  } catch (err) {
    console.error("Failed to add stock", err)
    alert("Something went wrong while recording the transaction.")
  }
})


async function getHistoryTransactions() {
  const tableData = document.getElementById("historyTable");
  try {
    const res = await fetch("/api/product/all/trancations", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    const data = await res.json();
    if (data.success) {
      data.transactions.forEach((e) => {
        const tableRow = document.createElement("tr")
        tableRow.className = "tableR"
        tableRow.innerHTML = `
                <td>${e.product?.sku}</td>
                <td>${new Date(e.date).toLocaleString()}</td>
                <td>${e.product?.name || "N/A"}</td>
                <td>${e.quantity}</td>
                <td>${e.type}</td>
                <td>₹ ${e.price}</td>
                <td>${e.customerName}</td>
               `;

        tableData.appendChild(tableRow);
      });

    }
  } catch (err) {
    console.error("Failed to load history", err)
  }
}

getHistoryTransactions();


async function fetchDashboardData() {
  try {
    const response = await fetch('/api/product/data');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

function renderStats(stats) {
  const container = document.getElementById('dashboardStats');
  container.innerHTML = `
    <div class="card"><h2>${stats.totalProducts ?? 0}</h2><p>Total Products</p></div>
    <div class="card"><h2>${stats.totalStock ?? 0}</h2><p>Total Stock</p></div>
    <div class="card"><h2>₹${stats.totalValue.toFixed(2) ?? 0}</h2><p>Total Value</p></div>
    <div class="card"><h2>${stats.lowStockCount ?? 0}</h2><p>Low Stock Items</p></div>
  `;
}

function createBarChart(products) {
  const ctx = document.getElementById('stockBarChart').getContext('2d');
  const names = products.map(p => p.name);
  const quantities = products.map(p => p.quantity);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'Lowest Stock Products',
        data: quantities,
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',  // Orange
          'rgba(255, 99, 132, 0.2)',  // Red
          'rgba(54, 162, 235, 0.2)',  // Blue
          'rgba(75, 192, 192, 0.2)',  // Green
          'rgba(153, 102, 255, 0.2)'  // Purple
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',    // Orange
          'rgba(255, 99, 132, 1)',    // Red
          'rgba(54, 162, 235, 1)',    // Blue
          'rgba(75, 192, 192, 1)',    // Green
          'rgba(153, 102, 255, 1)'    // Purple
        ],
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Quantity' } },
        x: { title: { display: true, text: 'Product Name' } }
      },
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Top 5 Products With Lowest Stock' }
      }
    }
  });
}

function createPieChart(categories) {
  const ctx = document.getElementById('categoryPieChart').getContext('2d');
  const labels = categories.map(c => c._id); // _id is already name
  const counts = categories.map(c => c.count);

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Product Categories',
        data: counts,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#8E44AD', '#2ECC71'
        ],
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Product Categories' },
        legend: { position: 'right' }
      }
    }
  });
}

function createLineChart(monthlyData) {
  const ctx = document.getElementById('stockTrendChart').getContext('2d');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const labels = monthlyData.map(d => monthNames[d._id - 1]);
  const values = monthlyData.map(d => d.value);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Stock Value ₹",
        data: values,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Monthly Stock Value Trend' },
        legend: { display: false }
      }
    }
  });
}

async function loadDashboard() {
  try {
    const data = await fetchDashboardData();
    renderStats(data.stats ?? {});
    createBarChart(data.lowStockProducts ?? []);
    createPieChart(data.categoryCounts ?? []);
    createLineChart(data.monthlyStockTrend ?? []);
  } catch {
    document.getElementById('dashboardStats').innerHTML = `
      <p style="color:red;">Failed to load dashboard data. Please try again later.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dashboardView')?.classList.contains('active')) {
    loadDashboard();
  }
});
document.getElementById("logoutBtn").addEventListener("click", async function () {

  try {
    const res = await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: "include"
    });
    const data = await res.json();
    if (data.success) {
      successToast(data.message)
      window.location.href = "authentication.html"
    }else{
      errorToast(data.message)
    }
  } catch (err) {
    console.error("Error on logout:", err);
  }

});


function removeExistingToast(id) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
}

function successToast(message) {
  removeExistingToast("success-toast");

  const toast = document.createElement("div");
  toast.className = "toast-base toast-success show";
  toast.id = "success-toast";

  const icon = document.createElement("div");
  icon.className = "toast-icon";
  icon.innerHTML = '<i class="fas fa-check"></i>';

  const msg = document.createElement("div");
  msg.className = "toast-message";
  msg.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(msg);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

function errorToast(message) {
  removeExistingToast("error-toast");

  const toast = document.createElement("div");
  toast.className = "toast-base toast-error show";
  toast.id = "error-toast";

  const icon = document.createElement("div");
  icon.className = "toast-icon";
  icon.innerHTML = '<i class="fas fa-times"></i>';

  const msg = document.createElement("div");
  msg.className = "toast-message";
  msg.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(msg);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}