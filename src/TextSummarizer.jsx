import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Select, MenuItem, FormControl, InputLabel, Grid, Accordion, AccordionSummary, AccordionDetails, Typography, Chip, List, ListItem, ListItemText, Slider, Switch, Link, Fab, IconButton, Box, Modal, Divider, ListItemIcon, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Prism from 'prismjs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import 'prismjs/themes/prism-tomorrow.css'; // Hoặc chọn theme khác
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DiscussionComponent from './DiscussionComponent';
import { Share } from '@mui/icons-material';
import QuizComponent from './QuizComponent'; // Add this import
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { apiKey } from './const';
import { exportToWord } from './exportToWord';
import DiagramComponent from './DiagramComponent'; // Add this import
import { useNavigate } from 'react-router-dom';
import react from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import angular from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { formatSummary } from './helper';
import Cookies from 'js-cookie';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TranscriptExtractor from './TranscriptExtractor';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfographicComponent from './InfographicComponent'; // Add this import
import ExportToExcel from './ExportToExcel';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import KeywordIcon from '@mui/icons-material/Label';
import ShareIcon from '@mui/icons-material/Share';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TableChartIcon from '@mui/icons-material/TableChart';

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

const StyledFab = styled(Fab)(({ theme, isDarkMode }) => ({
    position: 'fixed',
    right: '20px',
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white,
    color: isDarkMode ? theme.palette.common.white : theme.palette.grey[800],
    '&:hover': {
        backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[200],
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
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const api = apiKey;
    const [questions, setQuestions] = useState([]);
    const [diagramType, setDiagramType] = useState('flowchart');
    const [showDiagram, setShowDiagram] = useState(false);
    const [diagramKey, setDiagramKey] = useState(0);
    const navigate = useNavigate();
    const [facebookProfile, setFacebookProfile] = useState('');
    const [showTranscriptExtractor, setShowTranscriptExtractor] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [showInfographic, setShowInfographic] = useState(false);
    const [infographicKey, setInfographicKey] = useState(0);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [youtubeUrl, setYoutubeUrl] = useState('');

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        // Load Facebook profile from cookie on component mount
        const savedProfile = Cookies.get('facebookProfile');
        if (savedProfile) {
            setFacebookProfile(savedProfile);
        }
    }, []);

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
        },
    });

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
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
                promptText = `giải thích và hướng dẫn cụ thể hơn có ví dụ cụ thể, nếu có code thì code cụ thể, cực kỳ chi tiết và viết dài hơn bằng tiếng việt: ${inputText}`;
            } else if (selectedPrompt === 'summary') {
                promptText = `tóm tắt bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
            } else if (selectedPrompt === 'bullet') {
                promptText = `ngắn gọn, trong những gạch đầu dòng bằng tiếng việt, demo được bằng code nếu có thể \nno yapping: ${inputText}`;
            } else if (selectedPrompt === 'code') {
                promptText = `code cụ thể và giải thích bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
            } else if (selectedPrompt === 'guide') {
                promptText = `hướng dẫn cực kỳ cụ thể và chi tiết cách làm và giải thích bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
            } else if (selectedPrompt === 'cv') {
                promptText = `tạo các câu hỏi phỏng vấn bằng tiếng việt và câu trả lời bằng tiếng việt dựa trên nội dung sau để tôi nạp vào anki, demo được bằng code nếu có thể trong mỗi câu trả lời : ${inputText}`;
            } else if (selectedPrompt === 'feynman') {
                promptText = `giải thích bằng phương pháp feynman, bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
            } else if (selectedPrompt === 'cheat') {
                promptText = `tạo cheat sheet bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
            } else {
                promptText = `${selectedPrompt} trong khoảng ${summaryLength} từ: ${inputText}`;
            }

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
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
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                    {
                        contents: [{ parts: [{ text: keywordPrompt }] }]
                    }
                );
                const extractedKeywords = keywordResponse.data.candidates[0]?.content?.parts[0]?.text
                    .split(/[,\n]/)
                    .map(k => k.trim())
                    .filter(k => k.length > 0);
                setKeywords(extractedKeywords);

                setCodeSections([]);

                if (selectedPrompt === 'cv') {
                    // Parse the generated summary to extract question-answer pairs
                    const pairs = generatedSummary.split('\n\n').map(pair => {
                        const [question, answer] = pair.split('\n');
                        return { question, answer };
                    });
                    setInterviewQuestions(pairs);
                } else {
                    setInterviewQuestions([]);
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

    const handleKeywordClick = (keyword) => {
        setSelectedKeyword(keyword);
        setIsKeywordModalOpen(false);
        // Update the discussion question with the selected keyword
        // You'll need to implement this part in your DiscussionComponent
    };

    const handleFacebookProfileInput = () => {
        const useExisting = facebookProfile && window.confirm("Bạn muốn sử dụng đường dẫn hiện tại không?\nNhấn OK để sử dụng, hoặc Cancel để nhập đường dẫn mới.");

        if (useExisting) {
            return facebookProfile;
        }

        const profile = prompt("Nhập URL profile Facebook của bạn:", facebookProfile || "");
        if (profile) {
            setFacebookProfile(profile);
            Cookies.set('facebookProfile', profile, { expires: 365 }); // Lưu trong 1 năm
            return profile;
        }
        return null;
    };

    const handleShare = () => {
        let profile = facebookProfile;
        if (!profile) {
            profile = handleFacebookProfileInput();
            if (!profile) return; // Người dùng đã hủy
        } else {
            profile = handleFacebookProfileInput(); // Hỏi xem có muốn sử dụng URL hiện tại không
            if (!profile) return; // Người dùng đã hủy
        }

        let shareUrl;
        if (profile.includes('facebook.com')) {
            // Nếu là URL đầy đủ, sử dụng trực tiếp
            shareUrl = `${profile}&sk=wall&app=fbl`;
        } else {
            // Nếu chỉ là username, tạo URL
            const username = profile.replace('@', '');
            shareUrl = `https://www.facebook.com/${username}`;
        }

        const postContent = encodeURIComponent(summary);
        const fullShareUrl = `${shareUrl}&app=fbl&post=${postContent}`;

        window.open(fullShareUrl, '_blank', 'width=626,height=436');
    };

    const generateSuggestedPrompts = async () => {
        if (!summary) {
            console.error('No summary available');
            setSuggestedPrompts([]);
            return;
        }
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
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

    const handleExportToWord = () => {
        exportToWord(inputText, summary, questions);
    };

    const handleCreateDiagram = () => {
        setShowDiagram(true);
        setDiagramKey(prevKey => prevKey + 1);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    const handleTranscriptExtracted = (transcript) => {
        setInputText(transcript);
        setShowTranscriptExtractor(false);
    };

    const handleOpenHelpModal = () => {
        setIsHelpModalOpen(true);
    };

    const handleCloseHelpModal = () => {
        setIsHelpModalOpen(false);
    };

    const handleCreateInfographic = () => {
        setShowInfographic(true);
        setInfographicKey(prevKey => prevKey + 1);
    };

    const handleGetTranscript = async () => {
        if (!youtubeUrl) {
            setErrorMessage('Please enter a YouTube URL');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('url', youtubeUrl);

            const response = await axios.post('https://yt-sm.onrender.com/get_transcript', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);

            if (response.data && response.data.transcript) {
                setInputText(response.data.transcript);
                setYoutubeUrl('');
            } else {
                setErrorMessage('Failed to get transcript. Please try again.');
            }
        } catch (error) {
            console.error('Error getting transcript:', error);
            setErrorMessage('Error occurred while getting the transcript: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={`min-h-screen ${themeClass}`}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={8}>
                        <div className={`p-4 md:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'bg-gray-800'}`}>Text Summarizer</h1>
                                    <IconButton onClick={handleOpenHelpModal} color="primary" aria-label="help">
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </div>
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
                                    {showTranscriptExtractor ? (
                                        <TranscriptExtractor onTranscriptExtracted={handleTranscriptExtracted} />
                                    ) : (
                                        <>
                                            <div className="mb-4 md:mb-6">
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        isDarkMode
                                                            ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                                                            : 'bg-white text-black border-gray-300 placeholder-gray-500'
                                                    }`}
                                                    placeholder="Enter YouTube URL"
                                                    value={youtubeUrl}
                                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                                />
                                                <button
                                                    className={`mt-2 w-full py-2 px-4 rounded-md text-white font-semibold ${
                                                        isLoading || !youtubeUrl
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                                    onClick={handleGetTranscript}
                                                    disabled={isLoading || !youtubeUrl}
                                                >
                                                    {isLoading ? <CircularProgress size={24} className="text-white" /> : 'Get Transcript'}
                                                </button>
                                            </div>
                                            <div className="mb-4 md:mb-6">
                                                <textarea
                                                    className={`w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        isDarkMode
                                                            ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                                                            : 'bg-white text-black border-gray-300 placeholder-gray-500'
                                                    }`}
                                                    rows="6"
                                                    placeholder="Enter your text to summarize or view transcript"
                                                    value={inputText}
                                                    onChange={(e) => setInputText(e.target.value)}
                                                ></textarea>
                                            </div>
                                        </>
                                    )}
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
                                                <StyledMenuItem value="guide" isDarkMode={isDarkMode}>Hướng dẫn cụ thể</StyledMenuItem>
                                                <StyledMenuItem value="cv" isDarkMode={isDarkMode}>Tạo câu hỏi phỏng vấn</StyledMenuItem>
                                                <StyledMenuItem value="feynman" isDarkMode={isDarkMode}>Giải thích bằng phương pháp feynman</StyledMenuItem>
                                                <StyledMenuItem value="cheat" isDarkMode={isDarkMode}>Cheat sheet</StyledMenuItem>
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
                                        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${isLoading || !inputText
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
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleExportToWord}
                                                disabled={!summary || questions.length === 0}
                                            >
                                                Export to Word
                                            </Button>
                                            {summary && ( // Only render ExportToExcel when summary exists
                                                <ExportToExcel summary={summary} isDarkMode={isDarkMode} />
                                            )}
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
                        <div className="mt-4 lg:mt-0">
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
                                    setQuestions={setQuestions}
                                />
                            )}
                            {summary && (
                                <CustomAccordion className="mt-4" isDarkMode={isDarkMode}>
                                    <CustomAccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="diagram-content"
                                        id="diagram-header"
                                        isDarkMode={isDarkMode}
                                    >
                                        <Typography>Diagram</Typography>
                                    </CustomAccordionSummary>
                                    <CustomAccordionDetails isDarkMode={isDarkMode}>
                                        <FormControl fullWidth className="mb-4">
                                            <InputLabel id="diagram-type-label">Loại biểu đồ</InputLabel>
                                            <StyledSelect
                                                labelId="diagram-type-label"
                                                value={diagramType}
                                                onChange={(e) => setDiagramType(e.target.value)}
                                                isDarkMode={isDarkMode}
                                            >
                                                <StyledMenuItem value="flowchart" isDarkMode={isDarkMode}>Flowchart</StyledMenuItem>
                                                <StyledMenuItem value="mindmap" isDarkMode={isDarkMode}>Mind Map</StyledMenuItem>
                                                <StyledMenuItem value="classDiagram" isDarkMode={isDarkMode}>Class Diagram</StyledMenuItem>
                                                <StyledMenuItem value="sequence" isDarkMode={isDarkMode}>Sequence Diagram</StyledMenuItem>
                                                <StyledMenuItem value="erDiagram" isDarkMode={isDarkMode}>ER Diagram</StyledMenuItem>
                                                <StyledMenuItem value="userJourney" isDarkMode={isDarkMode}>User Journey</StyledMenuItem>
                                                <StyledMenuItem value="zenuml" isDarkMode={isDarkMode}>ZenUML</StyledMenuItem>
                                                <StyledMenuItem value="stateDiagram" isDarkMode={isDarkMode}>State Diagram</StyledMenuItem>
                                                <StyledMenuItem value="block" isDarkMode={isDarkMode}>Block Diagram</StyledMenuItem>
                                                <StyledMenuItem value="architect" isDarkMode={isDarkMode}>Architecture Diagram</StyledMenuItem>
                                            </StyledSelect>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleCreateDiagram}
                                            fullWidth
                                        >
                                            Tạo biểu đồ
                                        </Button>
                                        {showDiagram && (
                                            <div className="mt-4">
                                                <DiagramComponent
                                                    key={diagramKey}
                                                    summary={summary}
                                                    diagramType={diagramType}
                                                    setDiagramType={setDiagramType}
                                                />
                                            </div>
                                        )}
                                    </CustomAccordionDetails>
                                </CustomAccordion>
                            )}
                        </div>
                    </Grid>
                </Grid>
                <StyledFab
                    size="small"
                    aria-label="scroll to top"
                    onClick={scrollToTop}
                    isDarkMode={isDarkMode}
                    style={{ bottom: '80px' }}
                >
                    <KeyboardArrowUpIcon />
                </StyledFab>
                <StyledFab
                    size="small"
                    aria-label="scroll to bottom"
                    onClick={scrollToBottom}
                    isDarkMode={isDarkMode}
                    style={{ bottom: '20px' }}
                >
                    <KeyboardArrowDownIcon />
                </StyledFab>
                <Modal
                    open={isHelpModalOpen}
                    onClose={handleCloseHelpModal}
                    aria-labelledby="help-modal-title"
                    aria-describedby="help-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 600,
                        maxHeight: '90vh',
                        bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
                        border: `2px solid ${isDarkMode ? 'grey.800' : 'grey.300'}`,
                        boxShadow: 24,
                        p: 4,
                        color: isDarkMode ? 'common.white' : 'text.primary',
                        overflowY: 'auto',
                        borderRadius: 2,
                    }}>
                        <Typography id="help-modal-title" variant="h4" component="h2" gutterBottom fontWeight="bold">
                            Hướng dẫn sử dụng
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                            Cách lấy nội dung từ YouTube:
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <YouTubeIcon color="error" />
                                </ListItemIcon>
                                <ListItemText primary="Mở một video YouTube bất kỳ" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <TextFieldsIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary='Kéo xuống phần mô tả, nhấp vào "hiện bản chép lời"' />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ContentCopyIcon color="action" />
                                </ListItemIcon>
                                <ListItemText primary="Sao chép toàn bộ nội dung và dán vào ứng dụng" />
                            </ListItem>
                        </List>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                            Các tính năng chính:
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <SummarizeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Tóm tắt văn bản"
                                    secondary="Nhập nội dung, chọn kiểu và độ dài tóm tắt, sau đó nhấn 'Summarize'"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AccountTreeIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Tạo biểu đồ"
                                    secondary="Chọn loại biểu đồ và nhấn 'Tạo biểu đồ' để trực quan hóa thông tin"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <QuestionAnswerIcon color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Tạo câu hỏi và thảo luận"
                                    secondary="Sử dụng phần 'Discussion' để tạo câu hỏi tự động hoặc thảo luận"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <TextFieldsIcon color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Tương tác với văn bản"
                                    secondary="Bôi đen bất kỳ phần nào trong văn bản tóm tắt để hiển thị các tùy chọn"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <KeywordIcon color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Từ khóa và đề xuất"
                                    secondary="Xem từ khóa quan trọng và nhận đề xuất prompts để khám phá sâu hơn"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ShareIcon color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Chia sẻ và xuất"
                                    secondary="Sao chép, chia sẻ qua Facebook, hoặc xuất kết quả ra file Word"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PsychologyIcon color="error" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Phương pháp Feynman"
                                    secondary="Giải thích nội dung bằng phương pháp Feynman"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <TableChartIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Xuất ra Excel"
                                    secondary="Xuất câu hỏi và câu trả lời ra file Excel để chèn vào Anki"
                                />
                            </ListItem>
                        </List>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                onClick={handleCloseHelpModal}
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                Đóng
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
};

export default TextSummarizer;
