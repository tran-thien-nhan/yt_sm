import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
// Update the import statement to use the correct path
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails } from './StyledComponents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TrizAnalysisSection = ({ trizAnalysis, trizSolution, isDarkMode }) => {
  return (
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
  );
};

export default TrizAnalysisSection;