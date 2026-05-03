// ============================================================
//  app.js  —  Business Logic for Restaurant Management System
//  Person 2 owns this file.
//  All functions return plain objects/arrays — UI rendering
//  is handled by Person 1's page scripts.
// ============================================================

// ─── CUSTOMERS ───────────────────────────────────────────────

const Customers = {
  getAll() {
    return DB.getAll("customers");
  },

  getById(id) {
    return DB.getById("customers", "customer_id", id);
  },

  add({ name, phone, email }) {
    if (!name || !phone || !email) throw new Error("All fields are required.");
    const exists = DB.getAll("customers").find(c => c.email === email);
    if (exists) throw new Error("A customer with this email already exists.");
    const record = {
      customer_id: DB.nextId("customers", "customer_id"),
      name, phone, email
    };
    return DB.insert("customers", record);
  },

  getLoyaltyTier(customer_id) {
    const orders = DB.getAll("orders").filter(o => o.customer_id === customer_id);
    const count = orders.length;
    if (count >= 5) return "Gold";
    if (count >= 2) return "Silver";
    return "Bronze";
  },

  getWithStats() {
    return Customers.getAll().map(c => ({
      ...c,
      total_orders: DB.getAll("orders").filter(o => o.customer_id === c.customer_id).length,
      loyalty_tier: Customers.getLoyaltyTier(c.customer_id),
    }));
  },

  search(query) {
    const q = query.toLowerCase();
    return Customers.getAll().filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  },
};

// ─── STAFF ───────────────────────────────────────────────────

const Staff = {
  getAll() {
    return DB.getAll("staff");
  },

  getById(id) {
    return DB.getById("staff", "staff_id", id);
  },

  add({ name, role, salary, phone }) {
    if (!name || !role || !salary || !phone) throw new Error("All fields are required.");
    const record = {
      staff_id: DB.nextId("staff", "staff_id"),
      name, role,
      salary: parseFloat(salary),
      phone,
    };
    return DB.insert("staff", record);
  },

  update(staff_id, changes) {
    return DB.update("staff", "staff_id", staff_id, changes);
  },

  getByRole(role) {
    return Staff.getAll().filter(s => s.role === role);
  },
};

// ─── MENU ────────────────────────────────────────────────────

const Menu = {
  getAll() {
    return DB.getAll("menu");
  },

  getById(id) {
    return DB.getById("menu", "item_id", id);
  },

  add({ item_name, category, price }) {
    if (!item_name || !category || !price) throw new Error("All fields are required.");
    if (price <= 0) throw new Error("Price must be greater than 0.");
    const record = {
      item_id: DB.nextId("menu", "item_id"),
      item_name, category,
      price: parseFloat(price),
    };
    return DB.insert("menu", record);
  },

  getByCategory() {
    const items = Menu.getAll();
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  },

  getCategories() {
    return [...new Set(Menu.getAll().map(i => i.category))];
  },

  getTopSelling(limit = 5) {
    const details = DB.getAll("order_details");
    const totals = {};
    details.forEach(d => {
      totals[d.item_id] = (totals[d.item_id] || 0) + d.quantity;
    });
    return Menu.getAll()
      .map(item => ({ ...item, units_sold: totals[item.item_id] || 0 }))
      .sort((a, b) => b.units_sold - a.units_sold)
      .slice(0, limit);
  },

  getNeverOrdered() {
    const orderedIds = new Set(DB.getAll("order_details").map(d => d.item_id));
    return Menu.getAll().filter(item => !orderedIds.has(item.item_id));
  },
};

// ─── ORDERS ──────────────────────────────────────────────────

