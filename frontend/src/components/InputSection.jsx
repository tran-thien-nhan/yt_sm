<<<<<<< HEAD
import React from 'react';
import { FormControl, InputLabel, Slider, Typography, Select, MenuItem } from '@mui/material';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails, StyledSelect, StyledMenuItem } from './StyledComponents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';

const InputSection = ({ inputExpanded, setInputExpanded, inputText, setInputText, selectedPrompt, setSelectedPrompt, summaryLength, setSummaryLength, handleSummarize, isLoading, isDarkMode, selectedLanguage, setSelectedLanguage }) => {
=======
import React, { useState } from 'react';
import { FormControl, InputLabel, Typography, Select, MenuItem, Chip } from '@mui/material';
import { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails, StyledSelect, StyledMenuItem } from './StyledComponents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';

const InputSection = ({ inputExpanded, setInputExpanded, inputText, setInputText, selectedPrompt, setSelectedPrompt, summaryLength, setSummaryLength, handleSummarize, isLoading, isDarkMode, selectedLanguage, setSelectedLanguage, customPrompt, setCustomPrompt, selectedIeltsTypes, setSelectedIeltsTypes, selectedIeltsListeningTypes, setSelectedIeltsListeningTypes }) => {
    const [selectedCategory, setSelectedCategory] = useState('');

    const promptCategories = {
        'Tóm tắt và Giải thích': [
            { value: 'specific', label: 'Cụ thể hơn' },
            { value: 'detailed', label: 'Giải thích chi tiết' },
            { value: 'summary', label: 'Tóm tắt ngắn gọn' },
            { value: 'bullet', label: 'Gạch đầu dòng ngắn gọn' },
            { value: '5w1h', label: 'Tóm tắt 5W1H' },
        ],
        'Phương pháp Giải thích': [
            { value: 'feynman', label: 'Giải thích bằng phương pháp feynman' },
            { value: 'analogies', label: 'Giải thích bằng phép loại suy' },
            { value: 'eli5', label: 'Giải thích như tôi 5 tuổi (ELI5)' },
            { value: 'rubber_duck', label: 'Giải thích cho vịt cao su' },
        ],
        'Lập trình và Kỹ thuật': [
            { value: 'code', label: 'Code cụ thể và giải thích' },
            { value: 'specific_language', label: 'Hướng dẫn cụ thể trong 1 ngôn ngữ' },
            { value: 'code_review', label: 'Đánh giá code như senior dev' },
            { value: 'system_design', label: 'Phân tích thiết kế hệ thống' },
            { value: 'algorithm_breakdown', label: 'Phân tích thuật toán chi tiết' },
            { value: 'debug_strategy', label: 'Chiến lược debug' },
            { value: 'code_optimization', label: 'Tối ưu hóa code' },
            { value: 'design_patterns', label: 'Áp dụng design patterns' },
            { value: 'tech_stack_comparison', label: 'So sánh tech stack' },
            { value: 'code_to_pseudocode', label: 'Chuyển đổi code thành pseudocode' },
            { value: 'pseudocode_to_code', label: 'Chuyển đổi pseudocode thành code' },
            { value: 'time_complexity', label: 'Phân tích độ phức tạp thời gian' },
            { value: 'space_complexity', label: 'Phân tích độ phức tạp không gian' },
            { value: 'code_smells', label: 'Phát hiện code smells' },
            { value: 'refactoring_suggestions', label: 'Đề xuất refactoring' },
            { value: 'testing_strategies', label: 'Chiến lược kiểm thử' },
            { value: 'api_design', label: 'Thiết kế API RESTful' },
            { value: 'database_schema', label: 'Thiết kế schema cơ sở dữ liệu' },
            { value: 'security_analysis', label: 'Phân tích bảo mật' },
        ],
        'Phân tích và Tư duy': [
            { value: 'swot', label: 'Phân tích SWOT' },
            { value: 'expert', label: 'Góc nhìn chuyên gia' },
            { value: 'stoic', label: 'Đóng vai nhà khắc kỷ' },
            { value: 'socratic', label: 'Đặt câu hỏi theo phương pháp Socrates' },
            { value: 'first_principles', label: 'Phân tích theo nguyên lý cơ bản' },
            { value: 'future_trends', label: 'Dự đoán xu hướng tương lai' },
            { value: 'reverse_engineer', label: 'Phân tích ngược' },
            { value: 'mental_model', label: 'Áp dụng mô hình tư duy' },
            { value: 'triz', label: 'Giải quyết vấn đề bằng phương pháp TRIZ' },
        ],
        'Học tập và Ghi nhớ': [
            { value: 'anki_cards', label: 'Tạo thẻ Anki' },
            { value: 'mind_palace', label: 'Tạo thẻ Mind Palace' },
            { value: 'chunking', label: 'Tạo thẻ Chunking' },
            { value: 'active_recall', label: 'Tạo thẻ Active Recall' },
        ],
        'IELTS và Ngôn ngữ': [
            { value: 'ielts', label: 'Lọc từ vựng, collocation để học IELTS' },
            { value: 'ielts_reading_practice', label: 'Tạo bài tập IELTS Reading' },
            { value: 'ielts_listening_practice', label: 'Tạo bài tập IELTS Listening' },
            { value: 'ielts_writing_practice', label: 'Luyện IELTS Writing' },
            { value: 'ielts_speaking_practice', label: 'Luyện IELTS Speaking' },
            // { value: 'toeic_practice', label: 'Luyện TOEIC' },
            { value: 'english_conversation', label: 'Luyện tiếng Anh giao tiếp' },
        ],
        'Khác': [
            { value: 'guide', label: 'Hướng dẫn cụ thể' },
            { value: 'cv', label: 'Tạo câu hỏi phỏng vấn' },
            { value: 'cheat', label: 'Cheat sheet' },
            { value: 'copywriter', label: 'Chuyên gia copywriter' },
            { value: 'custom', label: 'Tùy chỉnh' },
        ],
    };

    useEffect(() => {
        if (selectedPrompt === 'astrology_today' || selectedPrompt === 'numerology_today') {
            setInputText(new Date().toLocaleString());
        }
    }, [selectedPrompt, setInputText]);

>>>>>>> c0075df (Reinitialize Git repository)
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
<<<<<<< HEAD
                                ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                                : 'bg-white text-black border-gray-300 placeholder-gray-500'
=======
                            ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                            : 'bg-white text-black border-gray-300 placeholder-gray-500'
>>>>>>> c0075df (Reinitialize Git repository)
                            }`}
                        rows="6"
                        placeholder="Enter your text to summarize or view transcript"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
<<<<<<< HEAD
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
=======
                    {(selectedPrompt === 'ielts_reading_practice' || selectedPrompt === 'ielts_listening_practice') && (
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Chú ý: Hãy sao chép một đoạn văn từ video YouTube và dán vào đây để tạo bài tập IELTS.
                        </p>
                    )}
                </div>
                <div className="mb-4 md:mb-6">
                    <FormControl fullWidth>
                        <InputLabel id="category-select-label" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                            Chọn danh mục
                        </InputLabel>
                        <Select
                            labelId="category-select-label"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedPrompt('');
                            }}
                            className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                        >
                            {Object.keys(promptCategories).map((category) => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                {selectedCategory && (
                    <div className="mb-4 md:mb-6">
                        <FormControl fullWidth>
                            <InputLabel id="prompt-select-label" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                Chọn kiểu tóm tắt
                            </InputLabel>
                            <Select
                                labelId="prompt-select-label"
                                value={selectedPrompt}
                                onChange={(e) => setSelectedPrompt(e.target.value)}
                                className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                            >
                                {promptCategories[selectedCategory].map((prompt) => (
                                    <MenuItem key={prompt.value} value={prompt.value}>{prompt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                )}
                {selectedPrompt === 'custom' && (
                    <div className="mb-4 md:mb-6">
                        <textarea
                            className={`w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                                : 'bg-white text-black border-gray-300 placeholder-gray-500'
                                }`}
                            rows="3"
                            placeholder="Nhập prompt tùy chỉnh của bạn"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                        ></textarea>
                    </div>
                )}
>>>>>>> c0075df (Reinitialize Git repository)
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
<<<<<<< HEAD
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
=======
                {(selectedPrompt === 'astrology' || selectedPrompt === 'numerology') && (
                    <div className="mb-4 md:mb-6">
                        <textarea
                            className={`w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                                : 'bg-white text-black border-gray-300 placeholder-gray-500'
                                }`}
                            rows="3"
                            placeholder={selectedPrompt === 'astrology'
                                ? "Nhập ngày tháng năm sinh, giờ sinh (nếu có), nơi sinh, giới tính"
                                : "Nhập họ tên đầy đủ, ngày tháng năm sinh"
                            }
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        ></textarea>
                    </div>
                )}
                {(selectedPrompt === 'astrology_today' || selectedPrompt === 'numerology_today') && (
                    <div className="mb-4 md:mb-6">
                        <input
                            type="text"
                            className={`w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                                : 'bg-white text-black border-gray-300 placeholder-gray-500'
                                }`}
                            placeholder={selectedPrompt === 'astrology_today'
                                ? "Nhập cung hoàng đạo của bạn"
                                : "Nhập con số chủ đạo của bạn (nếu không biết, hãy nhập ngày sinh của bạn)"
                            }
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </div>
                )}
                {selectedPrompt === 'ielts_reading_practice' && (
                    <div className="mb-4 md:mb-6">
                        <FormControl fullWidth>
                            <InputLabel id="ielts-types-label" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                Chọn dạng bài IELTS Reading
                            </InputLabel>
                            <Select
                                labelId="ielts-types-label"
                                multiple
                                value={selectedIeltsTypes}
                                onChange={(e) => setSelectedIeltsTypes(e.target.value)}
                                className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                                renderValue={(selected) => (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                style={{
                                                    backgroundColor: isDarkMode ? '#4a5568' : '#e2e8f0',
                                                    color: isDarkMode ? 'white' : 'black',
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            >
                                <MenuItem value="matching_headings">Matching Headings</MenuItem>
                                <MenuItem value="matching_paragraph_information">Matching Paragraph Information</MenuItem>
                                <MenuItem value="matching_features">Matching Features</MenuItem>
                                <MenuItem value="matching_sentence_endings">Matching Sentence Endings</MenuItem>
                                <MenuItem value="true_false_not_given">True/False/Not Given</MenuItem>
                                <MenuItem value="yes_no_not_given">Yes/No/Not Given</MenuItem>
                                <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                <MenuItem value="choose_a_title">Choose a Title</MenuItem>
                                <MenuItem value="short_answers">Short Answers</MenuItem>
                                <MenuItem value="sentence_completion">Sentence Completion</MenuItem>
                                <MenuItem value="summary_completion">Summary Completion</MenuItem>
                                <MenuItem value="table_completion">Table Completion</MenuItem>
                                <MenuItem value="flow_chart_completion">Flow Chart Completion</MenuItem>
                                <MenuItem value="diagram_completion">Diagram Completion</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}
                {selectedPrompt === 'ielts_listening_practice' && (
                    <div className="mb-4 md:mb-6">
                        <FormControl fullWidth>
                            <InputLabel id="ielts-listening-types-label" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                Chọn dạng bài IELTS Listening
                            </InputLabel>
                            <Select
                                labelId="ielts-listening-types-label"
                                multiple
                                value={selectedIeltsListeningTypes}
                                onChange={(e) => setSelectedIeltsListeningTypes(e.target.value)}
                                className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                                renderValue={(selected) => (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                style={{
                                                    backgroundColor: isDarkMode ? '#4a5568' : '#e2e8f0',
                                                    color: isDarkMode ? 'white' : 'black',
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            >
                                <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                <MenuItem value="matching">Matching</MenuItem>
                                <MenuItem value="plan_map_diagram_labelling">Plan/Map/Diagram Labelling</MenuItem>
                                <MenuItem value="form_completion">Form Completion</MenuItem>
                                <MenuItem value="note_completion">Note Completion</MenuItem>
                                <MenuItem value="table_completion">Table Completion</MenuItem>
                                <MenuItem value="flow_chart_completion">Flow-chart Completion</MenuItem>
                                <MenuItem value="summary_completion">Summary Completion</MenuItem>
                                <MenuItem value="sentence_completion">Sentence Completion</MenuItem>
                                <MenuItem value="short_answer">Short Answer</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}
>>>>>>> c0075df (Reinitialize Git repository)
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