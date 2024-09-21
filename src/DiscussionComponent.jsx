import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Switch, Button, TextField, Modal, Box, Typography, Chip, IconButton } from '@mui/material';
import { useTheme } from './ThemeContext';

const DiscussionComponent = ({ summary, selectedText, isModalOpen, setIsModalOpen, setSelectedText, selectedKeyword, suggestedPrompts, selectedPromptForDiscussion, setSelectedPromptForDiscussion }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const [answerSuggestedPrompts, setAnswerSuggestedPrompts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTextPrompts, setSelectedTextPrompts] = useState([]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  useEffect(() => {
    const handleMouseUp = () => {
      handleTextSelection();
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedKeyword) {
      setCurrentQuestion(prevQuestion => `${prevQuestion} ${selectedKeyword}`);
    }
  }, [selectedKeyword]);

  useEffect(() => {
    if (selectedPromptForDiscussion) {
      setCurrentQuestion(selectedPromptForDiscussion);
    }
  }, [selectedPromptForDiscussion]);

  useEffect(() => {
    if (selectedText) {
      generateSelectedTextPrompts(selectedText);
    }
  }, [selectedText]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text && !isModalOpen) {
      setSelectedText(text);
      setIsModalOpen(true);
    }
  };

  const handleAskSelectedText = () => {
    setCurrentQuestion(selectedText);
    setIsModalOpen(false); // Đóng modal sau khi chọn "yes"
    handleAskQuestion();
  };

  const handleAskQuestion = async () => {
    if (!currentQuestion) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
        {
          contents: [
            {
              parts: [
                {
                  text: `Dựa trên nội dung tóm tắt sau: "${summary}"\n\nCâu hỏi: ${currentQuestion}\n\nTrả lời:`
                }
              ]
            }
          ]
        }
      );

      const generatedAnswer = response.data.candidates[0]?.content?.parts[0]?.text;
      if (generatedAnswer) {
        setQuestions(prevQuestions => [{ question: currentQuestion, answer: generatedAnswer }, ...prevQuestions]);
        setCurrentQuestion('');
        setCurrentPage(1); // Reset to first page when new question is added

        // Generate suggested prompts based on the answer
        generateAnswerSuggestedPrompts(generatedAnswer);
      } else {
        setQuestions(prevQuestions => [...prevQuestions, { question: currentQuestion, answer: 'Không thể tạo câu trả lời. Vui lòng thử lại.' }]);
      }
    } catch (error) {
      console.error('Error getting answer:', error);
      setQuestions(prevQuestions => [...prevQuestions, { question: currentQuestion, answer: 'Đã xảy ra lỗi khi lấy câu trả lời. Vui lòng thử lại.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnswerSuggestedPrompts = async (answer) => {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
        {
          contents: [
            {
              parts: [
                {
                  text: `Dựa trên câu trả lời sau, hãy đề xuất 10 câu hỏi hoặc prompt ngắn gọn và đa dạng để tìm hiểu thêm về nội dung. Các câu hỏi nên bao gồm cả câu hỏi đơn giản và phức tạp, từ chi tiết cụ thể đến ý tưởng tổng quát. Chỉ liệt kê các câu hỏi, mỗi câu một dòng: "${answer}"`
                }
              ]
            }
          ]
        }
      );
      const suggestions = response.data.candidates[0]?.content?.parts[0]?.text.split('\n').filter(s => s.trim());
      setAnswerSuggestedPrompts(suggestions || []);
    } catch (error) {
      console.error('Error generating answer suggested prompts:', error);
      setAnswerSuggestedPrompts([]);
    }
  };

  const generateSelectedTextPrompts = async (text) => {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
        {
          contents: [
            {
              parts: [
                {
                  text: `Dựa trên đoạn văn bản sau, hãy đề xuất 10 câu hỏi hoặc prompt ngắn gọn để tìm hiểu thêm về nội dung. Chỉ liệt kê các câu hỏi, mỗi câu một dòng: "${text}"`
                }
              ]
            }
          ]
        }
      );
      const suggestions = response.data.candidates[0]?.content?.parts[0]?.text.split('\n').filter(s => s.trim());
      setSelectedTextPrompts(suggestions || []);
    } catch (error) {
      console.error('Error generating selected text prompts:', error);
      setSelectedTextPrompts([]);
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
  };

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    setEditedQuestion(questions[index].question);
  };

  const handleSaveEdit = async (index) => {
    if (!editedQuestion) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
        {
          contents: [
            {
              parts: [
                {
                  text: `Dựa trên nội dung tóm tắt sau: "${summary}"\n\nCâu hỏi: ${editedQuestion}\n\nTrả lời:`
                }
              ]
            }
          ]
        }
      );

      const generatedAnswer = response.data.candidates[0]?.content?.parts[0]?.text;
      if (generatedAnswer) {
        setQuestions(prevQuestions => prevQuestions.map((item, i) =>
          i === index ? { question: editedQuestion, answer: generatedAnswer } : item
        ));
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error updating answer:', error);
      // Handle error
    } finally {
      setIsLoading(false);
      setEditingIndex(null);
      setEditedQuestion('');
    }
  };

  const handleViewAnswer = (index) => {
    setSelectedAnswerIndex(index);
  };

  const handleCloseAnswerModal = () => {
    setSelectedAnswerIndex(null);
  };

  const formatAnswer = (text) => {
    return text.split(/<code>|<\/code>/).map((part, index) => (
      index % 2 === 0 ? (
        <div key={index} dangerouslySetInnerHTML={{ __html: formatText(part) }} />
      ) : (
        <div key={index} className="relative mb-4">
          <SyntaxHighlighter
            language={detectLanguage(part)}
            style={tomorrow}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              margin: '0',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
            codeTagProps={{
              style: {
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }
            }}
          >
            {part.trim()}
          </SyntaxHighlighter>
        </div>
      )
    ));
  };

  const formatText = (text) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^(\d+\. .*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  };

  const detectLanguage = (code) => {
    if (code.includes('class') && code.includes('public') && code.includes('{')) {
      return 'java';
    } else if (code.includes('def') && code.includes(':')) {
      return 'python';
    } else if (code.includes('function') || code.includes('const') || code.includes('let')) {
      return 'javascript';
    }
    return 'text';
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyFeedback('Failed to copy');
    });
  };

  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (action === 'ask') {
        handleAskQuestion();
      } else if (action === 'edit') {
        handleSaveEdit(editingIndex);
      }
    }
  };

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      setIsModalOpen(false);
      setSelectedAnswerIndex(null);
    }
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePromptClick = (prompt) => {
    setCurrentQuestion(prompt);
    setIsModalOpen(false);
  };

  const handleAnswerPromptClick = (prompt) => {
    setCurrentQuestion(prompt);
    setSelectedAnswerIndex(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all questions?')) {
      setQuestions([]);
      setCurrentPage(1);
    }
  };

  const handleResetQuestion = () => {
    setCurrentQuestion('');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`mt-8 border-t pt-6 p-4 rounded-lg shadow-md ${themeClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Thảo luận</h2>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            color="primary"
          />
        </div>

        <TextField
          fullWidth
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, 'ask')}
          placeholder="Nhập câu hỏi của bạn"
          variant="outlined"
          margin="normal"
          InputProps={{
            style: { color: isDarkMode ? 'white' : 'inherit' },
            endAdornment: currentQuestion && (
              <Button onClick={handleResetQuestion}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isDarkMode ? 'white' : 'currentColor'}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </Button>
            ),
          }}
        />

        <div className="flex space-x-2 mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAskQuestion}
            disabled={isLoading || !currentQuestion}
            fullWidth
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt câu hỏi'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearAll}
            disabled={questions.length === 0}
          >
            Clear All
          </Button>
        </div>

        {/* Modal hiển thị câu trả lời */}
        <Modal
          open={selectedAnswerIndex !== null}
          onClose={handleCloseAnswerModal}
          aria-labelledby="answer-modal-title"
          aria-describedby="answer-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            color: isDarkMode ? 'white' : 'inherit',
          }}>
            <Typography id="answer-modal-title" variant="h6" component="h2" sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
              Câu trả lời
            </Typography>
            <div className="mb-4" style={{ color: isDarkMode ? 'white' : 'inherit' }}>
              {selectedAnswerIndex !== null && formatAnswer(questions[selectedAnswerIndex].answer)}
            </div>
            {answerSuggestedPrompts.length > 0 && (
              <div className="mt-4">
                <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : 'inherit' }}>Đề xuất câu hỏi tiếp theo:</Typography>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {answerSuggestedPrompts.map((prompt, index) => (
                    <Chip
                      key={index}
                      label={prompt}
                      onClick={() => handleAnswerPromptClick(prompt)}
                      color="primary"
                      variant="outlined"
                      clickable
                    />
                  ))}
                </div>
              </div>
            )}
            <Button onClick={handleCloseAnswerModal} sx={{ mt: 2, color: isDarkMode ? 'white' : 'inherit' }}>
              Đóng
            </Button>
          </Box>
        </Modal>

        {/* Modal for selected text and suggested prompts */}
        <Modal
          open={isModalOpen && selectedText}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="selected-text-modal-title"
          aria-describedby="selected-text-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            color: isDarkMode ? 'white' : 'inherit',
          }}>
            <Typography id="selected-text-modal-title" variant="h6" component="h2" sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
              Bạn có muốn đặt câu hỏi với nội dung đã chọn?
            </Typography>
            <Typography id="selected-text-modal-description" sx={{ mt: 2, color: isDarkMode ? 'white' : 'inherit' }}>
              <i>"{selectedText}"</i>
            </Typography>
            {selectedTextPrompts && selectedTextPrompts.length > 0 && (
              <div className="mt-4">
                <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : 'inherit' }}>Đề xuất prompt cho cụm từ được chọn:</Typography>
                <div className="flex flex-wrap gap-2">
                  {selectedTextPrompts.map((prompt, index) => (
                    <Chip
                      key={index}
                      label={prompt}
                      onClick={() => handlePromptClick(prompt)}
                      color="primary"
                      variant="outlined"
                      clickable
                    />
                  ))}
                </div>
              </div>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalOpen(false)} sx={{ mr: 2, color: isDarkMode ? 'white' : 'inherit' }}>
                No
              </Button>
              <Button
                onClick={() => {
                  setCurrentQuestion(selectedText);
                  handleAskSelectedText();
                }}
                variant="contained"
                sx={{ color: isDarkMode ? 'white' : 'inherit' }}
              >
                Yes
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Hiển thị danh sách câu hỏi và trả lời */}
        {currentQuestions.map((item, index) => (
          <Box key={index} sx={{ mt: 2, p: 2, bgcolor: isDarkMode ? 'grey.800' : 'grey.100', borderRadius: 1, color: isDarkMode ? 'white' : 'inherit' }}>
            {editingIndex === index ? (
              <div>
                <TextField
                  fullWidth
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'edit')}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    style: { color: isDarkMode ? 'white' : 'inherit' },
                  }}
                />
                <Button
                  onClick={() => handleSaveEdit(index)}
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  Lưu
                </Button>
                <Button
                  onClick={() => setEditingIndex(null)}
                  variant="contained"
                >
                  Hủy
                </Button>
              </div>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: isDarkMode ? 'white' : 'inherit' }}>
                  Câu hỏi: {item.question}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    onClick={() => handleViewAnswer(index)}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Xem câu trả lời
                  </Button>
                  <IconButton
                    onClick={() => handleEditQuestion(index)}
                    size="small"
                    sx={{ mr: 1, color: 'success.main' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteQuestion(index)}
                    size="small"
                    sx={{ color: 'error.main' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        ))}

        {/* Pagination */}
        {questions.length > questionsPerPage && (
          <div className="flex justify-center mt-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <span aria-hidden="true">&lsaquo;</span>
              </button>
              {[...Array(Math.ceil(questions.length / questionsPerPage)).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === number + 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {number + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <span aria-hidden="true">&rsaquo;</span>
              </button>
            </nav>
          </div>
        )}

        {copyFeedback && (
          <Box sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: 'success.main',
            color: 'white',
            py: 1,
            px: 2,
            borderRadius: 1,
          }}>
            {copyFeedback}
          </Box>
        )}
      </div>
    </ThemeProvider>
  );
};

export default DiscussionComponent;
