import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './Mechanical.scss'

const ExcelFileReader = () => {
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // 获取第一个工作表的数据
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      setFileContent(data);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="xlsxClass">
      <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
      {fileContent && (
        <table>
          <thead>
            <tr>{/* 根据实际数据结构渲染表头 */}</tr>
          </thead>
          <tbody>
            {fileContent.map((row, index) => (
              <tr key={index}>
                {/* 根据实际数据结构渲染表格行 */}
                {Object.values(row).map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelFileReader;