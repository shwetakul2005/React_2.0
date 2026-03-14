import {useState} from "react";
// import { useEffect } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import { useFinance } from "../context/FinanceContext";
import './Categories.css'; // Assuming you save the CSS above in Categories.css

const Categories = () => {
   const {categories, addCategories, updateCategory, deleteCategory} = useFinance();
   const [editcategory, setEditCategory] = useState(null);
   const [showAddForm, setShowAddForm] = useState(false);
   const formatMoney = (amount) => {
      if(amount === 0) return "NaN";
      return `₹${Number(amount).toLocaleString()}`};

   const handleEdit = (id) => {
      // Toggle: clicking the same card again closes the form
      setEditCategory(prev => (prev === id ? null : id));
      setShowAddForm(false); // close Add form if open
   }
   const clearEdit = () => {
      setEditCategory(null);
   }
   const categoryToEdit = categories.find(t => t.id === editcategory) || null;
   
    return (
      <div className='page_content'>
        <h1>All Categories</h1>  
         

        {/* <h3>Categories: </h3> */}
        
        {/* Apply the list container class */}
        <div className='category-card-list'> 
          {categories.map((category) => (
            // Apply the individual card class
            <div key={category.id} className='category-card'> 
              
              {/* Colored Circle - Apply color using inline style */}
              <div 
                className='category-indicator' 
                style={{ backgroundColor: category.color || '#ccc' }} 
              ></div>
              
              {/* Category Name and Budget */}
              <div className='category-details'>
                <h4>{category.name}</h4> {/* Category Name */}
                <p>{formatMoney(category.budgetLimit)}</p> {/* Budget Limit */}
              </div>

              {category.isRecurring && (
                  <div></div>
              )}

              
              {/* Buttons */}
              <div className='category-actions'>   
                 {/* 2. The Button toggles the state */}
                  <button 
                     className="edit-btn" 
                     onClick={() => handleEdit(category.id)}
                  >
                     {editcategory === category.id ? "Cancel" : "Edit"}
                  </button>
                  <button 
                  className="delete-btn" 
                  onClick={() => {
                        const isConfirmed = confirm(`Are you sure you want to delete ${category.name} category?`);
                        if (isConfirmed) {
                            // Only call the deletion function if the user clicked 'OK'
                            deleteCategory(category.id);
                        }
                     }}>Delete</button>
              </div>
            </div>
          ))}
         
        </div>
        {/* Edit form — shown below the card being edited */}
        {editcategory !== null && (
            <div className="form-wrapper">
               <CategoryForm categoryToEdit={categoryToEdit} clearEdit={clearEdit}/>
            </div>
         )}
      <button 
            className="add-btn" 
            onClick={() => { setShowAddForm(prev => !prev); setEditCategory(null); }}
         >
            {showAddForm ? "Cancel" : "+ Add New Category"}
      </button>
      {showAddForm && (
         <div className="form-wrapper">
            <CategoryForm categoryToEdit={null} clearEdit={() => setShowAddForm(false)}/>
         </div>
      )}
      </div>
    );
};
 
export default Categories;