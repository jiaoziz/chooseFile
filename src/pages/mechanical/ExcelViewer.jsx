import React, { useEffect, useRef } from 'react';
import {XLSX} from 'xlsx';

const ExcelViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {

    if (containerRef.current) {
        fetch(API).then((res) => {
            res?.blob().then((r) => {
              const reader = new FileReader();
              //通过readAsArrayBuffer将blob转换为ArrayBuffer对
              reader.readAsArrayBuffer(r) // 这里的res.data是blob文件流
              reader.onload = (event) => {
                // 读取ArrayBuffer数据变成Uint8Array
                let data = new Uint8Array(event.target.result);
                // 这里的data里面的类型和后面的type类型要对应
                let workbook = XLSX.read(data, { type: "array" });
                XLSX.utils.set_work_book(workbook);
                let sheetNames = workbook.SheetNames; // 工作表名称
                XLSX.utils.set_sheet_names(sheetNames);
                XLSX.utils.set_select_sheet(sheetNames[0]);
                let worksheet = workbook.Sheets[sheetNames[0]];
                // var excelData = XLSX.utils.sheet_to_json(worksheet); //JSON
                let html = XLSX.utils.sheet_to_html(worksheet);
                containerRef.current.innerHTML = html;
              };
            })
          })
    }
    
    return () => {

    };
  }, []);

  return (
    <div style={{ width: '100%', height: '600px' }} ref={containerRef} />
  );
};

export default ExcelViewer;