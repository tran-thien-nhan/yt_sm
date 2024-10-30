import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { apiKey } from '../const'; // Make sure to import your API key
import { formatSummary } from '../helper'; // Add this import at the top of the file

const ExcelAnalyzer = ({ onDataAnalyzed, isDarkMode }) => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
        setIsLoading(true);
        const reader = new FileReader();

        reader.onload = (event) => {
            const bstr = event.target.result;
            let data;

            try {
                if (file.name.endsWith('.csv')) {
                    // Parse CSV
                    data = parseCSV(bstr);
                } else {
                    // Parse Excel
                    const workbook = read(bstr, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    data = utils.sheet_to_json(worksheet, { header: 1 });
                }

                // Perform basic analysis
                analyzeData(data).then(analysis => {
                    setAnalysisResult(analysis);
                    onDataAnalyzed(analysis);
                    setIsLoading(false);
                }).catch(error => {
                    console.error('Error analyzing data:', error);
                    setAnalysisResult({ error: 'Failed to analyze data. Please try again.' });
                    setIsLoading(false);
                });
            } catch (error) {
                console.error('Error parsing file:', error);
                setAnalysisResult({ error: 'Failed to parse file. Please check the file format and try again.' });
                setIsLoading(false);
            }
        };

        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            setAnalysisResult({ error: 'Failed to read file. Please try again.' });
            setIsLoading(false);
        };

        reader.readAsBinaryString(file);
    };

    const parseCSV = (str) => {
        const lines = str.split('\n');
        return lines.map(line => line.split(',').map(value => value.trim()));
    };

    const analyzeData = async (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return {
                error: 'Invalid or empty data. Please check your file and try again.'
            };
        }

        const headers = data[0];
        const rows = data.slice(1);

        // Basic analysis
        const columnCount = headers.length;
        const rowCount = rows.length;

        // Analyze each column
        const columnAnalysis = headers.map((header, index) => {
            const columnData = rows.map(row => row[index]);
            const dataType = getDataType(columnData);
            const uniqueValues = new Set(columnData).size;

            return {
                name: header,
                dataType,
                uniqueValues,
                nonEmptyCount: columnData.filter(val => val !== undefined && val !== null && val !== '').length
            };
        });

        // Prepare data for Gemini API
        const dataForAnalysis = {
            headers,
            rowCount,
            columnCount,
            columnAnalysis,
            sampleRows: rows
        };

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Phân tích dữ liệu Excel này và cung cấp thông tin chi tiết:
                                    ${JSON.stringify(dataForAnalysis, null, 2)}
                                    
                                    Vui lòng cung cấp cực kỳ chi tiết và cụ thể hết mức có thể, không giới hạn số chữ, trên 10000 chữ như 1 bảng báo cáo tổng hợp:
                                    1. Tóm tắt cấu trúc dữ liệu
                                    2. Đưa ra thật nhiều các quan sát chính về dữ liệu
                                    3. Đưa ra thật nhiều các mối tương quan hoặc mẫu tiềm năng
                                    4. Đề xuất cho phân tích hoặc trực quan hóa sâu hơn
                                    5. Đưa ra thật nhiều bất kỳ các điểm bất thường hoặc phát hiện thú vị nào
                                    6. Đánh giá dựa trên dữ liệu
                                    7. Dựa trên dữ liệu, đưa ra các giải pháp để giải quyết các vấn đề phát sinh bằng triz
                                    8. Đưa ra thật nhiều lời khuyên dựa trên dữ liệu
                                    
                                    Định dạng phản hồi của bạn bằng markdown.`
                                }
                            ]
                        }
                    ]
                }
            );

            const analysis = response.data.candidates[0]?.content?.parts[0]?.text;

            return {
                columnCount,
                rowCount,
                columnAnalysis,
                deepAnalysis: analysis
            };
        } catch (error) {
            console.error('Error analyzing data with Gemini:', error);
            return {
                columnCount,
                rowCount,
                columnAnalysis,
                error: 'Failed to perform deep analysis. Please try again.'
            };
        }
    };

    const getDataType = (values) => {
        const types = values.map(value => {
            if (typeof value === 'number') return 'number';
            if (!isNaN(Date.parse(value))) return 'date';
            return 'string';
        });

        const uniqueTypes = [...new Set(types)];
        return uniqueTypes.length === 1 ? uniqueTypes[0] : 'mixed';
    };

    return (
        <Box>
            <Button
                variant="contained"
                component="label"
                color={isDarkMode ? "secondary" : "primary"}
                disabled={isLoading}
            >
                {isLoading ? 'Đang xử lý...' : 'Tải lên tệp Excel hoặc CSV'}
                <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                />
            </Button>
            {isLoading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}
            {analysisResult && !isLoading && (
                <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="analysis-content"
                        id="analysis-header"
                    >
                        <Typography variant="h6">Kết quả phân tích</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {analysisResult.error ? (
                            <Typography color="error">{analysisResult.error}</Typography>
                        ) : (
                            <>
                                <Typography>Số cột: {analysisResult.columnCount}</Typography>
                                <Typography>Số hàng: {analysisResult.rowCount}</Typography>
                                <Typography variant="subtitle1" mt={1}>Chi tiết cột:</Typography>
                                {analysisResult.columnAnalysis && analysisResult.columnAnalysis.map((col, index) => (
                                    <Box key={index} ml={2} mt={1}>
                                        <Typography><strong>{col.name}</strong></Typography>
                                        <Typography>Loại: {col.dataType}</Typography>
                                        <Typography>Giá trị duy nhất: {col.uniqueValues}</Typography>
                                        <Typography>Giá trị không trống: {col.nonEmptyCount}</Typography>
                                    </Box>
                                ))}
                                {analysisResult.deepAnalysis && (
                                    <Box mt={2}>
                                        <Typography variant="h6">Phân tích sâu:</Typography>
                                        {formatSummary(analysisResult.deepAnalysis)}
                                    </Box>
                                )}
                            </>
                        )}
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    );
};

export default ExcelAnalyzer;
