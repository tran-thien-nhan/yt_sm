import { exportToWord } from '../exportToWord';
import { handleCreateQuiz, handleSummarize, handleTrizAnalysis } from '../helper';

import axios from 'axios';

export const createSummarizerHandlers = (state, setState, api) => {
    const handleTextSelection = () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text) {
            setState.setSelectedText(text);
            setState.setIsModalOpen(true);
        }
    };

    const handleAskSelectedText = () => {
        setState.setIsModalOpen(false);
    };

    const handleSummarizeClick = async () => {
        await handleSummarize(
            state.inputText,
            state.selectedPrompt,
            state.summaryLength,
            api,
            setState.setIsLoading,
            setState.setSummary,
            setState.setErrorMessage,
            setState.setInputExpanded,
            setState.setKeywords,
            setState.setCodeSections,
            setState.setInterviewQuestions,
            state.selectedLanguage,
            setState.setSelectedLanguage
        );

        // Generate suggested prompts after summarizing
        await generateSuggestedPrompts();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(state.summary).then(() => {
            setState.setCopyFeedback('Copied!');
            setTimeout(() => setState.setCopyFeedback(''), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            setState.setCopyFeedback('Failed to copy');
        });
    };

    const handleKeywordClick = (keyword) => {
        setState.setSelectedKeyword(keyword);
        setState.setIsKeywordModalOpen(false);
        // Update the discussion question with the selected keyword
        // You'll need to implement this part in your DiscussionComponent
    };

    const handleFacebookProfileInput = () => {
        const useExisting = state.facebookProfile && window.confirm("Bạn muốn sử dụng đường dẫn hiện tại không?\nNhấn OK để sử dụng, hoặc Cancel để nhập đường dẫn mới.");

        if (useExisting) {
            return state.facebookProfile;
        }

        const profile = prompt("Nhập URL profile Facebook của bạn:", state.facebookProfile || "");
        if (profile) {
            setState.setFacebookProfile(profile);
            // Note: You'll need to import Cookies or use a different method to store the profile
            // Cookies.set('facebookProfile', profile, { expires: 365 }); // Lưu trong 1 năm
            return profile;
        }
        return null;
    };

    const handleShare = () => {
        let profile = state.facebookProfile;
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

        const postContent = encodeURIComponent(state.summary);
        const fullShareUrl = `${shareUrl}&app=fbl&post=${postContent}`;

        window.open(fullShareUrl, '_blank', 'width=626,height=436');
    };

    const generateSuggestedPrompts = async () => {
        if (!state.summary) {
            console.error('No summary available');
            setState.setSuggestedPrompts([]);
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
                                    text: `Dựa trên đoạn văn bản sau, hãy đề xuất 20 câu hỏi hoặc prompt ngắn gọn để tìm hiểu thêm về nội dung. Chỉ liệt kê các câu hỏi, mỗi câu một dòng: "${state.summary}"`
                                }
                            ]
                        }
                    ]
                }
            );
            const suggestions = response.data.candidates[0]?.content?.parts[0]?.text.split('\n').filter(s => s.trim());
            setState.setSuggestedPrompts(suggestions || []);
        } catch (error) {
            console.error('Error generating suggested prompts:', error);
            setState.setSuggestedPrompts([]);
        }
    };

    const handleOpenQuizModal = () => {
        setState.setIsQuizModalOpen(true);
    };

    const handleOpenPromptModal = () => {
        setState.setIsPromptModalOpen(true);
    };

    const handleClosePromptModal = () => {
        setState.setIsPromptModalOpen(false);
    };

    const handlePromptClick = (prompt) => {
        setState.setSelectedPromptForDiscussion(prompt);
        setState.setIsPromptModalOpen(false);
        // You can add additional logic here if needed
    };

    const handleGenerateSuggestedPrompts = async () => {
        const { summary, setSuggestedPrompts, setIsLoading, setErrorMessage } = state;

        if (!summary) {
            setErrorMessage('Please generate a summary first');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Based on this summary, generate 5 suggested prompts for further exploration:\n\n${summary}`
                                }
                            ]
                        }
                    ]
                }
            );

            const generatedPrompts = response.data.candidates[0]?.content?.parts[0]?.text
                .split('\n')
                .filter(prompt => prompt.trim().length > 0);

            setSuggestedPrompts(generatedPrompts);
        } catch (error) {
            console.error('Error generating suggested prompts:', error);
            setErrorMessage('Error occurred while generating suggested prompts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportToWord = () => {
        exportToWord(state.inputText, state.summary, state.questions);
    };

    const handleCreateDiagram = () => {
        setState.setShowDiagram(true);
        setState.setDiagramKey(prevKey => prevKey + 1);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    const handleTranscriptExtracted = (transcript) => {
        setState.setInputText(transcript);
        setState.setShowTranscriptExtractor(false);
    };

    const handleOpenHelpModal = () => {
        setState.setIsHelpModalOpen(true);
    };

    const handleCloseHelpModal = () => {
        setState.setIsHelpModalOpen(false);
    };

    const handleCreateInfographic = () => {
        setState.setShowInfographic(true);
        setState.setInfographicKey(prevKey => prevKey + 1);
    };

    const handleExcelAnalysis = (analysis) => {
        setState.setExcelAnalysis(analysis);
        setState.setInputText(`Excel Analysis:\n${JSON.stringify(analysis, null, 2)}`);
    };

    const handleTrizAnalysisClick = () => {
        handleTrizAnalysis(
            state.summary,
            api,
            setState.setIsLoading,
            setState.setErrorMessage,
            setState.setTrizAnalysis,
            setState.setTrizSolution
        );
    };

    const handleCreateQuizTest = async () => {
        await handleCreateQuiz(
            state.summary,
            api,
            setState.setIsLoading,
            setState.setErrorMessage,
            setState.setQuizQuestions
        );
        setState.setIsQuizModalOpen(true);
    };

    const handleCloseQuizModal = () => {
        setState.setIsQuizModalOpen(false);
    };

    return {
        handleTextSelection,
        handleAskSelectedText,
        handleSummarizeClick,
        handleCopy,
        handleKeywordClick,
        handleFacebookProfileInput,
        handleShare,
        generateSuggestedPrompts,
        handleOpenQuizModal,
        handleOpenPromptModal,
        handleClosePromptModal,
        handlePromptClick,
        handleGenerateSuggestedPrompts,
        handleTrizAnalysisClick,
        handleExportToWord,
        handleCreateDiagram,
        handleExcelAnalysis,
        handleOpenHelpModal,
        handleCloseHelpModal,
        handleCreateQuizTest,
        handleCloseQuizModal
    };
};
