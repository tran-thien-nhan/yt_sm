import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Hoặc chọn theme khác
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { apiKey } from './const';
import { useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InputSection from './components/InputSection';
import SummarySection from './components/SummarySection';
import HelpModal from './components/HelpModal';
import ActionButtons from './components/ActionButtons';
import AdditionalFeatures from './components/AdditionalFeatures';
import { Grid, IconButton, Switch } from '@mui/material';
import ScrollButtons from './components/ScrollButtons';
import { useSummarizerState } from './hooks/useSummarizerState';
import { createSummarizerHandlers } from './utils/summarizerHandlers';
import PromptModal from './components/PromptModal';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuizModal from './components/QuizModal'; // Tạo component này sau

const TextSummarizer = () => {
    const state = useSummarizerState();
    const navigate = useNavigate();
    const handlers = createSummarizerHandlers(state, state, apiKey);

    const {
        isDarkMode, setIsDarkMode, inputText, setInputText, summary, isLoading,
        errorMessage, selectedPrompt, setSelectedPrompt, summaryLength, setSummaryLength,
        keywords, isKeywordModalOpen, setIsKeywordModalOpen, suggestedPrompts,
        setSuggestedPrompts, // Add this line
        isPromptModalOpen, questions, setQuestions, diagramType, setDiagramType,
        showDiagram, diagramKey, trizAnalysis, trizSolution, excelAnalysis,
        inputExpanded, setInputExpanded, selectedText, setSelectedText, // Add setSelectedText here
        isModalOpen, setIsModalOpen,
        selectedKeyword, selectedPromptForDiscussion, setSelectedPromptForDiscussion,
        copyFeedback, isHelpModalOpen,
        selectedLanguage, setSelectedLanguage, // Add these lines
        quizQuestions, isQuizModalOpen, isLoadingQuiz, setIsLoadingQuiz,
        isLoadingTriz,
    } = state;

    const {
        handleSummarizeClick, handleGenerateSuggestedPrompts, handleExportToWord,
        handleTrizAnalysisClick, handleKeywordClick, handleClosePromptModal,
        handlePromptClick, handleCopy, handleShare, handleAskSelectedText,
        handleCreateDiagram, handleExcelAnalysis, handleSummarize,
        handleOpenHelpModal, handleCloseHelpModal,
        handleCreateQuizTest, handleCloseQuizModal,
    } = handlers;

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
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div className={`min-h-screen ${themeClass}`}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={8}>
                        <div className={`p-4 md:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Text Summarizer</h1>
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
                            <InputSection
                                inputExpanded={inputExpanded}
                                setInputExpanded={setInputExpanded}
                                inputText={inputText}
                                setInputText={setInputText}
                                selectedPrompt={selectedPrompt}
                                setSelectedPrompt={setSelectedPrompt}
                                summaryLength={summaryLength}
                                setSummaryLength={setSummaryLength}
                                handleSummarize={handleSummarizeClick}
                                isLoading={isLoading}
                                isDarkMode={isDarkMode}
                                selectedLanguage={selectedLanguage}
                                setSelectedLanguage={setSelectedLanguage}
                            />
                            <div className="mt-4 md:mt-6">
                                {keywords.length > 0 && (
                                    <ActionButtons
                                        keywords={keywords}
                                        setIsKeywordModalOpen={setIsKeywordModalOpen}
                                        handleGenerateSuggestedPrompts={handleGenerateSuggestedPrompts}
                                        handleExportToWord={handleExportToWord}
                                        summary={summary}
                                        questions={questions}
                                        isDarkMode={isDarkMode}
                                        handleTrizAnalysisClick={handleTrizAnalysisClick}
                                        isLoading={isLoading}
                                        isKeywordModalOpen={isKeywordModalOpen}
                                        onCloseKeywordModal={() => setIsKeywordModalOpen(false)}
                                        handleKeywordClick={handleKeywordClick}
                                        theme={theme}
                                        isPromptModalOpen={isPromptModalOpen}
                                        setIsPromptModalOpen={(value) => state.setIsPromptModalOpen(value)}
                                        handleClosePromptModal={handleClosePromptModal}
                                        suggestedPrompts={state.suggestedPrompts}
                                        handlePromptClick={handlers.handlePromptClick}
                                        PromptModal={PromptModal}
                                        handleCreateQuizTest={handleCreateQuizTest}
                                        isLoadingQuiz={isLoadingQuiz}
                                    />
                                )}
                                {summary && (
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="summary-content"
                                            id="summary-header"
                                        >
                                            <Typography>Summary</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <SummarySection
                                                summary={summary}
                                                handleCopy={handleCopy}
                                                handleShare={handleShare}
                                                copyFeedback={copyFeedback}
                                                isDarkMode={isDarkMode}
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                                {/* {errorMessage && (
                                    <p className="text-red-600 mt-2 text-sm">{errorMessage}</p>
                                )} */}
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <div className="mt-4 lg:mt-0">
                            <AdditionalFeatures
                                summary={summary}
                                selectedText={selectedText}
                                setSelectedText={setSelectedText} // Now this is defined
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                handleAskSelectedText={handleAskSelectedText}
                                selectedKeyword={selectedKeyword}
                                suggestedPrompts={suggestedPrompts}
                                selectedPromptForDiscussion={selectedPromptForDiscussion}
                                setSelectedPromptForDiscussion={setSelectedPromptForDiscussion}
                                isDarkMode={isDarkMode}
                                setQuestions={setQuestions}
                                diagramType={diagramType}
                                setDiagramType={setDiagramType}
                                showDiagram={showDiagram}
                                handleCreateDiagram={handleCreateDiagram}
                                diagramKey={diagramKey}
                                trizAnalysis={trizAnalysis}
                                trizSolution={trizSolution}
                                handleExcelAnalysis={handleExcelAnalysis}
                                excelAnalysis={excelAnalysis}
                                handleSummarize={handleSummarize}
                                isLoadingTriz={isLoadingTriz}
                                isLoadingQuiz={isLoadingQuiz}
                            />
                        </div>
                    </Grid>
                </Grid>
                <ScrollButtons isDarkMode={isDarkMode} />
                <HelpModal
                    isOpen={isHelpModalOpen}
                    onClose={handleCloseHelpModal}
                    isDarkMode={isDarkMode}
                />
                <QuizModal
                    isOpen={isQuizModalOpen}
                    onClose={handleCloseQuizModal}
                    questions={quizQuestions}
                    isDarkMode={isDarkMode}
                />
            </div>
        </ThemeProvider>
    );
};

export default TextSummarizer;