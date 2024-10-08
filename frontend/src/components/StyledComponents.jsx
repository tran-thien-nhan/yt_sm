import { styled } from '@mui/material/styles';
import { Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, Fab } from '@mui/material';

export const CustomAccordion = styled(Accordion)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
}));

export const CustomAccordionSummary = styled(AccordionSummary)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100],
    '& .MuiAccordionSummary-content': {
        color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
    },
    '& .MuiSvgIcon-root': {
        color: isDarkMode ? theme.palette.common.white : theme.palette.text.secondary,
    },
}));

export const CustomAccordionDetails = styled(AccordionDetails)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
}));

export const StyledSelect = styled(Select)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300],
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? theme.palette.grey[600] : theme.palette.grey[400],
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme, isDarkMode }) => ({
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.background.paper,
    color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
    '&:hover': {
        backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.action.hover,
    },
    '&.Mui-selected': {
        backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.action.selected,
    },
}));

export const StyledFab = styled(Fab)(({ theme, isDarkMode }) => ({
    position: 'fixed',
    right: '20px',
    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white,
    color: isDarkMode ? theme.palette.common.white : theme.palette.grey[800],
    '&:hover': {
        backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[200],
    },
}));
