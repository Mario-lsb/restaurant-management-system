// ============================================================
//  data.js  —  Mock Database for Restaurant Management System
//  Person 2 owns this file.
//  Seed data is hardcoded; all runtime changes go to localStorage.
// ============================================================

const SEED = {
  customers: [
    { customer_id: 1, name: "Priya Sharma",   phone: "9876543210", email: "priya@email.com" },
    { customer_id: 2, name: "Arjun Mehta",    phone: "9123456780", email: "arjun@email.com" },
    { customer_id: 3, name: "Sneha Iyer",     phone: "9988776655", email: "sneha@email.com" },
    { customer_id: 4, name: "Rohit Verma",    phone: "9001122334", email: "rohit@email.com" },
    { customer_id: 5, name: "Kavya Nair",     phone: "9871234560", email: "kavya@email.com" },
  ],

  staff: [
    { staff_id: 1, name: "Ravi Kumar",    role: "Manager", salary: 45000, phone: "9000111222" },
    { staff_id: 2, name: "Anita Devi",    role: "Waiter",  salary: 18000, phone: "9000333444" },
    { staff_id: 3, name: "Suresh Raj",    role: "Chef",    salary: 30000, phone: "9000555666" },
    { staff_id: 4, name: "Meena Pillai",  role: "Waiter",  salary: 18000, phone: "9000777888" },
    { staff_id: 5, name: "Deepak Singh",  role: "Cashier", salary: 20000, phone: "9000999000" },
  ],

  menu: [
    { item_id: 1,  item_name: "Masala Dosa",       category: "Breakfast", price: 80  },
    { item_id: 2,  item_name: "Idli Sambar",        category: "Breakfast", price: 60  },
    { item_id: 3,  item_name: "Chicken Biryani",    category: "Main Course", price: 220 },
    { item_id: 4,  item_name: "Paneer Butter Masala",category: "Main Course", price: 180 },
    { item_id: 5,  item_name: "Dal Tadka",          category: "Main Course", price: 120 },
    { item_id: 6,  item_name: "Garlic Naan",        category: "Breads",    price: 40  },
    { item_id: 7,  item_name: "Mango Lassi",        category: "Beverages", price: 70  },
    { item_id: 8,  item_name: "Filter Coffee",      category: "Beverages", price: 30  },
    { item_id: 9,  item_name: "Gulab Jamun",        category: "Desserts",  price: 60  },
    { item_id: 10, item_name: "Rasmalai",           category: "Desserts",  price: 80  },
  ],

  orders: [
    { order_id: 1, customer_id: 1, staff_id: 2, order_date: "2024-09-01T12:30:00", order_type: "Dine-In",  status: "Completed" },
    { order_id: 2, customer_id: 2, staff_id: 4, order_date: "2024-09-01T13:00:00", order_type: "Takeaway", status: "Completed" },
    { order_id: 3, customer_id: 3, staff_id: 2, order_date: "2024-09-02T19:15:00", order_type: "Delivery", status: "Completed" },
    { order_id: 4, customer_id: 1, staff_id: 4, order_date: "2024-09-03T20:00:00", order_type: "Dine-In",  status: "Completed" },
    { order_id: 5, customer_id: 4, staff_id: 2, order_date: "2024-09-04T14:00:00", order_type: "Dine-In",  status: "Pending"   },
    { order_id: 6, customer_id: 2, staff_id: 4, order_date: "2024-09-04T18:30:00", order_type: "Delivery", status: "Pending"   },
    { order_id: 7, customer_id: 5, staff_id: 2, order_date: "2024-09-05T12:00:00", order_type: "Dine-In",  status: "Completed" },
    { order_id: 8, customer_id: 3, staff_id: 4, order_date: "2024-09-05T20:30:00", order_type: "Takeaway", status: "Completed" },
  ],

  order_details: [
    { order_detail_id: 1,  order_id: 1, item_id: 3,  quantity: 2 },
    { order_detail_id: 2,  order_id: 1, item_id: 6,  quantity: 3 },
    { order_detail_id: 3,  order_id: 1, item_id: 9,  quantity: 2 },
    { order_detail_id: 4,  order_id: 2, item_id: 1,  quantity: 1 },
    { order_detail_id: 5,  order_id: 2, item_id: 8,  quantity: 2 },
    { order_detail_id: 6,  order_id: 3, item_id: 4,  quantity: 1 },
    { order_detail_id: 7,  order_id: 3, item_id: 5,  quantity: 1 },
    { order_detail_id: 8,  order_id: 3, item_id: 7,  quantity: 2 },
    { order_detail_id: 9,  order_id: 4, item_id: 3,  quantity: 1 },
    { order_detail_id: 10, order_id: 4, item_id: 10, quantity: 2 },
    { order_detail_id: 11, order_id: 5, item_id: 2,  quantity: 3 },
    { order_detail_id: 12, order_id: 6, item_id: 4,  quantity: 2 },
    { order_detail_id: 13, order_id: 6, item_id: 6,  quantity: 4 },
    { order_detail_id: 14, order_id: 7, item_id: 3,  quantity: 2 },
    { order_detail_id: 15, order_id: 7, item_id: 9,  quantity: 1 },
    { order_detail_id: 16, order_id: 8, item_id: 5,  quantity: 1 },
    { order_detail_id: 17, order_id: 8, item_id: 8,  quantity: 2 },
  ],

  payments: [
    { payment_id: 1, order_id: 1, amount: 640.00, payment_mode: "UPI",   payment_date: "2024-09-01T12:55:00" },
    { payment_id: 2, order_id: 2, amount: 140.00, payment_mode: "Cash",  payment_date: "2024-09-01T13:20:00" },
    { payment_id: 3, order_id: 3, amount: 500.00, payment_mode: "Card",  payment_date: "2024-09-02T19:45:00" },
    { payment_id: 4, order_id: 4, amount: 380.00, payment_mode: "UPI",   payment_date: "2024-09-03T20:30:00" },
    { payment_id: 5, order_id: 7, amount: 500.00, payment_mode: "Online",payment_date: "2024-09-05T12:30:00" },
    { payment_id: 6, order_id: 8, amount: 180.00, payment_mode: "Cash",  payment_date: "2024-09-05T20:50:00" },
  ],

  inventory: [
    { ingredient_id: 1, ingredient_name: "Rice",        quantity_available: 80,  unit: "kg",  supplier_id: 1 },
    { ingredient_id: 2, ingredient_name: "Paneer",      quantity_available: 25,  unit: "kg",  supplier_id: 2 },
    { ingredient_id: 3, ingredient_name: "Chicken",     quantity_available: 35,  unit: "kg",  supplier_id: 3 },
    { ingredient_id: 4, ingredient_name: "Tomatoes",    quantity_available: 15,  unit: "kg",  supplier_id: 1 },
    { ingredient_id: 5, ingredient_name: "Onions",      quantity_available: 60,  unit: "kg",  supplier_id: 1 },
    { ingredient_id: 6, ingredient_name: "Cooking Oil", quantity_available: 20,  unit: "litre",supplier_id: 2 },
    { ingredient_id: 7, ingredient_name: "Milk",        quantity_available: 10,  unit: "litre",supplier_id: 3 },
    { ingredient_id: 8, ingredient_name: "Flour",       quantity_available: 55,  unit: "kg",  supplier_id: 2 },
    { ingredient_id: 9, ingredient_name: "Sugar",       quantity_available: 30,  unit: "kg",  supplier_id: 1 },
    { ingredient_id: 10,ingredient_name: "Spices Mix",  quantity_available: 8,   unit: "kg",  supplier_id: 3 },
  ],

  suppliers: [
    { supplier_id: 1, name: "Fresh Farms Co.",    contact: "9811122233", city: "Chennai"   },
    { supplier_id: 2, name: "Daily Dairy Ltd.",   contact: "9822233344", city: "Bangalore" },
    { supplier_id: 3, name: "Meat & More Pvt.",   contact: "9833344455", city: "Chennai"   },
  ],

  feedback: [
    { feedback_id: 1, customer_id: 1, order_id: 1, rating: 5, comments: "Excellent biryani!",        feedback_date: "2024-09-01" },
    { feedback_id: 2, customer_id: 2, order_id: 2, rating: 4, comments: "Good food, quick service.", feedback_date: "2024-09-01" },
    { feedback_id: 3, customer_id: 3, order_id: 3, rating: 3, comments: "Delivery was a bit late.",  feedback_date: "2024-09-02" },
    { feedback_id: 4, customer_id: 5, order_id: 7, rating: 5, comments: "Will definitely come back!",feedback_date: "2024-09-05" },
  ],
};

