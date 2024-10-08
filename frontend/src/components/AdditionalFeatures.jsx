import React from 'react';
import { Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './StyledComponents';
import DiagramSection from './DiagramSection';
import AutoSlideGenerator from './AutoSlideGenerator';
import AutoFlashcardGenerator from './AutoFlashcardGenerator';
import ExcelAnalyzer from './ExcelAnalyzer';
import ImageAnalyzer from './ImageAnalyzer';
import DiscussionComponent from '../DiscussionComponent';

const AdditionalFeatures = ({
    summary,
    selectedText,
    setSelectedText, // Add this line
    isModalOpen,
    setIsModalOpen,
    handleAskSelectedText,
    selectedKeyword,
    suggestedPrompts,
    selectedPromptForDiscussion,
    setSelectedPromptForDiscussion,
    isDarkMode,
    setQuestions,
    diagramType,
    setDiagramType,
    showDiagram,
    handleCreateDiagram,
    diagramKey,
    trizAnalysis,
    trizSolution,
    handleExcelAnalysis,
    excelAnalysis,
    handleSummarize
}) => {
    return (
        <>
            {summary && (
                <DiscussionComponent
                    summary={summary}
                    setSelectedText={setSelectedText} // Make sure this line is present
                    selectedText={selectedText}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    handleAskSelectedText={handleAskSelectedText}
                    selectedKeyword={selectedKeyword}
                    suggestedPrompts={suggestedPrompts}
                    selectedPromptForDiscussion={selectedPromptForDiscussion}
                    setSelectedPromptForDiscussion={setSelectedPromptForDiscussion}
                    isDarkMode={isDarkMode}
                    setQuestions={setQuestions}
                />
            )}
            {summary && (
                <DiagramSection
                    summary={summary}
                    isDarkMode={isDarkMode}
                    diagramType={diagramType}
                    setDiagramType={setDiagramType}
                    showDiagram={showDiagram}
                    handleCreateDiagram={handleCreateDiagram}
                    diagramKey={diagramKey}
                />
            )}
            {summary && (
                <CustomAccordion className="mt-4" isDarkMode={isDarkMode}>
                    <CustomAccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="slides-content"
                        id="slides-header"
                        isDarkMode={isDarkMode}
                    >
                        <Typography>Tạo Slides Tự Động</Typography>
                    </CustomAccordionSummary>
                    <CustomAccordionDetails isDarkMode={isDarkMode}>
                        <AutoSlideGenerator summary={summary} isDarkMode={isDarkMode} />
                    </CustomAccordionDetails>
                </CustomAccordion>
            )}
            {summary && (
                <CustomAccordion className="mt-4" isDarkMode={isDarkMode}>
                    <CustomAccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="flashcards-content"
                        id="flashcards-header"
                        isDarkMode={isDarkMode}
                    >
                        <Typography>Tạo Flashcards Tự Động</Typography>
                    </CustomAccordionSummary>
                    <CustomAccordionDetails isDarkMode={isDarkMode}>
                        <AutoFlashcardGenerator summary={summary} isDarkMode={isDarkMode} />
                    </CustomAccordionDetails>
                </CustomAccordion>
            )}
            {trizAnalysis && (
                <CustomAccordion className="mt-4" isDarkMode={isDarkMode}>
                    <CustomAccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="triz-content"
                        id="triz-header"
                        isDarkMode={isDarkMode}
                    >
                        <Typography>TRIZ Analysis</Typography>
                    </CustomAccordionSummary>
                    <CustomAccordionDetails isDarkMode={isDarkMode}>
                        {trizAnalysis}
                        {trizSolution && (
                            <div className="mt-4">
                                <Typography variant="h6">Creative Solution:</Typography>
                                <Typography>{trizSolution}</Typography>
                            </div>
                        )}
                    </CustomAccordionDetails>
                </CustomAccordion>
            )}
            <CustomAccordion className="mt-4" isDarkMode={isDarkMode}>
                <CustomAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="excel-content"
                    id="excel-header"
                    isDarkMode={isDarkMode}
                >
                    <Typography>Excel Analyzer</Typography>
                </CustomAccordionSummary>
                <CustomAccordionDetails isDarkMode={isDarkMode}>
                    <ExcelAnalyzer onDataAnalyzed={handleExcelAnalysis} isDarkMode={isDarkMode} />
                    {excelAnalysis && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSummarize}
                            sx={{ mt: 2 }}
                        >
                            Summarize Excel Analysis
                        </Button>
                    )}
                </CustomAccordionDetails>
            </CustomAccordion>
            <CustomAccordion className="mt-4" isDarkMode={isDarkMode}>
                <CustomAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="image-analysis-content"
                    id="image-analysis-header"
                    isDarkMode={isDarkMode}
                >
                    <Typography>Image Analysis</Typography>
                </CustomAccordionSummary>
                <CustomAccordionDetails isDarkMode={isDarkMode}>
                    <ImageAnalyzer isDarkMode={isDarkMode} />
                </CustomAccordionDetails>
            </CustomAccordion>
        </>
    );
};

export default AdditionalFeatures;
