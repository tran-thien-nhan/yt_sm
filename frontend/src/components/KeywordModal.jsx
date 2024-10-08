import React from 'react';
import { Modal, Box, Typography, Chip } from '@mui/material';

const KeywordModal = ({ isOpen, onClose, keywords, handleKeywordClick, isDarkMode, theme }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
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
  );
};

export default KeywordModal;