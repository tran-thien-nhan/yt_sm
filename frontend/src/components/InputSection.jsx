import React from 'react';
import { FormControl, InputLabel, Slider, Typography, Select, MenuItem } from '@mui/material';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails, StyledSelect, StyledMenuItem } from './StyledComponents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';

const InputSection = ({ inputExpanded, setInputExpanded, inputText, setInputText, selectedPrompt, setSelectedPrompt, summaryLength, setSummaryLength, handleSummarize, isLoading, isDarkMode, selectedLanguage, setSelectedLanguage }) => {
    return (
        <CustomAccordion expanded={inputExpanded} onChange={() => setInputExpanded(!inputExpanded)} isDarkMode={isDarkMode}>
            <CustomAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="input-content"
                id="input-header"
                isDarkMode={isDarkMode}
            >
                <Typography>Input Text and Options</Typography>
            </CustomAccordionSummary>
            <CustomAccordionDetails isDarkMode={isDarkMode}>
                <div className="mb-4 md:mb-6">
                    <textarea
                        className={`w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                                : 'bg-white text-black border-gray-300 placeholder-gray-500'
                            }`}
                        rows="6"
                        placeholder="Enter your text to summarize or view transcript"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                </div>
                <div className="mb-4 md:mb-6">
                    <FormControl fullWidth>
                        <InputLabel id="summary-type-label" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                            Chọn kiểu tóm tắt
                        </InputLabel>
                        <StyledSelect
                            labelId="summary-type-label"
                            value={selectedPrompt}
                            onChange={(e) => setSelectedPrompt(e.target.value)}
                            isDarkMode={isDarkMode}
                        >
                            <StyledMenuItem value="default" isDarkMode={isDarkMode}>Mặc định</StyledMenuItem>
                            <StyledMenuItem value="specific" isDarkMode={isDarkMode}>Cụ thể hơn</StyledMenuItem>
                            <StyledMenuItem value="detailed" isDarkMode={isDarkMode}>Giải thích chi tiết</StyledMenuItem>
                            <StyledMenuItem value="summary" isDarkMode={isDarkMode}>Tóm tắt ngắn gọn</StyledMenuItem>
                            <StyledMenuItem value="bullet" isDarkMode={isDarkMode}>Gạch đầu dòng ngắn gọn</StyledMenuItem>
                            <StyledMenuItem value="code" isDarkMode={isDarkMode}>Code cụ thể và giải thích</StyledMenuItem>
                            <StyledMenuItem value="guide" isDarkMode={isDarkMode}>Hướng dẫn cụ thể</StyledMenuItem>
                            <StyledMenuItem value="cv" isDarkMode={isDarkMode}>Tạo câu hỏi phỏng vấn</StyledMenuItem>
                            <StyledMenuItem value="feynman" isDarkMode={isDarkMode}>Giải thích bằng phương pháp feynman</StyledMenuItem>
                            <StyledMenuItem value="cheat" isDarkMode={isDarkMode}>Cheat sheet</StyledMenuItem>
                            <StyledMenuItem value="ielts" isDarkMode={isDarkMode}>Lọc từ vựng, collocation để học IELTS</StyledMenuItem>
                            <StyledMenuItem value="specific_language" isDarkMode={isDarkMode}>Hướng dẫn cụ thể trong 1 ngôn ngữ</StyledMenuItem>
                        </StyledSelect>
                    </FormControl>
                </div>
                {selectedPrompt === 'specific_language' && (
                    <div className="mb-4 md:mb-6">
                        <FormControl fullWidth>
                            <InputLabel id="language-select-label" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                Chọn ngôn ngữ lập trình
                            </InputLabel>
                            <Select
                                labelId="language-select-label"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                            >
                                <MenuItem value="java">Java</MenuItem>
                                <MenuItem value="go">Go</MenuItem>
                                <MenuItem value="nodejs">Node.js</MenuItem>
                                <MenuItem value="dotnet">.NET</MenuItem>
                                <MenuItem value="python">Python</MenuItem>
                                <MenuItem value="javascript">JavaScript</MenuItem>
                                <MenuItem value="typescript">TypeScript</MenuItem>
                                <MenuItem value="ruby">Ruby</MenuItem>
                                <MenuItem value="php">PHP</MenuItem>
                                <MenuItem value="swift">Swift</MenuItem>
                                <MenuItem value="kotlin">Kotlin</MenuItem>
                                <MenuItem value="rust">Rust</MenuItem>
                                <MenuItem value="cpp">C++</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}
                <div className="mb-4 md:mb-6">
                    <Typography gutterBottom>Độ dài tóm tắt (số từ)</Typography>
                    <Slider
                        value={summaryLength}
                        onChange={(e, newValue) => setSummaryLength(newValue)}
                        aria-labelledby="summary-length-slider"
                        valueLabelDisplay="auto"
                        step={50}
                        marks
                        min={50}
                        max={5000}
                    />
                </div>
                <button
                    className={`w-full py-2 px-4 rounded-md text-white font-semibold ${isLoading || !inputText ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    onClick={handleSummarize}
                    disabled={isLoading || !inputText}
                >
                    {isLoading ? <CircularProgress size={24} className="text-white" /> : 'Summarize'}
                </button>
            </CustomAccordionDetails>
        </CustomAccordion>
    );
};

export default InputSection;