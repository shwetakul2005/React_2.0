import React, { useRef } from "react";
import Papa from 'papaparse';
import { useState } from "react";
import PreviewModal from "./ImportPreview";

const TransactionImport = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [parsedData, setParsedData] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsImporting(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const parsed = Papa.parse(text, { header: true, dynamicTyping: true });
            // Filter out any empty trailing rows papaparse may produce
            const cleanRows = parsed.data.filter(row => row["Amount"] != null);
            setParsedData(cleanRows);
            setShowPreview(true);
            setIsImporting(false);
        };
        reader.readAsText(file);
    };

    const closePreview = () => {
        setShowPreview(false);
        setParsedData([]);
        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
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
            {showPreview && <PreviewModal data={parsedData} onClose={closePreview} />}
        </>
    );
}

export default TransactionImport;