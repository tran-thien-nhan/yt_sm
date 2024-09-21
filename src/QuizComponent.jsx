import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Button,
    Paper,
    CircularProgress,
    createTheme,
} from '@mui/material';

const QuizChatComponent = ({ summary, questions: initialQuestions }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        if (summary && initialQuestions.length > 0) {
            setQuestions(initialQuestions);
            setChatHistory([formatQuestion(initialQuestions[0], 0)]);
            setIsLoading(false);
            setCurrentQuestionIndex(0);
        } else {
            setIsLoading(true);
        }
    }, [summary, initialQuestions]);

    const formatQuestion = (question, index) => ({
        message: (
            <div>
                <Typography variant="h6" gutterBottom>
                    {question.question}
                </Typography>
                <div>
                    {question.options.map((option, optionIndex) => (
                        <div
                            key={optionIndex}
                            onClick={() => handleAnswerSelect(index, String.fromCharCode(97 + optionIndex))}
                            className={`p-2 mb-2 rounded cursor-pointer ${
                                selectedAnswers[index] === String.fromCharCode(97 + optionIndex)
                                    ? 'bg-blue-500 text-white' // Highlight khi được chọn
                                    : 'bg-gray-100 hover:bg-gray-200' // Không chọn thì giữ màu nền nhạt
                            }`}
                        >
                            <Typography>
                                {String.fromCharCode(97 + optionIndex)}. {option}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        ),
        sender: 'bot'
    });

    const handleAnswerSelect = (questionIndex, answer) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: answer,
        }));
    };

    const handleSendAnswer = async () => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswer = selectedAnswers[currentQuestionIndex];

        if (!selectedAnswer) return;
        setIsLoading(true);

        try {
            const prompt = `Câu hỏi: "${currentQuestion.question}"
Các lựa chọn: ${currentQuestion.options.map((option, index) => `${String.fromCharCode(97 + index)}. ${option}`).join(', ')}
Câu trả lời của người dùng: "${selectedAnswer}. ${currentQuestion.options[selectedAnswer.charCodeAt(0) - 97]}"
kèm giải thích ngắn gọn và đưa ra đáp án đúng"`;

            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY',
                { contents: [{ parts: [{ text: prompt }] }] }
            );

            const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text;
            const formattedResponse = formatAIResponse(aiResponse);

            setChatHistory(prev => [
                ...prev,
                { 
                    message: (
                        <Typography>
                            <strong className="text-blue-600">Bạn:</strong>{' '}
                            <span className="font-semibold">{selectedAnswer}. {currentQuestion.options[selectedAnswer.charCodeAt(0) - 97]}</span>
                        </Typography>
                    ), 
                    sender: 'user' 
                },
                {
                    message: (
                        <Typography>
                            <strong className="text-green-600">Bot:</strong>{' '}
                            <div dangerouslySetInnerHTML={{ __html: formattedResponse }} />
                        </Typography>
                    ),
                    sender: 'bot'
                }
            ]);

            setIsLoading(false);
        } catch (error) {
            console.error("Error checking answer:", error);
            setError("Có lỗi xảy ra khi kiểm tra câu trả lời. Vui lòng thử lại.");
            setIsLoading(false);
        }
    };

    const formatAIResponse = (text) => {
        return text
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
            .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
            .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
            .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
            .replace(/\n/gim, '<br>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">$1</code>');
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setChatHistory(prev => [...prev, formatQuestion(questions[currentQuestionIndex + 1], currentQuestionIndex + 1)]);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <Paper elevation={3} className="p-6 mt-6">
            <Typography variant="h5" className="mb-4">Kiểm tra kiến thức</Typography>
            {isLoading || questions.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <CircularProgress />
                </div>
            ) : error ? (
                <div className="text-center">
                    <Typography color="error" className="mb-4">{error}</Typography>
                </div>
            ) : (
                <>
                    <div className="chat-history mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`mb-2 ${chat.sender === 'user' ? 'text-right' : ''}`}>
                                {chat.message}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button
                            variant="contained"
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Quay lại
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendAnswer}
                            disabled={!selectedAnswers[currentQuestionIndex]}
                        >
                            Gửi câu trả lời
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === questions.length - 1}
                        >
                            Câu tiếp theo
                        </Button>
                    </div>
                </>
            )}
        </Paper>
    );
};

export default QuizChatComponent;
