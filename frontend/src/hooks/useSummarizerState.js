import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useSummarizerState = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('default');
  const [codeSections, setCodeSections] = useState([]);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [inputExpanded, setInputExpanded] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD
=======
  const [isTrizModalOpen, setIsTrizModalOpen] = useState(false);
>>>>>>> c0075df (Reinitialize Git repository)
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
  const [questions, setQuestions] = useState([]);
  const [diagramType, setDiagramType] = useState('flowchart');
  const [showDiagram, setShowDiagram] = useState(false);
  const [diagramKey, setDiagramKey] = useState(0);
  const [facebookProfile, setFacebookProfile] = useState('');
  const [showTranscriptExtractor, setShowTranscriptExtractor] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [showInfographic, setShowInfographic] = useState(false);
  const [infographicKey, setInfographicKey] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [excelAnalysis, setExcelAnalysis] = useState(null);
  const [trizAnalysis, setTrizAnalysis] = useState(null);
  const [trizSolution, setTrizSolution] = useState('');
  const [inputPdf, setInputPdf] = useState('');
  const [pdfSummary, setPdfSummary] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('java'); // Add this line
  const [isLoadingTriz, setIsLoadingTriz] = useState(false);
<<<<<<< HEAD
=======
  const [trizMoreSolutions, setTrizMoreSolutions] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedIeltsTypes, setSelectedIeltsTypes] = useState([]);
  const [selectedIeltsListeningTypes, setSelectedIeltsListeningTypes] = useState([]);
>>>>>>> c0075df (Reinitialize Git repository)

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const savedProfile = Cookies.get('facebookProfile');
    if (savedProfile) {
      setFacebookProfile(savedProfile);
    }
  }, []);

  return {
    inputText, setInputText,
    summary, setSummary,
    isLoading, setIsLoading,
    isLoadingQuiz, setIsLoadingQuiz,
    isLoadingTriz, setIsLoadingTriz,
    errorMessage, setErrorMessage,
    selectedPrompt, setSelectedPrompt,
    codeSections, setCodeSections,
    copyFeedback, setCopyFeedback,
    inputExpanded, setInputExpanded,
    selectedText, setSelectedText,
    isModalOpen, setIsModalOpen,
    keywords, setKeywords,
    isKeywordModalOpen, setIsKeywordModalOpen,
    selectedKeyword, setSelectedKeyword,
    summaryLength, setSummaryLength,
    suggestedPrompts, setSuggestedPrompts,
    selectedPromptForDiscussion, setSelectedPromptForDiscussion,
    quizQuestions, setQuizQuestions,
    isQuizModalOpen, setIsQuizModalOpen,
    isPromptModalOpen, setIsPromptModalOpen,
    isDarkMode, setIsDarkMode,
    questions, setQuestions,
    diagramType, setDiagramType,
    showDiagram, setShowDiagram,
    diagramKey, setDiagramKey,
    facebookProfile, setFacebookProfile,
    showTranscriptExtractor, setShowTranscriptExtractor,
    isHelpModalOpen, setIsHelpModalOpen,
    showInfographic, setShowInfographic,
    infographicKey, setInfographicKey,
    interviewQuestions, setInterviewQuestions,
    youtubeUrl, setYoutubeUrl,
    excelAnalysis, setExcelAnalysis,
    trizAnalysis, setTrizAnalysis,
    trizSolution, setTrizSolution,
    inputPdf, setInputPdf,
    pdfSummary, setPdfSummary,
<<<<<<< HEAD
    selectedLanguage, setSelectedLanguage // Add this line
=======
    selectedLanguage, setSelectedLanguage, // Add this line
    trizMoreSolutions, setTrizMoreSolutions,
    isTrizModalOpen, setIsTrizModalOpen,
    customPrompt, setCustomPrompt,
    selectedIeltsTypes, setSelectedIeltsTypes,
    selectedIeltsListeningTypes, setSelectedIeltsListeningTypes
>>>>>>> c0075df (Reinitialize Git repository)
  };
};
