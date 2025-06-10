const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outputDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 转换Excel文件到JSON的函数
function convertExcelToJson(filePath, outputFileName) {
    try {
        console.log(`正在处理文件: ${filePath}`);
        
        // 读取Excel文件
        const workbook = XLSX.readFile(filePath);
        const result = {};
        
        // 遍历所有工作表
        workbook.SheetNames.forEach(sheetName => {
            console.log(`处理工作表: ${sheetName}`);
            
            const worksheet = workbook.Sheets[sheetName];
            
            // 将工作表转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1, // 使用数组格式，第一行作为表头
                defval: null // 空单元格设为null
            });
            
            // 如果有数据，处理表头和数据
            if (jsonData.length > 0) {
                const headers = jsonData[0];
                const rows = jsonData.slice(1);
                
                // 转换为对象数组格式
                const formattedData = rows.map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        if (header) { // 只处理非空表头
                            obj[header] = row[index] || null;
                        }
                    });
                    return obj;
                });
                
                result[sheetName] = {
                    headers: headers.filter(h => h), // 移除空表头
                    data: formattedData,
                    totalRows: formattedData.length
                };
            }
        });
        
        // 保存JSON文件
        const outputPath = path.join(outputDir, outputFileName);
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
        
        console.log(`✅ 成功转换: ${outputFileName}`);
        console.log(`📊 数据统计:`);
        
        Object.keys(result).forEach(sheetName => {
            console.log(`   - ${sheetName}: ${result[sheetName].totalRows} 行数据`);
        });
        
        return result;
        
    } catch (error) {
        console.error(`❌ 转换失败 ${filePath}:`, error.message);
        return null;
    }
}

// 主函数
function main() {
    console.log('🚀 开始Excel到JSON转换...\n');
    
    const excelFiles = [
        {
            input: path.join(__dirname, '../public/accident data.xlsx'),
            output: 'accident-data.json'
        },
        {
            input: path.join(__dirname, '../public/zsl data.xlsx'),
            output: 'zsl-data.json'
        }
    ];
    
    const results = {};
    
    excelFiles.forEach(({ input, output }) => {
        if (fs.existsSync(input)) {
            const result = convertExcelToJson(input, output);
            if (result) {
                results[output] = result;
            }
        } else {
            console.warn(`⚠️  文件不存在: ${input}`);
        }
    });
    
    // 生成汇总信息
    const summaryPath = path.join(outputDir, 'data-summary.json');
    const summary = {
        convertedAt: new Date().toISOString(),
        files: Object.keys(results).map(filename => ({
            filename,
            sheets: Object.keys(results[filename]).length,
            totalRecords: Object.values(results[filename]).reduce((sum, sheet) => sum + sheet.totalRows, 0)
        }))
    };
    
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log('\n📋 转换完成汇总:');
    console.log(`   - 转换时间: ${summary.convertedAt}`);
    console.log(`   - 处理文件: ${summary.files.length} 个`);
    console.log(`   - 输出目录: ${outputDir}`);
    console.log('\n🎉 所有转换任务完成！');
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { convertExcelToJson };
