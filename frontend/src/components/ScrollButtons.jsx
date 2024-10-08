import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StyledFab } from './StyledComponents';

const ScrollButtons = ({ isDarkMode }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
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
    </>
  );
};

export default ScrollButtons;
