import xlsx from 'xlsx/dist/xlsx.full.min';
export const useExport = () => {
    function excludeColumns(columnsArr, dataArr){
        let  exclude = new Set(columnsArr);
        return dataArr.map((item) => Object.fromEntries(
            Object.entries(item).filter(
                    e => !exclude.has(e[0])
                )
            )
        )
    }

    //execluded_column = ['col1_name', 'col2_name', ...]
    // dataArr = {
    //     sheet_name: 'string',
    //     sheet_tabs:[
    //         {
    //             data: 'array of objects',
    //             execluded_columns: 'array of strings',
    //             tab_name: 'string'
    //         }
    //     ]
    // }
    

    function exportExcel(dataObj) {
        const XLSX = xlsx;
        const workbook = XLSX.utils.book_new();
        for(let i = 0 ; i < dataObj.sheet_tabs.length; i++){
            let  worksheet = XLSX.utils.json_to_sheet(dataObj.sheet_tabs[i].data)
            // XLSX.utils.sheet_add_aoa(worksheet, [Object.keys(dataObj.sheet_tabs[i].data[0]).map(key=> key.replace('_', ' '))], { origin: "A1" });
            // let headers = [['Name', 'Job Title', 'Actual Hours', 'Overtime', 'Total Hours', 'qq','bb']]
            // XLSX.utils.sheet_add_aoa(worksheet, [['Name'], ['Job Title'], ['Actual Hours'], ['Overtime'], ['Total Hours'], ['qq'],['bb']], { origin: "A1" });
            worksheet = XLSX.utils.json_to_sheet(excludeColumns(dataObj.sheet_tabs[i].execluded_columns, dataObj.sheet_tabs[i].data), { origin: 'A2', skipHeader: true })
            XLSX.utils.sheet_add_aoa(worksheet, [Object.keys(dataObj.sheet_tabs[i].data[0]).map(key=> (key.replaceAll('_', ' ')[0].toUpperCase() + key.replaceAll('_', ' ').slice(1)).replace('No', 'No.'))], { origin: "A1" });
            const max_width = dataObj.sheet_tabs[i].data.reduce((w, r) => Math.max(w, r.name.length), 10);
            worksheet["!cols"] = [ { wch: max_width }, { wch: max_width }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 22 }];
            XLSX.utils.book_append_sheet(workbook, worksheet, dataObj.sheet_tabs[i].tab_name );
        }
        XLSX.writeFile(workbook, `${dataObj.sheet_name}.xlsx`);
    }
    return{
        excludeColumns,
        exportExcel,
    }
}