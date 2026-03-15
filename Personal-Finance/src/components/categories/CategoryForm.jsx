import React, { useState, useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import { useToast } from "../ui/Toast";
import './CategoryForm.css'

const CategoryForm = ({categoryToEdit, clearEdit}) => {
    const [budgetLimit, setBudgetLimit] = useState("")
    const [name, setName] = useState("")
    const [color, setColor] = useState()
    const [type, setType] = useState("variable")
    const [dueDate, setDueDate] = useState()
    const [isRecurring, setIsRecurring] = useState(false)

    const {addCategory, updateCategory} = useFinance();
    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault()
        // Validation
        if (budgetLimit < 0) {
            toast.error("Please enter a valid budgetLimit")
            return
        }
        
        if (!name) {
            toast.error("Please enter a category name")
            return
        }
        
        if (!color) {
            toast.error("Please select a color")
            return
        }

        if(type === "fixed" && !dueDate) {
            toast.error("Please enter a due date for Fixed Expenses")
            return
        }

                
        // Create transaction object
        const newCategory = {
            id: Date.now(),  // Generate unique ID
            budgetLimit: Number(budgetLimit),  // Convert string to number
            name,
            color,
            type,
            dueDate,
            isRecurring
        }
        
        // Add to context
        if(categoryToEdit) {
            const selectedCategory = {
                id: (categoryToEdit.id),
                budgetLimit: Number(budgetLimit),  // Convert string to number
                name,
                color,
                type,
                dueDate,
                isRecurring
            }
            updateCategory(categoryToEdit.id, selectedCategory);
            if (clearEdit) {
                clearEdit(); 
            }

            // Clear form
            setBudgetLimit("")
            setName("")
            setColor("")
            setType("variable")
            setDueDate("")
            setIsRecurring(false)
            
            toast.success("Category updated successfully!")
        }
        else{
            addCategory(newCategory)
            
            // Clear form
            setBudgetLimit("")
            setName("")
            setColor("")
            setType("variable")
            setDueDate("")
            setIsRecurring(false)
            
            toast.success("Category added successfully!")
        }
        
        
    }
    // const handleClick = (editingCategoryId) => {
    //     e.preventDefault();

    //     if(editingCategoryId === null) {
    //         return ;
    //     }
    //     else{
    //         editable_cat = categories.filter(t => t.id === editingCategoryId);
    //     }
    // }

    useEffect (() => {
      if(categoryToEdit) {
        //  let selected_cat = categories.filter(t => t.id === categoryToEdit);
        console.log(categoryToEdit)
        console.log(categoryToEdit.id);

        setName(categoryToEdit.name);
        setColor(categoryToEdit.color);
        setBudgetLimit(categoryToEdit.budgetLimit);
        setType(categoryToEdit.type);
        setDueDate(categoryToEdit.dueDate);
        setIsRecurring(categoryToEdit.isRecurring);
      }
   }, [categoryToEdit])

    function onChangeBudgetLimit(e) {
        setBudgetLimit(e.target.value);
    }

    function onChangeName(e) {
        setName(e.target.value);
    }
    function onChangeColor(e) {
        setColor(e.target.value);
    }
    function onChangeType(e){
        setType(e.target.value);
    }
    function onChangeDueDate(e){
        setDueDate(e.target.value);
    }
    function onChangeIsRecurring(e){
        setIsRecurring(e.target.value);
    }

    return(
        <form onSubmit={handleSubmit} 
        className="category-form" >
            <label>enter budgetLimit:
                <input
                    type="number"
                    value={budgetLimit}
                    onChange={onChangeBudgetLimit}
                /> 
            </label> 
            <div></div>
            <label>enter Name:
                <input
                    type="text"
                    value={name}
                    onChange={onChangeName}
                />  
            </label>
            <div></div>
            <label>enter color:    
                Colors:
                <select
                    value={color}
                    onChange={onChangeColor}
                    style={{ padding: '5px', borderRadius: '5px' }} // Style the main select box instead
                >
                    <option value="">Select category</option>
                    <option value="red">Red</option>
                    <option value="pink">pink</option>
                    <option value="green">green</option>
                    <option value="blue">blue</option>
                    <option value="orange">orange</option>
                    <option value="yellow">yellow</option>
                </select>
            </label>
            <div></div>
            <label>enter type:    
                Type:
                <select
                    value={type}
                    onChange={onChangeType}
                    style={{ padding: '5px', borderRadius: '5px' }} // Style the main select box instead
                >
                    <option value="variable">Variable</option>
                    <option value="fixed">Fixed</option>
                </select>
            </label>
           
            <div></div>
             <label>enter Due Date:
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </label>


            <div></div>
            <label>Is it recurring?   
                
                <select
                    value={isRecurring}
                    onChange={onChangeIsRecurring}
                    style={{ padding: '5px', borderRadius: '5px' }} // Style the main select box instead
                >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                </select>
            </label>
        
        <button type="submit">
            {(categoryToEdit === null) ? "Add Category" : "Update Category" }
        </button>
        
        </form >
    )
}

export default CategoryForm