# 🍽️ Restaurant Management System



## 🌐 Live Demo
> https://<your-username>.github.io/restaurant-management-system

---

## 📁 Project Structure

```
restaurant-management-system/
│
├── index.html          → Dashboard (Person 1)
├── customers.html      → Customer Management (Person 1)
├── menu.html           → Menu Items (Person 1)
├── orders.html         → Orders (Person 1)
├── inventory.html      → Inventory & Suppliers (Person 1)
│
├── payments.html       → Billing & Payments (Person 2 ✅)
├── staff.html          → Staff Management (Person 2 ✅)
├── feedback.html       → Customer Feedback (Person 2 ✅)
├── reports.html        → Reports & Analytics (Person 2 ✅)
│
├── css/
│   └── styles.css      → Shared styles (Person 1 owns)
│
└── js/
    ├── data.js         → Mock database + localStorage (Person 2 ✅)
    └── app.js          → Business logic (Person 2 ✅)
```

---

## 🧑‍💻 Work Division

| Area | Person | Files |
|---|---|---|
| UI/UX, Layout, Design | Person 1 (Navya) | `index.html`, `customers.html`, `menu.html`, `orders.html`, `inventory.html`, `css/styles.css` |
| Data, Logic, Backend | Person 2 (Aditi) | `js/data.js`, `js/app.js`, `payments.html`, `staff.html`, `feedback.html`, `reports.html` |

---

## 🚀 Getting Started

### Clone the repo
```bash
git clone https://github.com/<your-username>/restaurant-management-system.git
cd restaurant-management-system
```

### Run locally
Simply open `index.html` in your browser — no server needed!
Or use VS Code Live Server for hot reload.

### Branch strategy
```
main              ← final merged code + deployment
frontend-ui       ← Person 1 works here
backend-logic     ← Person 2 works here
```

---

## 🛠️ Tech Stack
- HTML5 + CSS3 + Vanilla JavaScript
- Chart.js (analytics charts)
- localStorage (data persistence)
- GitHub Pages (deployment)

---

## 📦 How Data Works

All data starts as hardcoded seed data in `js/data.js`.
On first load, it's written to `localStorage`. All adds/updates persist across page reloads.

To reset data back to seed: open browser console and run:
```js
DB.reset(); location.reload();
```

---

## 🔌 API Reference (for Person 1)

Person 1's pages can use these objects directly — just include `data.js` and `app.js`:

| Object | Key Methods |
|---|---|
| `Customers` | `.getAll()`, `.add({name,phone,email})`, `.getLoyaltyTier(id)`, `.search(query)` |
| `Menu` | `.getAll()`, `.add({item_name,category,price})`, `.getByCategory()` |
| `Orders` | `.getAll()`, `.place({customer_id,staff_id,order_type,items})`, `.getDetails(id)`, `.updateStatus(id,status)` |
| `Payments` | `.getAll()`, `.process({order_id,payment_mode})` |
| `Inventory` | `.getAll()`, `.getLowStock()`, `.restock(id, qty)` |
| `Staff` | `.getAll()`, `.add({name,role,salary,phone})` |
| `Feedback` | `.getAll()`, `.add({customer_id,order_id,rating,comments})` |
| `Reports` | `.getDashboardStats()`, `.getDailySales(date)`, `.getTopSellingItems()` |
| `Utils` | `.formatCurrency(n)`, `.formatDate(iso)`, `.showSuccess(msg)`, `.showError(msg)` |
