import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Select, MenuItem, FormControl, InputLabel, Grid, Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Modal, Box, Button, List, ListItem, ListItemText, Slider, Switch } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Hoặc chọn theme khác
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import DiscussionComponent from './DiscussionComponent';
import { Share } from '@mui/icons-material';
import QuizComponent from './QuizComponent'; // Add this import
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);

// Tạo một Accordion tùy chỉnh
const CustomAccordion = styled(Accordion)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
}));

const CustomAccordionSummary = styled(AccordionSummary)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100],
    '& .MuiAccordionSummary-content': {
        color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
    },
    '& .MuiSvgIcon-root': {
        color: isDarkMode ? theme.palette.common.white : theme.palette.text.secondary,
    },
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
}));

const StyledSelect = styled(Select)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300],
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? theme.palette.grey[600] : theme.palette.grey[400],
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
}));

const StyledMenuItem = styled(MenuItem)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
    '&:hover': {
        backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.action.hover,
    },
    '&.Mui-selected': {
        backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.action.selected,
    },
}));

const TextSummarizer = () => {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState('default');
    const [codeSections, setCodeSections] = useState([]);
    const [copyFeedback, setCopyFeedback] = useState('');
    const [inputExpanded, setInputExpanded] = useState(true);
    const [selectedText, setSelectedText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState('');
    const [summaryLength, setSummaryLength] = useState(100);
    const [suggestedPrompts, setSuggestedPrompts] = useState([]);
    const [selectedPromptForDiscussion, setSelectedPromptForDiscussion] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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
        Prism.highlightAll();
        document.addEventListener('mouseup', handleTextSelection);
        return () => {
            document.removeEventListener('mouseup', handleTextSelection);
        };
    }, []);

    const handleTextSelection = () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text) {
            setSelectedText(text);
            setIsModalOpen(true);
        }
    };

    const handleAskSelectedText = () => {
        // This function will be passed to DiscussionComponent
        setIsModalOpen(false);
    };

    const handleSummarize = async () => {
        if (!inputText) return;

        setIsLoading(true);
        setSummary('');
        setErrorMessage('');

        try {
            let promptText = '';
            
            if (selectedPrompt === 'specific') {
                promptText = `cụ thể hơn bằng tiếng việt: ${inputText}`;
            } else if (selectedPrompt === 'detailed') {
                promptText = `giải thích và hướng dẫn cụ thể hơn có ví dụ cụ thể, cực kỳ chi tiết và viết dài hơn bằng tiếng việt: ${inputText}`;
            } else if (selectedPrompt === 'summary') {
                promptText = `tóm tắt bằng tiếng việt: ${inputText}`;
            } else if (selectedPrompt === 'bullet') {
                promptText = `ngắn gọn, trong những gạch đầu dòng bằng tiếng việt\nno yapping: ${inputText}`;
            } else if (selectedPrompt === 'code') {
                promptText = `code cụ thể và giải thích bằng tiếng việt. Đặt mỗi đoạn code trong thẻ <code></code>: ${inputText}`;
            } else {
                promptText = `${selectedPrompt} trong khoảng ${summaryLength} từ: ${inputText}`;
            }

            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptText
                                }
                            ]
                        }
                    ]
                }
            );

            const generatedSummary = response.data.candidates[0]?.content?.parts[0]?.text;
            if (generatedSummary) {
                setSummary(generatedSummary);
                setInputExpanded(false); // Collapse the input section after summarization
                
                // Extract keywords from the Vietnamese summary
                const keywordPrompt = `Trích xuất 15 từ khóa quan trọng nhất từ văn bản sau, chỉ liệt kê các từ khóa, không giải thích: ${generatedSummary}`;
                const keywordResponse = await axios.post(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
                    {
                        contents: [{ parts: [{ text: keywordPrompt }] }]
                    }
                );
                const extractedKeywords = keywordResponse.data.candidates[0]?.content?.parts[0]?.text
                    .split(/[,\n]/)
                    .map(k => k.trim())
                    .filter(k => k.length > 0);
                setKeywords(extractedKeywords);

                if (selectedPrompt === 'code') {
                    const codeRegex = /<code>([\s\S]*?)<\/code>/g;
                    const matches = [...generatedSummary.matchAll(codeRegex)];
                    setCodeSections(matches.map(match => match[1]));
                } else {
                    setCodeSections([]);
                }

                // Generate quiz questions
                const quizPrompt = `Dựa vào tóm tắt sau, hãy tạo 5 câu hỏi trắc nghiệm với 4 lựa chọn (a,b,c,d) để kiểm tra kiến thức. Cung cấp câu trả lời đúng cho mỗi câu hỏi. Định dạng đầu ra như sau:
                [
                    {
                        "question": "Câu hỏi 1?",
                        "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
                        "correctAnswer": "Lựa chọn đúng"
                    }
                ] Tóm tắt: ${generatedSummary}`;
                
                try {
                    const quizResponse = await axios.post(
                        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
                        {
                            contents: [{ parts: [{ text: quizPrompt }] }]
                        }
                    );
                    const responseText = quizResponse.data.candidates[0]?.content?.parts[0]?.text;
                    
                    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        const quizData = JSON.parse(jsonMatch[0]);
                        setQuizQuestions(quizData);
                    } else {
                        console.error('No valid JSON found in the response');
                        setQuizQuestions([]);
                    }
                } catch (error) {
                    console.error('Error generating quiz questions:', error);
                    setQuizQuestions([]);
                }
            } else {
                setErrorMessage('No summary generated. Please check the input or try again.');
            }
        } catch (error) {
            console.error('Error summarizing text:', error.response || error.message);
            setErrorMessage('Error occurred while summarizing the text: ' + (error.response?.data?.error?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(summary).then(() => {
            setCopyFeedback('Copied!');
            setTimeout(() => setCopyFeedback(''), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            setCopyFeedback('Failed to copy');
        });
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopyFeedback('Code Copied!');
            setTimeout(() => setCopyFeedback(''), 2000);
        }, (err) => {
            console.error('Could not copy code: ', err);
            setCopyFeedback('Failed to copy code');
        });
    };

    const formatSummary = (text) => {
        if (selectedPrompt === 'code') {
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
                        <button
                            onClick={() => handleCopyCode(part)}
                            className="absolute top-2 right-2 p-1 rounded-md bg-green-500 hover:bg-green-600 text-white"
                            aria-label="copy code"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                        </button>
                    </div>
                )
            ));
        } else {
            return <div dangerouslySetInnerHTML={{ __html: formatText(text) }} />;
        }
    };

    const formatText = (text) => {
        // Convert markdown-like syntax to HTML
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
        return 'text'; // Mặc định nếu không phát hiện được ngôn ngữ cụ thể
    };

    const handleKeywordClick = (keyword) => {
        setSelectedKeyword(keyword);
        setIsKeywordModalOpen(false);
        // Update the discussion question with the selected keyword
        // You'll need to implement this part in your DiscussionComponent
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: 'Text Summary',
                text: summary,
                url: window.location.href,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const generateSuggestedPrompts = async () => {
        if (!summary) {
            console.error('No summary available');
            setSuggestedPrompts([]);
            return;
        }
        try {
            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Dựa trên đoạn văn bản sau, hãy đề xuất 10 câu hỏi hoặc prompt ngắn gọn để tìm hiểu thêm về nội dung. Chỉ liệt kê các câu hỏi, mỗi câu một dòng: "${summary}"`
                                }
                            ]
                        }
                    ]
                }
            );
            const suggestions = response.data.candidates[0]?.content?.parts[0]?.text.split('\n').filter(s => s.trim());
            setSuggestedPrompts(suggestions || []);
        } catch (error) {
            console.error('Error generating suggested prompts:', error);
            setSuggestedPrompts([]);
        }
    };

    const handleOpenQuizModal = () => {
        setIsQuizModalOpen(true);
    };

    const handleCloseQuizModal = () => {
        setIsQuizModalOpen(false);
    };

    const handleOpenPromptModal = () => {
        setIsPromptModalOpen(true);
    };

    const handleClosePromptModal = () => {
        setIsPromptModalOpen(false);
    };

    const handlePromptClick = (prompt) => {
        setSelectedPromptForDiscussion(prompt);
        setIsPromptModalOpen(false);
        // You can add additional logic here if needed
    };

    const handleGenerateSuggestedPrompts = () => {
        generateSuggestedPrompts();
        setIsPromptModalOpen(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={`min-h-screen ${themeClass}`}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <div className={`p-4 md:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Text Summarizer</h1>
                                <Switch
                                    checked={isDarkMode}
                                    onChange={toggleTheme}
                                    color="primary"
                                />
                            </div>
                            <CustomAccordion expanded={inputExpanded} onChange={() => setInputExpanded(!inputExpanded)} isDarkMode={isDarkMode}>
                                <CustomAccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="input-content"
                                    id="input-header"
                                    isDarkMode={isDarkMode}
                                >
                                    <Typography>Input Text and Options</Typography>
                                </CustomAccordionSummary>
                                <CustomAccordionDetails isDarkMode={isDarkMode}>
                                    <div className="mb-4 md:mb-6">
                                        <textarea
                                            className={`w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                isDarkMode 
                                                ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' 
                                                : 'bg-white text-black border-gray-300 placeholder-gray-500'
                                            }`}
                                            rows="6"
                                            placeholder="Enter your text to summarize"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-4 md:mb-6">
                                        <FormControl fullWidth>
                                            <InputLabel 
                                                id="summary-type-label" 
                                                className={isDarkMode ? 'text-white' : 'text-gray-700'}
                                            >
                                                Chọn kiểu tóm tắt
                                            </InputLabel>
                                            <StyledSelect
                                                labelId="summary-type-label"
                                                value={selectedPrompt}
                                                onChange={(e) => setSelectedPrompt(e.target.value)}
                                                isDarkMode={isDarkMode}
                                            >
                                                <StyledMenuItem value="default" isDarkMode={isDarkMode}>Mặc định</StyledMenuItem>
                                                <StyledMenuItem value="specific" isDarkMode={isDarkMode}>Cụ thể hơn</StyledMenuItem>
                                                <StyledMenuItem value="detailed" isDarkMode={isDarkMode}>Giải thích chi tiết</StyledMenuItem>
                                                <StyledMenuItem value="summary" isDarkMode={isDarkMode}>Tóm tắt ngắn gọn</StyledMenuItem>
                                                <StyledMenuItem value="bullet" isDarkMode={isDarkMode}>Gạch đầu dòng ngắn gọn</StyledMenuItem>
                                                <StyledMenuItem value="code" isDarkMode={isDarkMode}>Code cụ thể và giải thích</StyledMenuItem>
                                            </StyledSelect>
                                        </FormControl>
                                    </div>
                                    <div className="mb-4 md:mb-6">
                                        <Typography gutterBottom>Độ dài tóm tắt (số từ)</Typography>
                                        <Slider
                                            value={summaryLength}
                                            onChange={(e, newValue) => setSummaryLength(newValue)}
                                            aria-labelledby="summary-length-slider"
                                            valueLabelDisplay="auto"
                                            step={50}
                                            marks
                                            min={50}
                                            max={500}
                                        />
                                    </div>
                                    <button
                                        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                                            isLoading || !inputText
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                        onClick={handleSummarize}
                                        disabled={isLoading || !inputText}
                                    >
                                        {isLoading ? <CircularProgress size={24} className="text-white" /> : 'Summarize'}
                                    </button>
                                </CustomAccordionDetails>
                            </CustomAccordion>
                            <div className="mt-4 md:mt-6">
                                {keywords.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold mb-2">Keywords:</h3>
                                        <div className="flex space-x-2">
                                            <Button onClick={() => setIsKeywordModalOpen(true)}>
                                                View Keywords
                                            </Button>
                                            <Button onClick={handleGenerateSuggestedPrompts}>
                                                ĐỀ XUẤT PROMPTS
                                            </Button>
                                        </div>
                                        <Modal
                                            open={isKeywordModalOpen}
                                            onClose={() => setIsKeywordModalOpen(false)}
                                            aria-labelledby="keyword-modal-title"
                                            aria-describedby="keyword-modal-description"
                                        >
                                            <Box sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: 400,
                                                bgcolor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
                                                border: `2px solid ${isDarkMode ? theme.palette.grey[800] : theme.palette.grey[300]}`,
                                                boxShadow: 24,
                                                p: 4,
                                                color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
                                            }}>
                                                <Typography id="keyword-modal-title" variant="h6" component="h2" color="inherit">
                                                    Keywords
                                                </Typography>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {keywords.map((keyword, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={keyword}
                                                            onClick={() => handleKeywordClick(keyword)}
                                                            color={isDarkMode ? "default" : "primary"}
                                                            variant="outlined"
                                                            clickable
                                                            sx={{
                                                                color: isDarkMode ? theme.palette.common.white : theme.palette.primary.main,
                                                                borderColor: isDarkMode ? theme.palette.grey[700] : theme.palette.primary.main,
                                                                '&:hover': {
                                                                    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.primary.light,
                                                                },
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </Box>
                                        </Modal>
                                        <Modal
                                            open={isPromptModalOpen}
                                            onClose={handleClosePromptModal}
                                            aria-labelledby="prompt-modal-title"
                                            aria-describedby="prompt-modal-description"
                                        >
                                            <Box sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: 400,
                                                bgcolor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
                                                border: `2px solid ${isDarkMode ? theme.palette.grey[800] : theme.palette.grey[300]}`,
                                                boxShadow: 24,
                                                p: 4,
                                                color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
                                            }}>
                                                <Typography id="prompt-modal-title" variant="h6" component="h2" color="inherit">
                                                    Đề xuất Prompts
                                                </Typography>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {suggestedPrompts.map((prompt, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={prompt}
                                                            onClick={() => handlePromptClick(prompt)}
                                                            color={isDarkMode ? "default" : "primary"}
                                                            variant="outlined"
                                                            clickable
                                                            sx={{
                                                                color: isDarkMode ? theme.palette.common.white : theme.palette.primary.main,
                                                                borderColor: isDarkMode ? theme.palette.grey[700] : theme.palette.primary.main,
                                                                '&:hover': {
                                                                    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.primary.light,
                                                                },
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </Box>
                                        </Modal>
                                    </div>
                                )}
                                {summary && (
                                    <div className="relative">
                                        <div className={`w-full p-3 md:p-4 border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-black'} rounded-md`}>
                                            {formatSummary(summary)}
                                        </div>
                                        <div className="absolute top-2 right-2 flex">
                                            <button
                                                onClick={handleCopy}
                                                className="p-1 md:p-2 rounded-md bg-green-500 hover:bg-green-600 text-white mr-2"
                                                aria-label="copy"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleShare}
                                                className="p-1 md:p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                                                aria-label="share"
                                            >
                                                <Share className="h-4 w-4 md:h-5 md:w-5" />
                                            </button>
                                        </div>
                                        {copyFeedback && (
                                            <span className="absolute top-2 right-20 text-green-600 text-sm">{copyFeedback}</span>
                                        )}
                                    </div>
                                )}
                                {errorMessage && (
                                    <p className="text-red-600 mt-2 text-sm">{errorMessage}</p>
                                )}
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <div className="mt-4 lg:mt-0 lg:fixed lg:top-4 lg:right-4 lg:w-1/3">
                            {summary && (
                                <DiscussionComponent 
                                    summary={summary} 
                                    selectedText={selectedText}
                                    isModalOpen={isModalOpen}
                                    setIsModalOpen={setIsModalOpen}
                                    handleAskSelectedText={handleAskSelectedText}
                                    selectedKeyword={selectedKeyword}  // Pass the selected keyword to DiscussionComponent
                                    suggestedPrompts={suggestedPrompts}
                                    selectedPromptForDiscussion={selectedPromptForDiscussion}
                                    setSelectedPromptForDiscussion={setSelectedPromptForDiscussion}
                                    isDarkMode={isDarkMode} // Pass isDarkMode to DiscussionComponent
                                />
                            )}
                        </div>
                    </Grid>
                    <Modal
                        open={isQuizModalOpen}
                        onClose={handleCloseQuizModal}
                        aria-labelledby="quiz-modal-title"
                        aria-describedby="quiz-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '95%', // Tăng chiều rộng
                            maxWidth: 800, // Tăng chiều rộng tối đa
                            height: '90vh', // Sử dụng chiều cao cố định
                            maxHeight: '90vh',
                            overflow: 'auto',
                            bgcolor: 'background.paper',
                            borderRadius: 2, // Thêm bo góc
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <Typography id="quiz-modal-title" variant="h5" component="h2" gutterBottom>
                                Kiểm tra kiến thức
                            </Typography>
                            <Box sx={{ mb: 2, height: 'calc(100% - 100px)', overflow: 'auto' }}>
                                <QuizComponent 
                                    summary={summary}
                                    questions={quizQuestions}
                                />
                            </Box>
                            <Button 
                                onClick={handleCloseQuizModal} 
                                variant="contained" 
                                sx={{ mt: 2, position: 'sticky', bottom: 0 }}
                            >
                                Đóng
                            </Button>
                        </Box>
                    </Modal>
                </Grid>
            </div>
        </ThemeProvider>
    );
};

export default TextSummarizer;
