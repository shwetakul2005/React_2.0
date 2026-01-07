import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "./ImportPreview.css"
import { useFinance } from "../../context/FinanceContext";

const PreviewModal = (props) => {
    const data = props.data;
    
    const [totSum, setTotSum] = useState(0);
    const [numOfExpenses, setNumOfExpenses] = useState(0);
    const [minDate, setMinDate] = useState("1997-01-01");
    const [maxDate, setMaxDate] = useState("1997-01-01");
    const {addBulkTransaction, categories, transactions} = useFinance();

    useEffect(() => {
        const dataTot = data.filter(row => row["Expense/Income"]==="Expense");
        // console.log(`here :${dataTot.length}`);
        const timestamps = data.map(item => 
            new Date(item.Date).getTime()
        );

        let minD =  new Date(Math.min(...timestamps));
        let maxD =  new Date(Math.max(...timestamps));

        const minD2 = Math.min(...timestamps);
        const maxD2 = Math.max(...timestamps);
        console.log(new Date(minD2));
        console.log(new Date(maxD2));
        setMinDate(minD);
        setMaxDate(maxD);

        const totalAmount = dataTot.reduce((sum, row) => {
        const value = parseFloat(row["Amount"]);
        return sum + (isNaN(value) ? 0 : value);
        }, 0);

        setTotSum(totalAmount);
        setNumOfExpenses(dataTot.length);
    }, [data]);

    const formatParsedData = (parsedData) => {
        return parsedData.map((item, index) => {
            const matchedCategory = categories.find(
                cat => cat.name === item["Category"]
            );
             
            const duplicate = transactions.some(tras => 
                tras.amount === Number(item["Amount"]) &&
                tras.description === item["Description"] &&
                tras.category_id === (matchedCategory ? matchedCategory.id : null) &&
                tras.date === item["Date"] &&
                tras.type === item["Expense/Income"].toLowerCase()
            );
            console.log(duplicate);
            if(duplicate){
                return ;
            }
            return{
                id: Date.now() + index,
                amount: Number(item["Amount"]),
                description: item["Description"],
                category_id: (matchedCategory ? matchedCategory.id : null),
                date: item["Date"],
                type: item["Expense/Income"].toLowerCase()
            }
        });
    };

    const formatMoney = (amount) => `₹${Number(amount).toLocaleString()}`;
    const newTransactionArray = formatParsedData(data).filter(Boolean);
    return(
        <div className="import-preview-container">
        <div className="header">
            {/* <h3>Import Transactions</h3> */}
            <h3>Preview: Found {data.length} transactions</h3>
        </div>
        <div className="Summary">
            <h4>Total amount in Expense: {formatMoney(totSum)}</h4>
            <h4>Number of Expenses: {numOfExpenses}</h4>
            <h4>Number of Incomes: {data.length - numOfExpenses}</h4>
            <h4>Date Range: {minDate.toLocaleString().split(",")[0]} to {maxDate.toLocaleString().split(",")[0]}</h4>
            <div className="preview-actions">
                <button onClick={() => addBulkTransaction(newTransactionArray)} className="import-btn">Confirm Import</button>
            </div>

        </div>
        </div>
    );
};



export default PreviewModal;