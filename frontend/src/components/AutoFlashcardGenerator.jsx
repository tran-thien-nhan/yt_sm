import React, { useState } from 'react';
import { Button, TextField, Typography, Box, List, ListItem, Card, CardContent, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import { apiKey } from '../const';
import { CodeBlock, formatSummary } from '../helper'; // Import CodeBlock component

const AutoFlashcardGenerator = ({ summary, isDarkMode }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardCount, setCardCount] = useState(5);

    const generateFlashcards = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: `Tạo ${cardCount} flashcard dựa trên nội dung sau. Mỗi flashcard nên có một câu hỏi và một câu trả lời. Nếu câu trả lời chứa code, hãy đặt code vào một trường riêng biệt. Trả về kết quả dưới dạng mảng JSON, mỗi phần tử đại diện cho một flashcard với cấu trúc {"question": "Câu hỏi", "answer": "Câu trả lời", "code": "Đoạn code nếu có"}: ${summary}`
                        }]
                    }]
                }
            );

            console.log(response.data);

            const generatedContent = response.data.candidates[0]?.content?.parts[0]?.text;
            if (generatedContent) {
                // Remove markdown syntax and parse JSON
                const jsonString = generatedContent.replace(/```json\n|\n```/g, '').trim();
                const parsedFlashcards = JSON.parse(jsonString);
                setFlashcards(parsedFlashcards);
            } else {
                setError('Không thể tạo flashcards. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
            setError('Đã xảy ra lỗi khi tạo flashcards. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        if (flashcards.length === 0) {
            setError('Không có flashcard để xuất. Vui lòng tạo flashcard trước.');
            return;
        }

        // Thêm BOM (Byte Order Mark) để Excel nhận diện đúng encoding
        const BOM = '\uFEFF';
        const csvContent = BOM + flashcards.map(card => {
            const question = card.question.replace(/"/g, '""');
            const answer = card.answer.replace(/"/g, '""');
            const code = card.code ? card.code.replace(/"/g, '""') : '';
            return `"${question}","${answer}","${code}"`;
        }).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "flashcards.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Box sx={{ mt: 4, color: isDarkMode ? 'white' : 'black' }}>
            <Typography variant="h6" gutterBottom>Tạo Flashcards Tự Động</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    type="number"
                    label="Số lượng flashcard"
                    value={cardCount}
                    onChange={(e) => setCardCount(Math.max(1, parseInt(e.target.value) || 1))}
                    sx={{ mr: 2, input: { color: isDarkMode ? 'white' : 'black' } }}
                    InputLabelProps={{ style: { color: isDarkMode ? 'white' : 'black' } }}
                />
                <Button
                    variant="contained"
                    onClick={generateFlashcards}
                    disabled={isLoading}
                    sx={{ mr: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Tạo Flashcards'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={exportToCSV}
                    disabled={flashcards.length === 0}
                >
                    Xuất cho Anki
                </Button>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            {flashcards.length > 0 && (
                <List>
                    {flashcards.map((card, index) => (
                        <ListItem key={index} sx={{ mb: 2 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Câu hỏi:</Typography>
                                    <Typography variant="body1" paragraph>{formatSummary(card.question)}</Typography>
                                    <Typography variant="h6" gutterBottom>Trả lời:</Typography>
                                    <Typography variant="body1">{formatSummary(card.answer)}</Typography>
                                    {card.code && (
                                        <CodeBlock language="javascript">
                                            {card.code}
                                        </CodeBlock>
                                    )}
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default AutoFlashcardGenerator;