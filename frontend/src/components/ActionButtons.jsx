import React from 'react';
import { Button } from '@mui/material';
import KeywordModal from './KeywordModal';
import PromptModal from './PromptModal';
import ExportToExcel from '../ExportToExcel';

const ActionButtons = ({
  keywords,
  setIsKeywordModalOpen,
  handleExportToWord,
  summary,
  questions,
  isDarkMode,
  handleTrizAnalysisClick,
  isLoadingExport,
  theme,
  isKeywordModalOpen,
  onCloseKeywordModal,
  handleKeywordClick,
  isPromptModalOpen,
  setIsPromptModalOpen,
  handleClosePromptModal,
  suggestedPrompts,
  handlePromptClick,
  PromptModal,
  handleCreateQuizTest,
}) => {
  const [loadingButton, setLoadingButton] = React.useState(null);

  const handleButtonClick = async (action, handler) => {
    setLoadingButton(action);
    try {
      await handler();
    } finally {
      setLoadingButton(null);
    }
  };

<<<<<<< HEAD
  // Remove this function as it's no longer needed
  // const handleTrizClick = async () => {
  //   setIsTrizLoading(true);
  //   try {
  //     await handleTrizAnalysisClick();
  //   } finally {
  //     setIsTrizLoading(false);
  //   }
  // };

=======
>>>>>>> c0075df (Reinitialize Git repository)
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Keywords:</h3>
      <div className="flex space-x-2">
        <Button onClick={() => setIsKeywordModalOpen(true)}>
          View Keywords
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExportToWord}
          disabled={!summary || questions.length === 0 || isLoadingExport}
        >
          {isLoadingExport ? 'Exporting...' : 'Export to Word'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleButtonClick('triz', handleTrizAnalysisClick)}
          disabled={!summary || loadingButton === 'triz'}
        >
          {loadingButton === 'triz' ? 'Finding Solutions...' : 'Find Solutions With TRIZ'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleButtonClick('quiz', handleCreateQuizTest)}
          disabled={loadingButton === 'quiz'}
        >
          {loadingButton === 'quiz' ? 'Creating Quiz...' : 'Create Quiz'}
        </Button>
      </div>
      <KeywordModal
        isOpen={isKeywordModalOpen}
        onClose={onCloseKeywordModal}
        keywords={keywords}
        handleKeywordClick={handleKeywordClick}
        isDarkMode={isDarkMode}
        theme={theme}
      />
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        suggestedPrompts={suggestedPrompts}
        handlePromptClick={handlePromptClick}
        isDarkMode={isDarkMode}
        theme={theme}
      />
    </div>
  );
};

export default ActionButtons;