const Orders = {
  getAll() {
    return DB.getAll("orders");
  },

  getById(id) {
    return DB.getById("orders", "order_id", id);
  },

  // Place a new order (atomicity: orders + order_details together)
  place({ customer_id, staff_id, order_type, items }) {
    // items = [{ item_id, quantity }, ...]
    if (!customer_id || !staff_id || !order_type || !items?.length)
      throw new Error("All order fields and at least one item are required.");

    const validTypes = ["Dine-In", "Takeaway", "Delivery"];
    if (!validTypes.includes(order_type))
      throw new Error(`Order type must be one of: ${validTypes.join(", ")}`);

    if (!Customers.getById(customer_id))  throw new Error("Invalid Customer ID.");
    if (!Staff.getById(staff_id))         throw new Error("Invalid Staff ID.");

    items.forEach(({ item_id, quantity }) => {
      if (!Menu.getById(item_id))         throw new Error(`Menu item ${item_id} not found.`);
      if (!quantity || quantity <= 0)     throw new Error("Quantity must be greater than 0.");
    });

    const order = DB.insert("orders", {
      order_id:    DB.nextId("orders", "order_id"),
      customer_id, staff_id,
      order_date:  new Date().toISOString(),
      order_type,
      status:      "Pending",
    });

    items.forEach(({ item_id, quantity }) => {
      DB.insert("order_details", {
        order_detail_id: DB.nextId("order_details", "order_detail_id"),
        order_id: order.order_id,
        item_id,
        quantity,
      });
    });

    return order;
  },

  updateStatus(order_id, status) {
    const validStatuses = ["Pending", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) throw new Error("Invalid status.");
    const order = Orders.getById(order_id);
    if (!order) throw new Error("Order not found.");
    if (order.status === "Completed") throw new Error("Cannot modify a completed order.");
    return DB.update("orders", "order_id", order_id, { status });
  },

  getDetails(order_id) {
    const order    = Orders.getById(order_id);
    if (!order) return null;
    const customer = Customers.getById(order.customer_id);
    const staff    = Staff.getById(order.staff_id);
    const lines    = DB.getAll("order_details")
      .filter(d => d.order_id === order_id)
      .map(d => {
        const item = Menu.getById(d.item_id);
        return { ...d, item_name: item?.item_name, price: item?.price, line_total: d.quantity * item?.price };
      });
    const total = lines.reduce((s, l) => s + l.line_total, 0);
    return { ...order, customer_name: customer?.name, staff_name: staff?.name, items: lines, total };
  },

  getFullList() {
    return Orders.getAll().map(o => {
      const customer = Customers.getById(o.customer_id);
      const staff    = Staff.getById(o.staff_id);
      const payment  = DB.getAll("payments").find(p => p.order_id === o.order_id);
      return {
        ...o,
        customer_name: customer?.name,
        staff_name:    staff?.name,
        amount:        payment?.amount || null,
        payment_mode:  payment?.payment_mode || "Unpaid",
      };
    });
  },

  filterByStatus(status) {
    return Orders.getFullList().filter(o => o.status === status);
  },

  filterByDate(dateStr) {
    return Orders.getFullList().filter(o => o.order_date.startsWith(dateStr));
  },
};

// ─── PAYMENTS ────────────────────────────────────────────────

