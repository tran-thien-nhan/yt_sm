import React from 'react';
import { Modal, Box, Typography, Chip } from '@mui/material';

const PromptModal = ({ isOpen, onClose, suggestedPrompts, handlePromptClick, isDarkMode, theme }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="prompt-modal-title"
      aria-describedby="prompt-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', // Tăng chiều rộng lên 80% của màn hình
        maxWidth: 800, // Giới hạn chiều rộng tối đa
        maxHeight: '90vh', // Tăng chiều cao tối đa
        bgcolor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
        border: `2px solid ${isDarkMode ? theme.palette.grey[800] : theme.palette.grey[300]}`,
        boxShadow: 24,
        p: 4,
        color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
        overflowY: 'auto', // Thêm cuộn dọc
      }}>
        <Typography id="prompt-modal-title" variant="h6" component="h2" color="inherit">
          Đề xuất Prompts
        </Typography>
        <Box sx={{ mt: 2, maxHeight: 'calc(90vh - 100px)', overflowY: 'auto' }}> {/* Thêm Box mới với cuộn */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                  width: '100%', // Đảm bảo Chip sử dụng toàn bộ chiều rộng của cột
                  height: 'auto', // Cho phép Chip mở rộng theo chiều cao
                  '& .MuiChip-label': {
                    whiteSpace: 'normal', // Cho phép văn bản xuống dòng
                    wordBreak: 'break-word', // Ngắt từ khi cần thiết
                  },
                }}
              />
            ))}
          </div>
        </Box>
      </Box>
    </Modal>
  );
};

export default PromptModal;