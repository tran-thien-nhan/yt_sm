<<<<<<< HEAD
import React from 'react';
import { Typography, Button } from '@mui/material';
=======
import React, { useState } from 'react';
import { Typography, Button, Modal, Box, CircularProgress } from '@mui/material';
>>>>>>> c0075df (Reinitialize Git repository)
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './StyledComponents';
import DiagramSection from './DiagramSection';
import AutoSlideGenerator from './AutoSlideGenerator';
import AutoFlashcardGenerator from './AutoFlashcardGenerator';
import ExcelAnalyzer from './ExcelAnalyzer';
import ImageAnalyzer from './ImageAnalyzer';
import DiscussionComponent from '../DiscussionComponent';
<<<<<<< HEAD
=======
import { formatSummary, handleMoreSolutions } from '../helper';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
>>>>>>> c0075df (Reinitialize Git repository)

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
<<<<<<< HEAD
    handleExcelAnalysis,
    excelAnalysis,
    handleSummarize
}) => {
=======
    setTrizSolution,
    api,
    handleExcelAnalysis,
    excelAnalysis,
    handleSummarize,
    trizMoreSolutions,
    setTrizMoreSolutions,
    isTrizModalOpen,
    setIsTrizModalOpen,
    handleOpenTrizModal,
    handleCloseTrizModal
}) => {
    const [isLoadingMoreSolutions, setIsLoadingMoreSolutions] = useState(false);

    const handleOpenMoreSolutions = async () => {
        setIsLoadingMoreSolutions(true);
        setIsTrizModalOpen(true);
        try {
            await handleMoreSolutions(trizAnalysis, api, setTrizSolution, setTrizMoreSolutions);
        } catch (error) {
            console.error('Error generating more solutions:', error);
            setTrizMoreSolutions('Đã xảy ra lỗi khi tạo thêm giải pháp.');
        } finally {
            setIsLoadingMoreSolutions(false);
        }
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCopyContent = () => {
        navigator.clipboard.writeText(trizMoreSolutions)
            .then(() => {
                // Optionally, you can show a success message or update UI
                console.log('Content copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy content: ', err);
            });
    };

>>>>>>> c0075df (Reinitialize Git repository)
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
<<<<<<< HEAD
=======
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenMoreSolutions}
                                    sx={{ mt: 2, mr: 2 }}
                                >
                                    More Solutions
                                </Button>
>>>>>>> c0075df (Reinitialize Git repository)
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
<<<<<<< HEAD
=======

            <Modal
                open={isTrizModalOpen}
                onClose={handleCloseTrizModal}
                aria-labelledby="more-solutions-modal"
                aria-describedby="more-triz-solutions"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%', // Increased width
                    maxWidth: 800, // Maximum width
                    maxHeight: '90vh', // Maximum height
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto', // Enable vertical scrolling
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography id="more-solutions-modal" variant="h6" component="h2" sx={{ color: 'white' }}>
                            Additional TRIZ Solutions
                        </Typography>
                        <Button
                            onClick={handleCopyContent}
                            startIcon={<ContentCopyIcon />}
                            sx={{ color: 'white' }}
                        >
                            Copy
                        </Button>
                    </Box>
                    {isLoadingMoreSolutions ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Typography id="more-triz-solutions" sx={{ mt: 2, color: 'white' }}>
                            {formatSummary(trizMoreSolutions) || 'No additional solutions available.'}
                        </Typography>
                    )}
                    <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
>>>>>>> c0075df (Reinitialize Git repository)
        </>
    );
};

export default AdditionalFeatures;
