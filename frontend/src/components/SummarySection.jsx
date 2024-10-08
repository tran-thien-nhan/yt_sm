import React from 'react';
import { Button } from '@mui/material';
import { Share } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formatSummary } from '../helper';

const SummarySection = ({ summary, handleCopy, handleShare, copyFeedback, isDarkMode }) => {
  return (
    <div className="relative">
      <div className={`w-full p-3 md:p-4 border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-black'} rounded-md`}>
        {formatSummary(summary)}
      </div>
      <div className="absolute top-2 right-2 flex">
        <Button
          onClick={handleCopy}
          className="p-1 md:p-2 rounded-md bg-green-500 hover:bg-green-600 text-white mr-2"
          aria-label="copy"
        >
          <ContentCopyIcon />
        </Button>
        <Button
          onClick={handleShare}
          className="p-1 md:p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
          aria-label="share"
        >
          <Share />
        </Button>
      </div>
      {copyFeedback && (
        <span className="absolute top-2 right-20 text-green-600 text-sm">{copyFeedback}</span>
      )}
    </div>
  );
};

export default SummarySection;