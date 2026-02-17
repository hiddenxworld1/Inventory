document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("adminSidebar");
  const sidebarToggle = document.getElementById("adminSidebarToggle");
  const themeToggle = document.getElementById("adminThemeToggle");
  const pageTitle = document.getElementById("adminPageTitle");
  const navLinks = document.querySelectorAll(".nav-link");
  const views = document.querySelectorAll(".view");

  // Toggle sidebar collapse
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    const icon = sidebarToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-angle-double-left");
  });

  // Toggle theme
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");

    const icon = themeToggle.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  });

  // Handle view switching
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const viewName = link.getAttribute("data-view");

      views.forEach(view => view.classList.remove("active"));
      const targetView = document.getElementById(viewName + "View");
      if (targetView) targetView.classList.add("active");

      // Update page title
      pageTitle.textContent = viewName === "adminDashboard" ? "Dashboard" : "Employee Management ";

      // Load user list when switching to adminList view
      if (viewName === "adminList") {
        loadUserList();
      }
    });
  });
});

async function fetchDashboardData() {
  const response = await fetch('/api/admin/dashbord', {
    method: "GET",
    credentials: "include"
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.error('Error fetching dashboard data. Status:', response.status);
    window.location.href = "adminLogin.html"
  }
}

function renderStats(stats) {
  const container = document.getElementById('adminDashboardStats');
  container.innerHTML = `
    <div class="card"><h2>${stats.totalProducts ?? 0}</h2><p>Total Products</p></div>
    <div class="card"><h2>${stats.totalStock ?? 0}</h2><p>Total Stock</p></div>
    <div class="card"><h2>₹${(stats.totalValue ?? 0).toFixed(2)}</h2><p>Total Value</p></div>
    <div class="card"><h2>${stats.lowStockCount ?? 0}</h2><p>Low Stock Items</p></div>
  `;
}

function createBarChart(products) {
  const ctx = document.getElementById('adminStockBarChart').getContext('2d');
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
  const ctx = document.getElementById('adminCategoryPieChart').getContext('2d');
  const labels = categories.map(c => c._id);
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
  const ctx = document.getElementById('adminStockTrendChart').getContext('2d');
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
    document.getElementById('adminDashboardStats').innerHTML = `
      <p style="color:red;">Failed to load dashboard data. Please try again later.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('adminDashboardView')?.classList.contains('active')) {
    loadDashboard();
  }
});

document.getElementById("submitUserBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  try {
    const response = await fetch('/api/admin/create/user', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, role }),
      credentials: "include"
    });

    const data = await response.json();
    if (data.success) {

      successToast(data.message)
      document.getElementById("userForm").reset();
    }
    else {
      errorToast(data.message)

    }
  } catch (error) {
    console.log(error);

  }
})

// NEW FUNCTIONS FOR USER LIST - ONLY ADDITIONS, NO CHANGES TO EXISTING CODE

async function loadUserList() {
  try {
    const response = await fetch('/api/admin/user', {
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();

    if (data.success) {
      console.log(data);

      renderUserTable(data.user || []);
    } else {
      console.error('Error fetching users. Status:', response.status);
      document.getElementById('userTableBody').innerHTML = `
        <tr><td colspan="5" style="text-align: center; color: red; padding: 20px;">Failed to load user data</td></tr>`;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    document.getElementById('userTableBody').innerHTML = `
      <tr><td colspan="5" style="text-align: center; color: red; padding: 20px;">An error occurred while loading users</td></tr>`;
  }
}

function renderUserTable(users) {
  const tableBody = document.getElementById('userTableBody');

  if (users.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No users found</td></tr>`;
    return;
  }

  tableBody.innerHTML = users.map(user => `
    <tr style="border-bottom: 1px solid #dee2e6;">
      <td style="padding: 15px;">${user.name}</td>
      <td style="padding: 15px;">${user.email}</td>
      <td style="padding: 15px;">••••••••</td>
      <td style="padding: 15px;">${user.role}</td>
      <td style="padding: 15px;">
        <button onclick="deleteUser('${user._id || user.id}')" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin-right: 5px; cursor: pointer;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

async function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const response = await fetch(`/api/admin/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        successToast(data.message)
        loadUserList();
      } else {
        errorToast(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user");
    }
  }
}

document.getElementById("logoutBtn").addEventListener("click", async function () {

  try {
    const res = await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: "include"
    });
    const data = await res.json();
    if (data.success) {
      successToast(data.message);
      window.location.href = "adminLogin.html"
    }else{
      errorToast(data.message);
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