// ============================================================
//  DB  —  localStorage-backed live store
// ============================================================
const DB = (() => {
  const KEYS = Object.keys(SEED);

  // Initialise: load from localStorage or fall back to seed
  function init() {
    KEYS.forEach(table => {
      if (!localStorage.getItem(`rms_${table}`)) {
        localStorage.setItem(`rms_${table}`, JSON.stringify(SEED[table]));
      }
    });
  }

  function getTable(table) {
    return JSON.parse(localStorage.getItem(`rms_${table}`)) || [];
  }

  function saveTable(table, data) {
    localStorage.setItem(`rms_${table}`, JSON.stringify(data));
  }

  function getAll(table)       { return getTable(table); }

  function getById(table, idField, id) {
    return getTable(table).find(r => r[idField] === id) || null;
  }

  function insert(table, record) {
    const rows = getTable(table);
    rows.push(record);
    saveTable(table, rows);
    return record;
  }

  function update(table, idField, id, changes) {
    const rows = getTable(table).map(r =>
      r[idField] === id ? { ...r, ...changes } : r
    );
    saveTable(table, rows);
    return rows.find(r => r[idField] === id);
  }

  function remove(table, idField, id) {
    const rows = getTable(table).filter(r => r[idField] !== id);
    saveTable(table, rows);
  }

  function nextId(table, idField) {
    const rows = getTable(table);
    return rows.length ? Math.max(...rows.map(r => r[idField])) + 1 : 1;
  }

  // Reset everything back to seed data
  function reset() {
    KEYS.forEach(table => {
      localStorage.setItem(`rms_${table}`, JSON.stringify(SEED[table]));
    });
    console.log("DB reset to seed data.");
  }

  init();
  return { getAll, getById, insert, update, remove, nextId, reset };
})();
