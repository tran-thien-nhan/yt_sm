import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, IconButton, CircularProgress } from '@mui/material';
import axios from 'axios';
import { apiKey } from './const';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportToExcel = ({ summary, isDarkMode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const exportToExcel = async () => {
        setIsLoading(true);
        try {
            if (!summary) {
                throw new Error('No summary provided');
            }

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Dựa trên đoạn tóm tắt sau, hãy tạo thật nhiều cặp câu hỏi và câu trả lời được lấy từ nội dung tóm tắt. Mỗi cặp phải được phân tách bằng ký tự "|||" và mỗi cặp nằm trên một đoạn riêng biệt (cách nhau bởi một dòng trống). Câu trả lời phải đầy đủ, chi tiết và có thể bao gồm nhiều dòng. Không thêm bất kỳ thông tin giải thích nào khác. Ví dụ về định dạng mong muốn:
Câu hỏi 1? ||| Câu trả lời 1 đầy đủ và chi tiết.
Có thể bao gồm nhiều dòng nếu cần thiết.

Câu hỏi 2? ||| Câu trả lời 2 đầy đủ và chi tiết.
Cũng có thể bao gồm nhiều dòng.

Đây là đoạn tóm tắt: "${summary}"`
                                }
                            ]
                        }
                    ]
                }
            );

            const generatedQA = response.data.candidates[0]?.content?.parts[0]?.text;

            if (!generatedQA) {
                throw new Error('No Q&A generated from the API');
            }

            // Tách các cặp câu hỏi và câu trả lời
            const qaArray = generatedQA.split('\n\n').map(pair => {
                const [question, answer] = pair.split('|||').map(item => item?.trim());
                if (!question || !answer) {
                    console.warn('Invalid Q&A pair:', pair);
                    return null;
                }
                return [question, answer.replace(/\n/g, ' ')]; // Replace newlines with spaces in answers
            }).filter(pair => pair !== null);

            if (qaArray.length === 0) {
                throw new Error('No valid Q&A pairs generated');
            }

            // Tạo một mảng 2D để chứa dữ liệu, bao gồm tiêu đề
            const data = [['Câu hỏi', 'Câu trả lời'], ...qaArray];

            const worksheet = XLSX.utils.aoa_to_sheet(data);

            // Đặt tiêu đề cho cột A và B
            XLSX.utils.sheet_add_aoa(worksheet, [['Câu hỏi', 'Câu trả lời']], { origin: 'A1' });

            // Tùy chỉnh độ rộng cột
            const wscols = [
                { wch: 50 },  // Độ rộng cột A
                { wch: 50 }   // Độ rộng cột B
            ];
            worksheet['!cols'] = wscols;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Interview Questions");

            XLSX.writeFile(workbook, "interview_questions.xlsx");
        } catch (error) {
            console.error('Error generating Q&A or exporting to Excel:', error);
            alert('Có lỗi xảy ra khi tạo câu hỏi và câu trả lời hoặc xuất file Excel. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={exportToExcel}
            disabled={isLoading}
            sx={{
                backgroundColor: isDarkMode ? '#4a4a4a' : '#1976d2',
                color: isDarkMode ? '#ffffff' : '#ffffff',
                '&:hover': {
                    backgroundColor: isDarkMode ? '#5a5a5a' : '#115293',
                },
            }}
        >
            {isLoading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                <>
                    <IconButton>
                        <FileDownloadIcon />
                    </IconButton>
                    Export To Excel To Insert To Anki
                </>
            )}
        </Button>
    );
};

export default ExportToExcel;
