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
        const files = Array.from(event.target.files);
        if (!files.length) return;

        setIsImporting(true);

        const parseFile = (file) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const parsed = Papa.parse(e.target.result, { header: true, dynamicTyping: true });
                const cleanRows = parsed.data.filter(row => row["Amount"] != null);
                resolve(cleanRows);
            };
            reader.readAsText(file);
        });

        Promise.all(files.map(parseFile)).then(results => {
            const merged = results.flat();
            setParsedData(merged);
            setShowPreview(true);
            setIsImporting(false);
        });
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
                multiple
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