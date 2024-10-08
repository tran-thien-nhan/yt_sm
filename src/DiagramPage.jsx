import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Switch, Fab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DiagramComponent from './DiagramComponent';
import { formatSummary } from './helper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// Custom styled components for dark mode
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

const StyledFab = styled(Fab)(({ theme, isDarkMode }) => ({
    position: 'fixed',
    right: '20px',
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white,
    color: isDarkMode ? theme.palette.common.white : theme.palette.grey[800],
    '&:hover': {
        backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[200],
    },
}));

const DiagramPage = () => {
    const [diagramType, setDiagramType] = useState('flowchart');
    const [showDiagram, setShowDiagram] = useState(false);
    const [summary, setSummary] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const [diagramKey, setDiagramKey] = useState(0);

    useEffect(() => {
        // Lấy summary từ localStorage
        const storedSummary = localStorage.getItem('diagramSummary');
        if (storedSummary) {
            setSummary(storedSummary);
            // Xóa summary khỏi localStorage
            localStorage.removeItem('diagramSummary');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
        },
    });

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const themeClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

    const createDiagram = () => {
        setShowDiagram(true);
        setDiagramKey(prevKey => prevKey + 1);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={`min-h-screen ${themeClass}`}>
                <div className="px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Trang Biểu đồ</h2>
                        <Switch
                            checked={isDarkMode}
                            onChange={toggleTheme}
                            color="primary"
                        />
                    </div>
                    <CustomAccordion className="mb-6" isDarkMode={isDarkMode}>
                        <CustomAccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            isDarkMode={isDarkMode}
                        >
                            <h3 className="text-lg font-semibold">Formatted Summary</h3>
                        </CustomAccordionSummary>
                        <CustomAccordionDetails isDarkMode={isDarkMode}>
                            {formatSummary(summary)}
                        </CustomAccordionDetails>
                    </CustomAccordion>
                    <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                            Loại biểu đồ
                        </h3>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex-grow">
                                <select
                                    value={diagramType}
                                    onChange={(e) => setDiagramType(e.target.value)}
                                    className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="flowchart">Flowchart</option>
                                    <option value="mindmap">Mind Map</option>
                                    <option value="classDiagram">Class Diagram</option>
                                    <option value="sequence">Sequence Diagram</option>
                                    <option value="erDiagram">ER Diagram</option>
                                    <option value="userJourney">User Journey</option>
                                    <option value="zenuml">ZenUML</option>
                                    <option value="stateDiagram">State Diagram</option>
                                    <option value="block">Block Diagram</option>
                                    <option value="architect">Architecture Diagram</option>
                                </select>
                            </div>
                            <button
                                className={`px-6 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${!summary
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
                                    }`}
                                onClick={createDiagram}
                                disabled={!summary}
                            >
                                Tạo biểu đồ
                            </button>
                        </div>
                    </div>

                    {showDiagram && summary && (
                        <div className="mt-4">
                            <DiagramComponent
                                key={diagramKey}
                                summary={summary}
                                diagramType={diagramType}
                                setDiagramType={setDiagramType}
                            />
                        </div>
                    )}

                    {!showDiagram && (
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-6">Trang Biểu đồ</h2>
                        </div>
                    )}
                </div>
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
            </div>
        </ThemeProvider>
    );
};

export default DiagramPage;
