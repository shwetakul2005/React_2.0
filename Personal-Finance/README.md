# PocketPal – Personal Finance Management Web Application

PocketPal is a React-based personal finance and budgeting web application designed to help users track income, expenses, and budgets in a simple and intuitive manner. The application focuses on usability for non-technical users and provides visual insights to support better monthly financial planning.

---

## Features

- Track income and expenses with full CRUD functionality
- Create and manage custom expense categories (fixed and variable)
- Interactive dashboard with financial insights
- Data visualization using charts
- Filters and search for dynamic data analysis
- Dark mode support
- Responsive design for multiple screen sizes
- Persistent data storage using browser LocalStorage

---

## Tech Stack

- **Frontend:** React.js, JavaScript (ES6/JSX)
- **State Management:** Context API, Custom React Hooks
- **Routing:** React Router
- **Data Visualization:** Recharts
- **Styling:** CSS / PostCSS
- **Storage:** LocalStorage

---

## Project Structure

Personal-Finance/

├── components/

│ ├── budget/

│ ├── categories/

│ ├── transactions/

│ ├── dashboard/

│ ├── insights/

│ ├── layout/

│ └── common/

├── context/

├── hooks/

├── pages/

├── utils/

├── App.jsx

├── main.jsx

└── index.css

---

## Custom Hooks

- **useTransactions** – Handles CRUD operations and filtering logic for transactions
- **useCategories** – Manages category creation, updates, deletion, and classification
- **useTheme** – Controls theme switching (light/dark mode)

---

## Data Persistence

All user data (transactions, categories, preferences) is stored using the browser’s LocalStorage, ensuring data remains available across sessions without requiring a backend.

---

## Codebase Statistics

- **Total Lines of Code:** 2,300+
- **Total Files:** 49
- **Languages Used:** JavaScript (JSX), CSS/PostCSS

---

## Target Users

PocketPal is designed primarily for homemakers and non-technical users who want an easy-to-use tool for tracking monthly expenses and planning budgets efficiently.

---

## Current Status

The project is actively under development. Planned enhancements include:
- Additional chart types and insights
- Improved validation and error handling
- Deployment to a hosting platform (Vercel/Netlify)

---

## Getting Started

1. Clone the repository  
git clone https://github.com/shwetakul2005/React_2.0.git

2. Navigate to the project directory  


3. Install dependencies  


4. Run the development server  


---

## Learning Outcomes

- Hands-on experience with React component architecture
- Effective use of Context API and custom hooks for state management
- Building reusable and scalable UI components
- Implementing real-world data visualization and filtering logic

---

## License

This project is for educational and personal use.