const Payments = {
  getAll() {
    return DB.getAll("payments");
  },

  getByOrderId(order_id) {
    return DB.getAll("payments").find(p => p.order_id === order_id) || null;
  },

  process({ order_id, payment_mode }) {
    if (!order_id || !payment_mode) throw new Error("Order ID and payment mode are required.");

    const order = Orders.getById(order_id);
    if (!order)                           throw new Error("Order not found.");
    if (order.status === "Cancelled")     throw new Error("Cannot pay for a cancelled order.");
    if (Payments.getByOrderId(order_id))  throw new Error("Payment already exists for this order.");

    const details = Orders.getDetails(order_id);
    const amount  = details.total;

    const payment = DB.insert("payments", {
      payment_id:   DB.nextId("payments", "payment_id"),
      order_id,
      amount,
      payment_mode,
      payment_date: new Date().toISOString(),
    });

    DB.update("orders", "order_id", order_id, { status: "Completed" });
    return payment;
  },

  getRevenueByMode() {
    const payments = Payments.getAll();
    const result = {};
    payments.forEach(p => {
      result[p.payment_mode] = (result[p.payment_mode] || 0) + p.amount;
    });
    return Object.entries(result).map(([mode, revenue]) => ({ mode, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  },

  getTotalRevenue() {
    return Payments.getAll().reduce((s, p) => s + p.amount, 0);
  },

  getAverageOrderValue() {
    const payments = Payments.getAll();
    if (!payments.length) return 0;
    return Payments.getTotalRevenue() / payments.length;
  },
};

// ─── INVENTORY ───────────────────────────────────────────────

const Inventory = {
  getAll() {
    return DB.getAll("inventory");
  },

  getWithSupplier() {
    return Inventory.getAll().map(item => {
      const supplier = DB.getById("suppliers", "supplier_id", item.supplier_id);
      return { ...item, supplier_name: supplier?.name, supplier_contact: supplier?.contact };
    });
  },

  getLowStock(threshold = 40) {
    return Inventory.getWithSupplier().filter(i => i.quantity_available < threshold);
  },

  restock(ingredient_id, quantity) {
    const item = DB.getById("inventory", "ingredient_id", ingredient_id);
    if (!item) throw new Error("Ingredient not found.");
    const newQty = item.quantity_available + parseInt(quantity);
    return DB.update("inventory", "ingredient_id", ingredient_id, { quantity_available: newQty });
  },

  isStockSufficient(ingredient_id, required) {
    const item = DB.getById("inventory", "ingredient_id", ingredient_id);
    if (!item) return false;
    return item.quantity_available >= required;
  },
};

// ─── FEEDBACK ────────────────────────────────────────────────

const Feedback = {
  getAll() {
    return DB.getAll("feedback");
  },

  getWithCustomer() {
    return Feedback.getAll().map(f => {
      const customer = Customers.getById(f.customer_id);
      return { ...f, customer_name: customer?.name };
    });
  },

  add({ customer_id, order_id, rating, comments }) {
    if (!customer_id || !order_id || !rating) throw new Error("Customer, order, and rating are required.");
    if (rating < 1 || rating > 5)             throw new Error("Rating must be between 1 and 5.");
    if (!Customers.getById(customer_id))      throw new Error("Invalid Customer ID.");

    const record = {
      feedback_id:   DB.nextId("feedback", "feedback_id"),
      customer_id,
      order_id,
      rating:        parseInt(rating),
      comments:      comments || "",
      feedback_date: new Date().toISOString().split("T")[0],
    };
    return DB.insert("feedback", record);
  },

  getAverageRating() {
    const all = Feedback.getAll();
    if (!all.length) return 0;
    return (all.reduce((s, f) => s + f.rating, 0) / all.length).toFixed(2);
  },

  getSummaryByCustomer() {
    return Customers.getAll().map(c => {
      const reviews = Feedback.getAll().filter(f => f.customer_id === c.customer_id);
      const avg = reviews.length
        ? (reviews.reduce((s, f) => s + f.rating, 0) / reviews.length).toFixed(2)
        : "N/A";
      return { customer_name: c.name, total_reviews: reviews.length, avg_rating: avg };
    });
  },
};

// ─── REPORTS / ANALYTICS ────────────────────────────────────

const Reports = {
  getDashboardStats() {
    const orders   = Orders.getAll();
    const payments = Payments.getAll();
    const inventory = Inventory.getLowStock();

    return {
      total_orders:     orders.length,
      completed_orders: orders.filter(o => o.status === "Completed").length,
      pending_orders:   orders.filter(o => o.status === "Pending").length,
      total_revenue:    Payments.getTotalRevenue().toFixed(2),
      avg_order_value:  Payments.getAverageOrderValue().toFixed(2),
      low_stock_count:  inventory.length,
      avg_rating:       Feedback.getAverageRating(),
      total_customers:  Customers.getAll().length,
    };
  },

  getDailySales(dateStr) {
    // dateStr: "YYYY-MM-DD"
    const orders = Orders.filterByDate(dateStr);
    const total  = orders.reduce((s, o) => s + (o.amount || 0), 0);
    return { date: dateStr, orders, total_orders: orders.length, total_revenue: total };
  },

  getRevenueByPaymentMode() {
    return Payments.getRevenueByMode();
  },

  getTopSellingItems(limit = 5) {
    return Menu.getTopSelling(limit);
  },

  getCustomersAboveAverage() {
    const avg = Payments.getAverageOrderValue();
    return Orders.getFullList().filter(o => o.amount > avg);
  },

  getMonthlyRevenue() {
    const payments = Payments.getAll();
    const monthly = {};
    payments.forEach(p => {
      const month = p.payment_date.slice(0, 7); // "YYYY-MM"
      monthly[month] = (monthly[month] || 0) + p.amount;
    });
    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));
  },
};

// ─── UTILITY HELPERS ─────────────────────────────────────────

const Utils = {
  formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
  },

  formatDate(isoString) {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  },

  formatDateTime(isoString) {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  },

  statusBadgeClass(status) {
    return {
      Completed: "badge-success",
      Pending:   "badge-warning",
      Cancelled: "badge-danger",
    }[status] || "badge-secondary";
  },

  loyaltyBadgeClass(tier) {
    return { Gold: "badge-gold", Silver: "badge-silver", Bronze: "badge-bronze" }[tier] || "";
  },

  showToast(message, type = "success") {
    // Calls into the UI layer — Person 1 must provide a #toast element
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove("show"), 3000);
  },

  showError(message) { Utils.showToast(message, "error"); },
  showSuccess(message) { Utils.showToast(message, "success"); },
};
