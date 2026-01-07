import React, { useRef } from "react";
import Papa from 'papaparse';
import { useEffect, useState } from "react";
import PreviewModal from "./ImportPreview";
import { useFinance } from "../../context/FinanceContext";

const TransactionImport = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [parsedData, setParsedData] = useState([]);
    const fileInputRef = useRef(null);
    const {addBulkTransaction, categories, transactions} = useFinance();
    
    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (!file) return
        
        // Read and parse file here

        setIsImporting(true);

        const reader = new FileReader();

        reader.onload = (e) => {
        const text = e.target.result;
        const parsed = Papa.parse(text, { header: true , dynamicTyping: true});

        setParsedData(parsed.data);
        setShowPreview(true);
        setIsImporting(false);
        };
        reader.readAsText(file);
    };

    useEffect(() => {
    console.log("Parsed data updated:", parsedData);
    console.log("---");
    console.log(parsedData.length);
  }, [parsedData]);

    return(
        <>
        <input 
            type="file" 
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
        />
        <button onClick={() => fileInputRef.current.click()} className="add-btn">
            Import from CSV
        </button>
        {isImporting && <div>Loading...</div>}
        {/* {showPreview && <div>Preview of the Uploaded file.</div>} */}
        {showPreview && <PreviewModal data={parsedData} />}
        {/* {showPreview && <button onClick={() => addBulkTransaction(newTransactionArray)} className="add-btn">Bulk Import Transactions</button>} */}
        {/* {showPreview && (setShowPreview(false))} */}
        {/* <button onClick={() => chk("hi")}>Bulk Import Transactions</button> */}
        </>
    );
}

export default TransactionImport;