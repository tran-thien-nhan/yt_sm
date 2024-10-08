import React, { useState } from 'react';
import { Modal, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Box, IconButton } from '@mui/material';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

const QuizModal = ({ isOpen, onClose, questions, isDarkMode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(Number(event.target.value));
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
  };

  const handleDownload = () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: questions.flatMap((question, index) => [
          new Paragraph({
            children: [
              new TextRun({
                text: `Question ${index + 1}: ${question.question}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Correct Answer: ${question.options[question.correctAnswer]}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Incorrect Answers:`,
                bold: true,
              }),
            ],
          }),
          ...question.options
            .filter((_, i) => i !== question.correctAnswer)
            .map(
              (option) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `- ${option}`,
                    }),
                  ],
                })
            ),
          new Paragraph({
            children: [
              new TextRun({
                text: `Explanation: ${question.explanation}`,
                italics: true,
              }),
            ],
          }),
          new Paragraph({}),
        ]),
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'quiz_content.docx');
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="quiz-modal-title"
      aria-describedby="quiz-modal-description"
    >
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-8 rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        {/* Download icon button in the top-left corner */}
        <IconButton
          onClick={handleDownload}
          color="primary"
          className="absolute top-2 left-2"
          aria-label="download content"
        >
          <DownloadIcon />
        </IconButton>

        {!showResult && questions && questions.length > 0 ? (
          <div className="space-y-6">
            <Typography variant="h5" component="h2" className="font-bold text-center">
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
            <Typography variant="body1" className="text-lg">
              {questions[currentQuestion].question}
            </Typography>
            <FormControl component="fieldset" className="w-full">
              <RadioGroup value={selectedAnswer} onChange={handleAnswerChange} className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio color={isDarkMode ? 'white' : 'black'} />}
                    label={<span className={`text-base ${showExplanation ? 'text-black' : ''}`}>{option}</span>}
                    className={`rounded-lg p-2 transition-colors ${
                      showExplanation
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'bg-green-200 text-black' // Thêm class text-black
                          : selectedAnswer === index
                          ? 'bg-red-200 text-black' // Thêm class text-black
                          : ''
                        : selectedAnswer === index
                        ? isDarkMode
                          ? 'bg-blue-700'
                          : 'bg-blue-100'
                        : ''
                    }`}
                    disabled={showExplanation}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {showExplanation && (
              <Box className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Typography variant="body1" className="font-semibold">
                  Explanation:
                </Typography>
                <Typography variant="body2">
                  {questions[currentQuestion].explanation}
                </Typography>
              </Box>
            )}
            <Button
              onClick={showExplanation ? handleNextQuestion : handleNext}
              variant="contained"
              color="primary"
              disabled={selectedAnswer === null}
              className="w-full py-3 text-lg font-semibold rounded-lg"
            >
              {showExplanation
                ? currentQuestion + 1 === questions.length
                  ? 'Finish'
                  : 'Next Question'
                : 'Check Answer'}
            </Button>
          </div>
        ) : questions && questions.length > 0 ? (
          <div className="space-y-6 text-center">
            <Typography variant="h4" component="h2" className="font-bold">
              Quiz Result
            </Typography>
            <Typography variant="h6" className="font-semibold">
              You scored {score} out of {questions.length}
            </Typography>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleRestart} variant="contained" color="primary" className="py-2 px-6 text-base font-semibold rounded-lg">
                Restart Quiz
              </Button>
              <Button onClick={onClose} variant="outlined" color="primary" className="py-2 px-6 text-base font-semibold rounded-lg">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <Typography variant="body1" className="text-center">
            No questions available.
          </Typography>
        )}
      </div>
    </Modal>
  );
};

export default QuizModal;
