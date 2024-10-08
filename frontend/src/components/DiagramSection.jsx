import React from 'react';
import { Grid, FormControl, InputLabel, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails, StyledSelect, StyledMenuItem } from './StyledComponents';
import DiagramComponent from '../DiagramComponent';

const DiagramSection = ({ summary, isDarkMode, diagramType, setDiagramType, showDiagram, handleCreateDiagram, diagramKey }) => {
    return (
        <CustomAccordion className="mt-4" isDarkMode={isDarkMode}>
            <CustomAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="diagram-content"
                id="diagram-header"
                isDarkMode={isDarkMode}
            >
                <Typography>Diagram</Typography>
            </CustomAccordionSummary>
            <CustomAccordionDetails isDarkMode={isDarkMode}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="diagram-type-label">Loại biểu đồ</InputLabel>
                            <StyledSelect
                                labelId="diagram-type-label"
                                value={diagramType}
                                onChange={(e) => setDiagramType(e.target.value)}
                                isDarkMode={isDarkMode}
                            >
                                <StyledMenuItem value="flowchart" isDarkMode={isDarkMode}>Flowchart</StyledMenuItem>
                                <StyledMenuItem value="mindmap" isDarkMode={isDarkMode}>Mind Map</StyledMenuItem>
                                <StyledMenuItem value="classDiagram" isDarkMode={isDarkMode}>Class Diagram</StyledMenuItem>
                                <StyledMenuItem value="sequence" isDarkMode={isDarkMode}>Sequence Diagram</StyledMenuItem>
                                <StyledMenuItem value="erDiagram" isDarkMode={isDarkMode}>ER Diagram</StyledMenuItem>
                                <StyledMenuItem value="userJourney" isDarkMode={isDarkMode}>User Journey</StyledMenuItem>
                                <StyledMenuItem value="zenuml" isDarkMode={isDarkMode}>ZenUML</StyledMenuItem>
                                <StyledMenuItem value="stateDiagram" isDarkMode={isDarkMode}>State Diagram</StyledMenuItem>
                                <StyledMenuItem value="block" isDarkMode={isDarkMode}>Block Diagram</StyledMenuItem>
                                <StyledMenuItem value="architect" isDarkMode={isDarkMode}>Architecture Diagram</StyledMenuItem>
                            </StyledSelect>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateDiagram}
                            fullWidth
                            sx={{ height: '100%' }}
                        >
                            Tạo biểu đồ
                        </Button>
                    </Grid>
                </Grid>
                {showDiagram && (
                    <div className="mt-4">
                        <DiagramComponent
                            key={diagramKey}
                            summary={summary}
                            diagramType={diagramType}
                            setDiagramType={setDiagramType}
                        />
                    </div>
                )}
            </CustomAccordionDetails>
        </CustomAccordion>
    );
};

export default DiagramSection;
