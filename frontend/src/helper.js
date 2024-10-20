import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import scala from 'react-syntax-highlighter/dist/esm/languages/prism/scala';
import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import groovy from 'react-syntax-highlighter/dist/esm/languages/prism/groovy';
import perl from 'react-syntax-highlighter/dist/esm/languages/prism/perl';
import matlab from 'react-syntax-highlighter/dist/esm/languages/prism/matlab';
import r from 'react-syntax-highlighter/dist/esm/languages/prism/r';
import scheme from 'react-syntax-highlighter/dist/esm/languages/prism/scheme';
import lisp from 'react-syntax-highlighter/dist/esm/languages/prism/lisp';
import prolog from 'react-syntax-highlighter/dist/esm/languages/prism/prolog';
import haskell from 'react-syntax-highlighter/dist/esm/languages/prism/haskell';
import erlang from 'react-syntax-highlighter/dist/esm/languages/prism/erlang';
import clojure from 'react-syntax-highlighter/dist/esm/languages/prism/clojure';
import coffeescript from 'react-syntax-highlighter/dist/esm/languages/prism/coffeescript';
import trizData from './data/triz.json';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
<<<<<<< HEAD
=======
import arrowsData from './data/arrows.json';
import { apiKey } from './const';
>>>>>>> c0075df (Reinitialize Git repository)
// Đặt CodeBlock component ở đầu file
export const CodeBlock = ({ children, language }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(children);
    };

    return (
        <div className="relative mb-4">
            <SyntaxHighlighter
                language={language}
                style={tomorrow}
                customStyle={{
                    padding: '1em',
                    borderRadius: '0.5em',
                    fontSize: '0.9em',
                }}
            >
                {children}
            </SyntaxHighlighter>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm text-black"
            >
                Copy
            </button>
        </div>
    );
};

// Đặt formatText function ở đây
export const formatText = (text) => {
    // Convert markdown-like syntax to HTML
    return text
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
        .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^(\d+\. .*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/gim, '<br>');
};

// Sau đó định nghĩa formatSummary và formatAnswer
export const formatSummary = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        // Add text before the code block
        if (match.index > lastIndex) {
            parts.push(
                <div key={lastIndex} dangerouslySetInnerHTML={{ __html: formatText(text.slice(lastIndex, match.index)) }} />
            );
        }

        // Detect language if not specified
        const specifiedLang = match[1] || '';
        const codeContent = match[2].trim();
        const detectedLang = specifiedLang || detectLanguage(codeContent);

        // Add the code block with detected or specified language
        parts.push(
            <CodeBlock key={match.index} language={detectedLang}>
                {codeContent}
            </CodeBlock>
        );

        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last code block
    if (lastIndex < text.length) {
        parts.push(
            <div key={lastIndex} dangerouslySetInnerHTML={{ __html: formatText(text.slice(lastIndex)) }} />
        );
    }

    return parts;
};

export const formatAnswer = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        // Add text before the code block
        if (match.index > lastIndex) {
            parts.push(
                <div key={lastIndex} dangerouslySetInnerHTML={{ __html: formatText(text.slice(lastIndex, match.index)) }} />
            );
        }

        // Detect language if not specified
        const specifiedLang = match[1] || '';
        const codeContent = match[2].trim();
        const detectedLang = specifiedLang || detectLanguage(codeContent);

        // Add the code block with detected or specified language
        parts.push(
            <CodeBlock key={match.index} language={detectedLang}>
                {codeContent}
            </CodeBlock>
        );

        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last code block
    if (lastIndex < text.length) {
        parts.push(
            <div key={lastIndex} dangerouslySetInnerHTML={{ __html: formatText(text.slice(lastIndex)) }} />
        );
    }

    return parts;
};

export const detectLanguage = (code) => {
    // Common language patterns
    const patterns = {
        java: /\b(public|private|protected|class|interface|enum)\b/,
        python: /\b(def|import|from|class|if __name__ == (['"])__main__\2)\b/,
        javascript: /\b(function|const|let|var|=>)\b/,
        csharp: /\b(using|namespace|class|public|private|protected)\b/,
        cpp: /\b(#include|namespace|class|public:|private:|protected:)\b/,
        php: /(<\?php|\$\w+|function\s+\w+\s*\()/,
        ruby: /\b(def|class|module|require|attr_accessor)\b/,
        swift: /\b(func|class|struct|enum|var|let)\b/,
        go: /\b(package|import|func|type|struct)\b/,
        rust: /\b(fn|let|mut|struct|impl|pub|use)\b/,
        kotlin: /\b(fun|class|val|var|package|import)\b/,
        typescript: /\b(interface|type|namespace|declare)\b/,
        scala: /\b(def|val|var|object|trait|class)\b/,
        haskell: /\b(module|import|data|type|class|instance)\b/,
        lua: /\b(function|local|require)\b/,
        perl: /\b(sub|my|use|package)\b/,
        r: /\b(function|library|if|else|for|while)\b/,
        sql: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE)\b/i,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
        if (pattern.test(code)) {
            return lang;
        }
    }

    // If no specific language is detected, check for general code patterns
    if (/[{}()[\];]/.test(code)) {
        return 'code'; // Generic code
    }

    return 'text'; // Default if no code patterns are found
};

// Component hiển thị dữ liệu TRIZ từ tệp JSON
const RDSpecCapabilityMeans = ({ parameters }) => {
    const [trizData, setTrizData] = useState(null);

    useEffect(() => {
        fetch('/triz.json')
            .then(response => response.json())
            .then(data => setTrizData(data))
            .catch(error => console.error('Error loading TRIZ data:', error));
    }, []);

    if (!trizData) {
        return <div>Loading...</div>;
    }

    const rdParam = parameters && parameters.name
        ? trizData.parameters.find(p => p.name === parameters.name)
        : trizData.parameters.find(p => p.name === "R&D Spec/Capability/Means");

    const getInventivePrinciple = (number) => {
        return trizData.inventive_principles.find(p => p.number === number);
    };

    return (
        <div className="rd-spec-capability-means">
            <h2>{rdParam.name}</h2>
            <p>{rdParam.description}</p>

            <h3>Synonyms</h3>
            <ul>
                {rdParam.synonyms.map((synonym, index) => (
                    <li key={index}>{synonym}</li>
                ))}
            </ul>

            <h3>Always Consider Principles</h3>
            <ul>
                {rdParam.always_consider_principles.map(number => {
                    const principle = getInventivePrinciple(number);
                    return (
                        <li key={number}>
                            {principle.number}. {principle.name} - {principle.description}
                        </li>
                    );
                })}
            </ul>

            <h3>Averaged Principles</h3>
            <ul>
                {rdParam.averaged_principles.map(number => {
                    const principle = getInventivePrinciple(number);
                    return (
                        <li key={number}>
                            {principle.number}. {principle.name}
                        </li>
                    );
                })}
            </ul>

            <h3>Conflicting Parameters</h3>
            {Object.entries(rdParam.conflicting_principles).map(([param, principles]) => (
                <div key={param}>
                    <h4>{param}</h4>
                    <ul>
                        {principles.map(number => {
                            const principle = getInventivePrinciple(number);
                            return (
                                <li key={number}>
                                    {principle.number}. {principle.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
};

// Hàm phân tích TRIZ và sinh giải pháp sáng tạo
export const handleTrizAnalysis = async (summary, api, setIsLoading, setErrorMessage, setTrizAnalysis, setTrizSolution) => {
    if (!summary) {
        setErrorMessage('Please generate a summary first');
        return;
    }

    setIsLoading(true);
    let trizResponse;
    try {
        const trizDataString = JSON.stringify(trizData);
        const trizPrompt = `Dựa trên dữ liệu TRIZ sau đây:
        
        @triz.json
        ${trizDataString}

        Hãy phân tích bản tóm tắt sau và xác định:
        1. Các mâu thuẫn kỹ thuật chính, dịch sang tiếng Việt.
        2. Các tham số R&D Spec/Capability/Means liên quan nhất, dịch sang tiếng Việt.
        3. Các nguyên tắc sáng tạo (inventive principles) phù hợp nhất dựa trên các mâu thuẫn đã xác định, dịch sang tiếng Việt.
        4. Đề xuất các giải pháp sáng tạo dựa trên các nguyên tắc đã chọn, dịch sang tiếng Việt.

        Bản tóm tắt cần phân tích:
        "${summary}"

        Vui lòng trả lời theo định dạng JSON như sau:
        {
            "contradictions": [
                {"param1": "tên tham số 1", "param2": "tên tham số 2", "description": "mô tả mâu thuẫn"}
            ],
            "parameters": ["tên tham số 1", "tên tham số 2", ...],
            "principles": [{"number": số nguyên tắc, "name": "tên nguyên tắc", "description": "mô tả nguyên tắc"}],
            "solutions": ["giải pháp 1", "giải pháp 2", "giải pháp 3"]
        }`;

        trizResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
            {
                contents: [{ parts: [{ text: trizPrompt }] }]
            }
        );

        const responseText = trizResponse.data.candidates[0]?.content?.parts[0]?.text;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
        let trizAnalysisResult;
        if (jsonMatch) {
            try {
                trizAnalysisResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.log('Problematic JSON string:', jsonMatch[1] || jsonMatch[0]);
                throw new Error(`Invalid JSON in response: ${parseError.message}`);
            }
        } else {
            throw new Error("Không tìm thấy JSON hợp lệ trong phản hồi");
        }

        const trizAnalysisContent = (
            <div>
                <Typography variant="h6">Các mâu thuẫn kỹ thuật:</Typography>
                <List>
                    {trizAnalysisResult.contradictions.map((contradiction, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`${contradiction.param1} vs ${contradiction.param2}`}
                                secondary={contradiction.description}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6">Các tham số TRIZ liên quan:</Typography>
                <List>
                    {trizAnalysisResult.parameters.map((param, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={param}
                                secondary={trizData.parameters.find(p => p.name === param)?.description}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6" sx={{ mt: 2 }}>Các nguyên tắc sáng tạo liên quan:</Typography>
                <List>
                    {trizAnalysisResult.principles.map((principle, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`${principle.number}. ${principle.name}`}
                                secondary={principle.description}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6" sx={{ mt: 2 }}>Giải pháp sáng tạo:</Typography>
                <List>
                    {trizAnalysisResult.solutions.map((solution, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${index + 1}. ${solution}`} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        setTrizAnalysis(trizAnalysisContent);
        setTrizSolution(trizAnalysisResult.solutions.join('\n\n'));
    } catch (error) {
        console.error('Error in TRIZ analysis:', error);
        setErrorMessage('Error occurred during TRIZ analysis: ' + error.message);
        console.log('Full response:', trizResponse?.data);
    } finally {
        setIsLoading(false);
    }
};

<<<<<<< HEAD

export const handleSummarize = async (inputText, selectedPrompt, summaryLength, api, setIsLoading, setSummary, setErrorMessage, setInputExpanded, setKeywords, setCodeSections, setInterviewQuestions, selectedLanguage, setSelectedLanguage) => {
=======
export const handleMoreSolutions = async (trizAnalysis, api, setTrizSolution, setTrizMoreSolutions) => {
    if (!api) {
        setTrizMoreSolutions('API key is missing. Please provide a valid API key.');
        return;
    }

    try {
        // Trích xuất thông tin từ trizAnalysis
        let trizAnalysisText = '';
        if (typeof trizAnalysis === 'object' && trizAnalysis !== null) {
            trizAnalysisText = JSON.stringify(trizAnalysis, null, 2);
        } else if (typeof trizAnalysis === 'string') {
            trizAnalysisText = trizAnalysis;
        } else {
            throw new Error('Invalid trizAnalysis format');
        }

        const prompt = `Dựa trên phân tích TRIZ sau đây:

${trizAnalysisText}

Hãy tổng hợp và tạo ra 3-5 cách giải quyết mới bằng cách kết hợp từ các giải pháp đã đề xuất. Mỗi cách mới nên được mô tả chi tiết và giải thích cách nó kết hợp các ý tưởng từ các giải pháp gốc và hướng dẫn cực kỳ cụ thể và chi tiết cách làm và giải thích bằng tiếng việt. Vui lòng đưa ra các giải pháp mới, sáng tạo và chi tiết dựa trên sự kết hợp của các nguyên tắc và giải pháp trên.

Nếu thông tin không đầy đủ, hãy yêu cầu thêm thông tin về:
1. Các mâu thuẫn kỹ thuật cụ thể
2. Các tham số TRIZ liên quan
3. Các nguyên tắc sáng tạo liên quan
4. Giải pháp sáng tạo đã đề xuất

Sau đó, dựa trên thông tin có sẵn, hãy đề xuất các giải pháp mới nhất có thể.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const moreSolutions = response.data.candidates[0]?.content?.parts[0]?.text;
        if (moreSolutions) {
            setTrizMoreSolutions(moreSolutions);
        } else {
            throw new Error('Không có giải pháp mới được tạo ra.');
        }
    } catch (error) {
        console.error('Error generating more solutions:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
            setTrizMoreSolutions(`Đã xảy ra lỗi khi tạo thêm giải pháp: ${error.response.data.error.message}`);
        } else if (error.request) {
            console.error('Error request:', error.request);
            setTrizMoreSolutions('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
        } else {
            console.error('Error message:', error.message);
            setTrizMoreSolutions('Đã xảy ra lỗi khi tạo thêm giải pháp. Vui lòng kiểm tra API key và thử lại.');
        }
    }
};

export const handleSummarize = async (inputText, selectedPrompt, summaryLength, api, setIsLoading, setSummary, setErrorMessage, setInputExpanded, setKeywords, setCodeSections, setInterviewQuestions, selectedLanguage, setSelectedLanguage, customPrompt, selectedIeltsTypes, selectedIeltsListeningTypes) => {
>>>>>>> c0075df (Reinitialize Git repository)
    if (!inputText) return;

    setIsLoading(true);
    setSummary('');
    setErrorMessage('');

    try {
        let promptText = '';

<<<<<<< HEAD
        if (selectedPrompt === 'specific') {
            promptText = `cụ thể hơn bằng tiếng việt: ${inputText}`;
        } else if (selectedPrompt === 'detailed') {
            promptText = `giải thích và hướng dẫn cụ thể hơn có ví dụ cụ thể, nếu có code thì code cụ thể, cực kỳ chi tiết và viết dài hơn bằng tiếng việt: ${inputText}`;
=======
        if (selectedPrompt === 'custom') {
            promptText = `nói bằng tiếng việt, ${customPrompt}, cực kỳ cụ thể và chi tiết, có ví dụ cụ thể, có code cụ thể nếu có thể: "${inputText}"`;
        } else if (selectedPrompt === 'specific') {
            promptText = `cụ thể hơn bằng tiếng việt: ${inputText}`;
        } else if (selectedPrompt === 'detailed') {
            promptText = `giải thích và hướng dẫn cực kỳ cụ thể hơn có ví dụ cụ thể, nếu có code thì code cụ thể, cực kỳ chi tiết và viết dài hơn bằng tiếng việt: ${inputText}`;
>>>>>>> c0075df (Reinitialize Git repository)
        } else if (selectedPrompt === 'summary') {
            promptText = `tóm tắt bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
        } else if (selectedPrompt === 'bullet') {
            promptText = `ngắn gọn, trong những gạch đầu dòng bằng tiếng việt, demo được bằng code nếu có thể \nno yapping: ${inputText}`;
        } else if (selectedPrompt === 'code') {
            promptText = `code cụ thể và giải thích bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
        } else if (selectedPrompt === 'guide') {
            promptText = `hướng dẫn cực kỳ cụ thể và chi tiết cách làm và giải thích bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
        } else if (selectedPrompt === 'cv') {
            promptText = `tạo các câu hỏi phỏng vấn bằng tiếng việt và câu trả lời bằng tiếng việt dựa trên nội dung sau để tôi nạp vào anki, demo được bằng code nếu có thể trong mỗi câu trả lời : ${inputText}`;
        } else if (selectedPrompt === 'feynman') {
            promptText = `nói bằng tiếng việt, giải thích bằng phương pháp feynman cho nội dung sau, demo được bằng code nếu có thể: ${inputText}`;
        } else if (selectedPrompt === 'cheat') {
            promptText = `tạo cheat sheet bằng tiếng việt, demo được bằng code nếu có thể: ${inputText}`;
        } else if (selectedPrompt === 'specific_language') {
            promptText = `hướng dẫn cực kỳ cụ thể và chi tiết cách làm và giải thích bằng tiếng việt, sử dụng ngôn ngữ lập trình ${selectedLanguage}. Đảm bảo tất cả các ví dụ và code đều được viết bằng ${selectedLanguage}: ${inputText}`;
        } else if (selectedPrompt === 'ielts') {
            promptText = `Analyze the following text and extract key vocabulary and collocations suitable for IELTS preparation. For each item, provide:

            1. Word or Collocation: (in English)
            - Part of Speech: (e.g., noun, verb, adjective, adverb, phrase)
            - Definition: (in Vietnamese)
            - Example 1: (a complex sentence in Vietnamese using the word/collocation like in ielts writing task 2 or ielts speaking)
            - Example 2: (a complex sentence in English using the word/collocation like in ielts writing task 2 or ielts speaking)
            - IELTS Topic: (relevant IELTS topic area, e.g., Environment, Education, Technology)
            - Synonyms: (2-3 synonyms in English, if applicable)
            - mẹo ghi nhớ: (cách ghi nhớ từ vựng này, bằng tiếng việt và phương pháp ghi nhớ qua gốc từ)
            
            Please provide in this format not table format, focusing on advanced vocabulary and useful collocations for IELTS. Ensure a mix of words and phrases that would be particularly beneficial for IELTS Writing and Speaking tasks.
            
            Text to analyze:
            ${inputText}`;
<<<<<<< HEAD
        } else {
            promptText = `${selectedPrompt} trong khoảng ${summaryLength} từ: ${inputText}`;
=======
        } else if (selectedPrompt === 'triz') {
            promptText = `Dựa trên dữ liệu TRIZ sau đây:

    @triz.json
    ${JSON.stringify(trizData)}

    Hãy phân tích vấn đề sau và xác định:
    1. Các mâu thuẫn kỹ thuật chính, dịch sang tiếng Việt.
    2. Các tham số R&D Spec/Capability/Means liên quan nhất, dịch sang tiếng Việt.
    3. Các nguyên tắc sáng tạo (inventive principles) phù hợp nhất dựa trên các mâu thuẫn đã xác định, dịch sang tiếng Việt.
    4. Đề xuất các giải pháp sáng tạo dựa trên các nguyên tắc đã chọn, dịch sang tiếng Việt.
    5. Tổng hợp và tạo ra 3-5 cách giải quyết mới bằng cách kết hợp từ các giải pháp đã đề xuất. Mỗi cách mới nên được mô tả chi tiết và giải thích cách nó kết hợp các ý tưởng từ các giải pháp gốc.

    Vấn đề cần phân tích:
    "${inputText}"

    Vui lòng trả lời theo định dạng sau:

    Mâu thuẫn kỹ thuật chính:
    1. [Mô tả mâu thuẫn 1]
    2. [Mô tả mâu thuẫn 2]
    ...

    Các tham số R&D Spec/Capability/Means liên quan:
    - [Tham số 1]
    - [Tham số 2]
    ...

    Các nguyên tắc sáng tạo phù hợp:
    1. [Số nguyên tắc]. [Tên nguyên tắc]: [Mô tả nguyên tắc]
    2. [Số nguyên tắc]. [Tên nguyên tắc]: [Mô tả nguyên tắc]
    ...

    Đề xuất giải pháp sáng tạo:
    1. [Giải pháp 1]
    2. [Giải pháp 2]
    ...

    Giải pháp sáng tạo mới (kết hợp):
    1. [Giải pháp mới 1]: [Mô tả chi tiết và giải thích cách kết hợp]
    2. [Giải pháp mới 2]: [Mô tả chi tiết và giải thích cách kết hợp]
    3. [Giải pháp mới 3]: [Mô tả chi tiết và giải thích cách kết hợp]
    ...

    Hãy đảm bảo rằng tất cả các phần đều được dịch sang tiếng Việt và cung cấp hướng dẫn cực kỳ cụ thể và chi tiết cách thực hiện mỗi giải pháp.`;
        } else if (selectedPrompt === 'swot') {
            promptText = `Phân tích SWOT (Điểm mạnh, Điểm yếu, Cơ hội, Thách thức) cho nội dung sau bằng tiếng Việt. Hãy cung cấp phân tích chi tiết cho mỗi khía cạnh:

            Điểm mạnh (Strengths):
            - [Liệt kê và giải thích chi tiết các điểm mạnh]

            Điểm yếu (Weaknesses):
            - [Liệt kê và giải thích chi tiết các điểm yếu]

            Cơ hội (Opportunities):
            - [Liệt kê và giải thích chi tiết các cơ hội]

            Thách thức (Threats):
            - [Liệt kê và giải thích chi tiết các thách thức]

            Kết luận và đề xuất:
            [Tóm tắt các điểm chính và đưa ra đề xuất dựa trên phân tích SWOT]

            Nội dung cần phân tích: "${inputText}"`;
        } else if (selectedPrompt === '5w1h') {
            promptText = `Tóm tắt nội dung sau theo phương pháp 5W1H bằng tiếng Việt. Hãy trả lời chi tiết cho mỗi câu hỏi:

            What (Cái gì): [Mô tả chi tiết về sự việc, sự kiện hoặc vấn đề chính]

            Who (Ai): [Xác định và mô tả các cá nhân, nhóm hoặc tổ chức liên quan]

            When (Khi nào): [Xác định thời gian, ngày tháng hoặc khoảng thời gian liên quan]

            Where (Ở đâu): [Mô tả địa điểm hoặc bối cảnh cụ thể]

            Why (Tại sao): [Giải thích lý do, động cơ hoặc nguyên nhân]

            How (Như thế nào): [Mô tả cách thức, phương pháp hoặc quá trình]

            Kết luận: [Tóm tắt các điểm chính và đưa ra nhận xét tổng quát]

            Nội dung cần tóm tắt: "${inputText}"`;
        } else if (selectedPrompt === 'expert') {
            promptText = `Hãy phân tích và tóm tắt nội dung sau từ góc nhìn của một chuyên gia trong lĩnh vực liên quan bằng tiếng Việt. Bao gồm:

            1. Tổng quan: [Tóm tắt ngắn gọn về nội dung chính]

            2. Phân tích chuyên sâu:
               - [Điểm 1: Phân tích chi tiết]
               - [Điểm 2: Phân tích chi tiết]
               - [Điểm 3: Phân tích chi tiết]
               ...

            3. Đánh giá chuyên môn:
               - Ưu điểm: [Liệt kê và giải thích]
               - Hạn chế: [Liệt kê và giải thích]

            4. So sánh với các nghiên cứu/thực tiễn hiện tại:
               [Đưa ra các so sánh và nhận xét]

            5. Đề xuất và hướng phát triển:
               [Đưa ra các đề xuất dựa trên phân tích chuyên gia]

            6. Kết luận:
               [Tóm tắt các điểm chính và đưa ra nhận định tổng thể]

            Nội dung cần phân tích: "${inputText}"`;
        } else if (selectedPrompt === 'stoic') {
            promptText = `Hãy phân tích và đưa ra lời khuyên cho vấn đề sau từ góc nhìn của một nhà triết học khắc kỷ nổi tiếng (như Marcus Aurelius, Seneca, hoặc Epictetus) bằng tiếng Việt. Bao gồm:

            1. Tổng quan vấn đề: [Tóm tắt ngắn gọn về nội dung chính]

            2. Phân tích từ góc nhìn khắc kỷ:
               - [Điểm 1: Phân tích chi tiết]
               - [Điểm 2: Phân tích chi tiết]
               - [Điểm 3: Phân tích chi tiết]

            3. Lời khuyên khắc kỷ:
               - [Lời khuyên 1]
               - [Lời khuyên 2]
               - [Lời khuyên 3]

            4. Trích dẫn liên quan:
               [Đưa ra 1-2 trích dẫn từ các nhà triết học khắc kỷ phù hợp với tình huống]

            5. Bài tập thực hành:
               [Đề xuất 1-2 bài tập thực hành theo triết lý khắc kỷ để giải quyết vấn đề]

            6. Kết luận:
               [Tóm tắt các điểm chính và đưa ra nhận định tổng thể từ góc nhìn khắc kỷ]

            Nội dung cần phân tích: "${inputText}"`;
        } else if (selectedPrompt === 'analogies') {
            promptText = `Giải thích nội dung sau bằng cách sử dụng các phép loại suy hoặc ẩn dụ. Hãy đưa ra ít nhất 3 phép loại suy khác nhau để giải thích vấn đề một cách dễ hiểu và sáng tạo. Mỗi phép loại suy nên bao gồm:

            1. Mô tả phép loại suy
            2. Giải thích cách phép loại suy liên quan đến vấn đề
            3. Ưu điểm và hạn chế của phép loại suy này

            Nội dung cần giải thích: "${inputText}"

            Hãy trả lời bằng tiếng Việt và đảm bảo các phép loại suy dễ hiểu đối với người không chuyên.`;
        }
        else if (selectedPrompt === 'socratic') {
            promptText = `Sử dụng phương pháp đặt câu hỏi Socrates để phân tích và khám phá sâu hơn về vấn đề sau. Hãy đưa ra một chuỗi ít nhất 5 câu hỏi, mỗi câu hỏi dựa trên câu trả lời giả định của câu hỏi trước đó. Mục tiêu là đào sâu vào các giả định, lý do và hệ quả của vấn đề. Cấu trúc như sau:

            1. Câu hỏi 1: [Câu hỏi]
               Phân tích: [Giải thích ngắn gọn về mục đích của câu hỏi]

            2. Câu hỏi 2: [Câu hỏi dựa trên câu trả lời giả định của câu hỏi 1]
               Phân tích: [Giải thích]

            [Tiếp tục với các câu hỏi tiếp theo]

            Kết luận: [Tóm tắt những hiểu biết chính có được từ chuỗi câu hỏi]

            Vấn đề cần phân tích: "${inputText}"

            Hãy trả lời bằng tiếng Việt và đảm bảo các câu hỏi thúc đẩy tư duy phản biện và khám phá sâu hơn về vấn đề.`;
        }
        else if (selectedPrompt === 'first_principles') {
            promptText = `Phân tích vấn đề sau theo phương pháp suy luận từ nguyên lý cơ bản (first principles reasoning). Hãy thực hiện các bước sau:

            1. Xác định vấn đề cốt lõi
            2. Phân解 vấn đề thành các thành phần cơ bản nhất
            3. Loại bỏ các giả định và định kiến
            4. Xây dựng lại giải pháp từ các nguyên lý cơ bản
            5. Đề xuất các giải pháp sáng tạo dựa trên phân tích

            Vấn đề cần phân tích: "${inputText}"

            Hãy trả lời bằng tiếng Việt và đảm bảo phân tích sâu sắc, logic và sáng tạo.`;
        }
        else if (selectedPrompt === 'future_trends') {
            promptText = `Dựa trên nội dung sau, hãy dự đoán và phân tích các xu hướng tương lai có thể xảy ra. Bao gồm:

            1. Tóm tắt ngắn gọn về tình hình hiện tại
            2. Xác định ít nhất 3 xu hướng chính có thể phát triển trong tương lai
            3. Cho mỗi xu hướng:
               - Mô tả chi tiết
               - Các yếu tố thúc đẩy xu hướng này
               - Tác động tiềm tàng (tích cực và tiêu cực)
               - Thời gian dự kiến xu hướng sẽ trở nên rõ rệt
            4. Đề xuất cách chuẩn bị hoặc thích ứng với các xu hướng này
            5. Kết luận tổng quát về tương lai của lĩnh vực/vấn đề này

            Nội dung cần phân tích: "${inputText}"

            Hãy trả lời bằng tiếng Việt và đảm bảo các dự đoán có cơ sở logic và dựa trên dữ liệu/xu hướng hiện tại.`;
        }
        else if (selectedPrompt === 'reverse_engineer') {
            promptText = `Thực hiện phân tích ngược (reverse engineering) cho vấn đề hoặc sản phẩm sau. Hãy làm theo các bước:

            1. Mô tả tổng quan về vấn đề/sản phẩm
            2. Xác định các thành phần hoặc chức năng chính
            3. Phân tích chi tiết từng thành phần:
               - Mục đích
               - Cách thức hoạt động
               - Công nghệ hoặc nguyên lý được sử dụng
            4. Xác định các mối quan hệ giữa các thành phần
            5. Đề xuất cách cải tiến hoặc tối ưu hóa
            6. Kết luận: Tóm tắt những hiểu biết chính có được từ quá trình phân tích ngược

            Vấn đề/sản phẩm cần phân tích: "${inputText}"

            Hãy trả lời bằng tiếng Việt và đảm bảo phân tích sâu sắc, chi tiết và có tính ứng dụng.`;
        }
        else if (selectedPrompt === 'anki_cards') {
            promptText = `Tạo bộ thẻ Anki từ nội dung sau đây. Mỗi thẻ nên bao gồm:
            1. Mặt trước: Câu hỏi hoặc khái niệm cần nhớ
            2. Mặt sau: Câu trả lời chi tiết, giải thích, và ví dụ (nếu có thể)
            3. Gợi ý: Một gợi ý ngắn để giúp nhớ câu trả lời
            4. Tags: Các từ khóa liên quan để phân loại thẻ

            Hãy tạo ít nhất 10 thẻ Anki từ nội dung sau, đảm bảo bao quát các điểm chính và khái niệm quan trọng. Trả lời bằng tiếng Việt.

            Nội dung cần chuyển thành thẻ Anki: "${inputText}"`;
        }
        else if (selectedPrompt === 'mind_palace') {
            promptText = `Sử dụng kỹ thuật cung điện trí nhớ (mind palace) để tổ chức và ghi nhớ thông tin từ nội dung sau. Hãy:
            1. Tạo một "cung điện trí nhớ" ảo với ít nhất 5 phòng hoặc địa điểm
            2. Đặt các thông tin quan trọng vào từng phòng/địa điểm, sử dụng hình ảnh và liên kết sống động
            3. Tạo một "hành trình" qua cung điện để kết nối các thông tin lại với nhau
            4. Đề xuất các kỹ thuật ghi nhớ bổ sung (như từ viết tắt, câu chuyện, vv.) để củng cố trí nhớ

            Hãy mô tả chi tiết cung điện trí nhớ và cách sử dụng nó để ghi nhớ nội dung. Trả lời bằng tiếng Việt.

            Nội dung cần tổ chức: "${inputText}"`;
        }
        else if (selectedPrompt === 'chunking') {
            promptText = `Áp dụng kỹ thuật phân đoạn (chunking) để chia nhỏ và tổ chức thông tin từ nội dung sau. Hãy:
            1. Xác định các chủ đề hoặc khái niệm chính
            2. Chia nhỏ mỗi chủ đề thành các "chunk" nhỏ hơn, dễ nhớ
            3. Tạo các liên kết logic giữa các chunk
            4. Đề xuất các phương pháp ghi nhớ cho từng chunk (ví dụ: từ viết tắt, hình ảnh, vv.)
            5. Tạo một sơ đồ hoặc cấu trúc tổng thể để kết nối tất cả các chunk

            Hãy trình bày kết quả phân đoạn và đề xuất cách sử dụng nó để học hiệu quả. Trả lời bằng tiếng Việt.

            Nội dung cần phân đoạn: "${inputText}"`;
        }
        else if (selectedPrompt === 'active_recall') {
            promptText = `Tạo một bộ câu hỏi và bài tập để thực hành kỹ thuật gợi nhớ chủ động (active recall) từ nội dung sau. Bao gồm:
            1. Ít nhất 10 câu hỏi trắc nghiệm
            2. 5 câu hỏi tự luận ngắn
            3. 3 bài tập áp dụng kiến thức
            4. 2 scenario hoặc case study để phân tích
            5. 1 bài tập tổng hợp yêu cầu kết nối nhiều khái niệm

            Cho mỗi mục, hãy cung cấp câu trả lời hoặc hướng dẫn giải quyết. Đảm bảo các câu hỏi và bài tập bao quát toàn bộ nội dung quan trọng. Trả lời bằng tiếng Việt.

            Nội dung cần tạo bài tập: "${inputText}"`;
        }
        else if (selectedPrompt === 'copywriter') {
            promptText = `Đóng vai một chuyên gia copywriter giàu kinh nghiệm. Hãy viết lại nội dung sau đây thành một bài viết thu hút, hấp dẫn và có tính thuyết phục cao. Sử dụng các kỹ thuật copywriting hiệu quả như:

            1. Tạo tiêu đề gây chú ý và thu hút
            2. Sử dụng ngôn ngữ hấp dẫn và sinh động
            3. Tập trung vào lợi ích cho độc giả
            4. Sử dụng câu hỏi tu từ và câu mệnh lệnh
            5. Tạo cấu trúc bài viết dễ đọc với các đoạn ngắn và bullet points
            6. Kết thúc bằng một call-to-action mạnh mẽ
            7. Sử dụng nhiều icon emoji phù hợp trong toàn bộ bài viết để tăng tính hấp dẫn và dễ đọc

            Hãy đảm bảo giữ nguyên thông tin quan trọng từ nội dung gốc nhưng trình bày theo cách thu hút hơn. Bài viết nên có độ dài khoảng 500-700 từ. Sử dụng icon emoji một cách phù hợp và thường xuyên trong bài viết, đặc biệt là ở đầu các đoạn văn, bullet points, và để nhấn mạnh các điểm quan trọng.

            Nội dung cần viết lại: "${inputText}"`;
        }
        else if (selectedPrompt === 'mental_model') {
            promptText = `Áp dụng mô hình tư duy để phân tích vấn đề sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết:
        
            1. Xác định mô hình tư duy phù hợp nhất:
               - Liệt kê ít nhất 3 mô hình tư duy có thể áp dụng
               - Giải thích ưu và nhược điểm của từng mô hình
               - Lý giải tại sao mô hình được chọn là phù hợp nhất
        
            2. Giải thích cách áp dụng mô hình này vào vấn đề:
               - Mô tả từng bước trong quá trình áp dụng mô hình
               - Đưa ra ví dụ cụ thể cho mỗi bước
               - Thảo luận về các thách thức có thể gặp phải và cách khắc phục
        
            3. Phân tích vấn đề sử dụng mô hình đã chọn:
               - Chia nhỏ vấn đề thành các thành phần theo mô hình
               - Phân tích sâu từng thành phần
               - Xem xét mối quan hệ giữa các thành phần
        
            4. Đưa ra các insight và giải pháp dựa trên phân tích:
               - Liệt kê ít nhất 5 insight quan trọng
               - Đề xuất ít nhất 3 giải pháp chi tiết
               - Giải thích cách mỗi giải pháp giải quyết vấn đề
        
            5. Kế hoạch hành động:
               - Đề xuất các bước cụ thể để triển khai giải pháp
               - Xác định các nguồn lực cần thiết
               - Dự đoán các kết quả có thể đạt được
        
            6. Đánh giá và điều chỉnh:
               - Đề xuất cách đánh giá hiệu quả của giải pháp
               - Xác định các chỉ số KPI cần theo dõi
               - Thảo luận về cách điều chỉnh nếu kết quả không như mong đợi
        
            Vấn đề cần phân tích: "${inputText}"
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'rubber_duck') {
            promptText = `Giải thích vấn đề sau như thể bạn đang giải thích cho một con vịt cao su bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và dễ hiểu:
        
            1. Chia nhỏ vấn đề thành các phần đơn giản:
               - Xác định ít nhất 5 thành phần chính của vấn đề
               - Giải thích mỗi thành phần bằng ngôn ngữ đơn giản nhất có thể
               - Sử dụng các ẩn dụ hoặc so sánh để làm rõ mỗi thành phần
        
            2. Sử dụng ngôn ngữ đơn giản và dễ hiểu:
               - Tránh sử dụng thuật ngữ chuyên môn
               - Giải thích mọi khái niệm như thể đang nói chuyện với một người hoàn toàn không có kiến thức về lĩnh vực này
               - Sử dụng câu ngắn và đơn giản
        
            3. Đưa ra các ví dụ cụ thể để minh họa:
               - Cung cấp ít nhất 3 ví dụ thực tế cho mỗi thành phần của vấn đề
               - Sử dụng các tình huống hàng ngày mà mọi người đều có thể liên hệ
               - Giải thích cách mỗi ví dụ liên quan đến vấn đề chính
        
            4. Đặt câu hỏi và trả lời để làm rõ các điểm quan trọng:
               - Đặt ít nhất 10 câu hỏi mà một người không hiểu vấn đề có thể hỏi
               - Trả lời mỗi câu hỏi một cách chi tiết và dễ hiểu
               - Sử dụng các câu hỏi để dẫn dắt quá trình giải thích
        
            5. Tạo một câu chuyện hoặc kịch bản:
               - Xây dựng một câu chuyện ngắn liên quan đến vấn đề
               - Sử dụng các nhân vật hoặc tình huống thú vị để minh họa vấn đề
               - Giải thích cách câu chuyện liên quan đến vấn đề chính
        
            6. Sử dụng hình ảnh hoặc biểu đồ đơn giản:
               - Mô tả bằng lời ít nhất 3 hình ảnh hoặc biểu đồ có thể giúp giải thích vấn đề
               - Giải thích cách mỗi hình ảnh hoặc biểu đồ liên quan đến các thành phần của vấn đề
               - Sử dụng các hình dạng và màu sắc cơ bản trong mô tả
        
            7. Tổng kết và kiểm tra hiểu biết:
               - Tóm tắt vấn đề bằng không quá 3 câu đơn giản
               - Đặt 5 câu hỏi kiểm tra để đảm bảo "con vịt" đã hiểu vấn đề
               - Cung cấp câu trả lời cho mỗi câu hỏi kiểm tra
        
            Vấn đề cần giải thích: "${inputText}"
        
            Hãy đảm bảo giải thích cực kỳ chi tiết, sử dụng nhiều ví dụ cụ thể, và làm cho nội dung dễ hiểu nhất có thể.`;
        }
        else if (selectedPrompt === 'eli5') {
            promptText = `Giải thích vấn đề sau như thể bạn đang giải thích cho một đứa trẻ 5 tuổi bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và dễ hiểu:
        
            1. Sử dụng từ ngữ và khái niệm đơn giản:
               - Tránh hoàn toàn các thuật ngữ chuyên môn
               - Giải thích mọi khái niệm bằng từ ngữ mà một đứa trẻ 5 tuổi có thể hiểu
               - Sử dụng câu ngắn và đơn giản, không quá 10 từ mỗi câu
        
            2. Tạo các ẩn dụ và so sánh với những thứ quen thuộc với trẻ em:
               - Đưa ra ít nhất 5 ẩn dụ hoặc so sánh liên quan đến đồ chơi, động vật, hoặc hoạt động hàng ngày của trẻ
               - Giải thích cách mỗi ẩn dụ liên quan đến vấn đề chính
               - Sử dụng các màu sắc, hình dạng, hoặc âm thanh để minh họa các khái niệm
        
            3. Sử dụng các ví dụ trực quan và dễ hiểu:
               - Đưa ra ít nhất 3 ví dụ cụ thể cho mỗi khía cạnh của vấn đề
               - Sử dụng các tình huống hoặc câu chuyện mà trẻ em có thể dễ dàng tưởng tượng
               - Mô tả chi tiết cách mỗi ví dụ hoạt động, sử dụng ngôn ngữ hình ảnh
        
            4. Giữ giải thích ngắn gọn và thú vị:
               - Chia nhỏ vấn đề thành các phần nhỏ, mỗi phần không quá 3-4 câu
               - Sử dụng giọng điệu vui vẻ và hấp dẫn, như thể đang kể một câu chuyện thú vị
               - Đặt câu hỏi rhetorical để giữ sự chú ý của trẻ
        
            5. Tương tác và tham gia:
               - Đề xuất các hoạt động đơn giản mà trẻ có thể làm để hiểu vấn đề tốt hơn
               - Tạo ra một bài hát hoặc vè ngắn để giúp trẻ nhớ các điểm chính
               - Khuyến khích trẻ đặt câu hỏi và tưởng tượng
        
            6. Sử dụng hình ảnh và biểu tượng:
               - Mô tả bằng lời ít nhất 3 hình vẽ đơn giản có thể minh họa vấn đề
               - Sử dụng các biểu tượng cảm xúc để thể hiện các khái niệm khác nhau
               - Gợi ý cách trẻ có thể vẽ hoặc tạo ra các mô hình đơn giản để hiểu vấn đề
        
            7. Tổng kết và củng cố:
               - Tóm tắt vấn đề bằng không quá 3 câu cực kỳ đơn giản
               - Tạo một câu slogan dễ nhớ tổng hợp toàn bộ ý chính
               - Đề xuất cách trẻ có thể "dạy lại" điều vừa học cho bạn bè hoặc đồ chơi của mình
        
            Vấn đề cần giải thích: "${inputText}"
        
            Hãy đảm bảo giải thích cực kỳ chi tiết, sử dụng nhiều ví dụ cụ thể, và làm cho nội dung thú vị và dễ hiểu nhất có thể cho một đứa trẻ 5 tuổi.`;
        }
        else if (selectedPrompt === 'code_review') {
            promptText = `Đánh giá đoạn code sau như một senior developer bằng tiếng Việt. Hãy thực hiện phân tích cực kỳ chi tiết và toàn diện:
        
            1. Xem xét cấu trúc và tổ chức code:
               - Phân tích cấu trúc tổng thể của code (ví dụ: các lớp, hàm, module)
               - Đánh giá việc phân chia trách nhiệm giữa các thành phần
               - Nhận xét về tính modular và khả năng tái sử dụng của code
               - Đề xuất cách cải thiện cấu trúc nếu cần
        
            2. Đánh giá hiệu suất và khả năng mở rộng:
               - Xác định các điểm có thể gây ra vấn đề về hiệu suất
               - Phân tích độ phức tạp thời gian và không gian của các thuật toán chính
               - Đánh giá khả năng mở rộng của code khi dữ liệu hoặc người dùng tăng
               - Đề xuất các tối ưu hóa cụ thể để cải thiện hiệu suất
        
            3. Kiểm tra các best practices và coding standards:
               - So sánh code với các best practices của ngôn ngữ/framework đang sử dụng
               - Đánh giá việc tuân thủ các nguyên tắc SOLID, DRY, KISS
               - Kiểm tra việc sử dụng các design patterns phù hợp
               - Nhận xét về coding style, đặt tên biến/hàm, và comments
        
            4. Đề xuất cải tiến và tối ưu hóa:
               - Liệt kê ít nhất 10 đề xuất cụ thể để cải thiện code
               - Cung cấp ví dụ code cho mỗi đề xuất
               - Giải thích lý do và lợi ích của mỗi cải tiến
               - Thảo luận về các trade-offs có thể có khi thực hiện các cải tiến
        
            5. Nhận xét về tính bảo trì và đọc hiểu của code:
               - Đánh giá mức độ dễ đọc và hiểu của code
               - Nhận xét về chất lượng và số lượng của comments và documentation
               - Thảo luận về khả năng một developer mới có thể hiểu và làm việc với code
               - Đề xuất cách cải thiện tính bảo trì và đọc hiểu
        
            6. Phân tích bảo mật và xử lý lỗi:
               - Xác định các potential security vulnerabilities trong code
               - Đánh giá cách code xử lý các trường hợp ngoại lệ và lỗi
               - Đề xuất cách cải thiện bảo mật và error handling
        
            7. Đánh giá về testing:
               - Nhận xét về mức độ và chất lượng của unit tests (nếu có)
               - Đề xuất các test cases bổ sung cần được thêm vào
               - Thảo luận về khả năng testability của code
        
            8. Phân tích về dependencies và tích hợp:
               - Đánh giá việc sử dụng các thư viện và dependencies bên ngoài
               - Nhận xét về cách code tích hợp với các hệ thống hoặc services khác
               - Đề xuất cách cải thiện quản lý dependencies nếu cần
        
            9. Tổng kết và đánh giá chung:
               - Đưa ra đánh giá tổng thể về chất lượng của code
               - Xác định 3 điểm mạnh và 3 điểm yếu chính của code
               - Đề xuất lộ trình cải thiện code theo thứ tự ưu tiên
        
            Đoạn code cần đánh giá:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'system_design') {
            promptText = `Phân tích thiết kế hệ thống cho vấn đề sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định và phân tích các yêu cầu chính của hệ thống:
               - Liệt kê tất cả các yêu cầu chức năng và phi chức năng
               - Phân tích mỗi yêu cầu về mức độ ưu tiên và tác động đến thiết kế
               - Xác định các ràng buộc và giới hạn của hệ thống
               - Dự đoán các yêu cầu có thể phát sinh trong tương lai
        
            2. Đề xuất kiến trúc tổng thể:
               - Vẽ và mô tả sơ đồ kiến trúc high-level của hệ thống
               - Giải thích lý do chọn kiến trúc này
               - So sánh với ít nhất 2 kiến trúc thay thế khác
               - Thảo luận về khả năng mở rộng và linh hoạt của kiến trúc đề xuất
        
            3. Mô tả chi tiết các thành phần chính và tương tác giữa chúng:
               - Liệt kê và mô tả chức năng của từng thành phần
               - Vẽ sơ đồ tương tác giữa các thành phần
               - Giải thích cách dữ liệu và control flow giữa các thành phần
               - Thảo luận về các protocols và APIs được sử dụng
        
            4. Phân tích sâu về khả năng mở rộng, hiệu suất và bảo mật:
               - Đề xuất các strategies để đảm bảo khả năng mở rộng (ví dụ: sharding, load balancing)
               - Thảo luận về cách tối ưu hiệu suất (ví dụ: caching, indexing)
               - Phân tích các vấn đề bảo mật tiềm ẩn và đề xuất giải pháp
               - Đề xuất cách monitoring và logging cho hệ thống
        
            5. Đề xuất các công nghệ và framework phù hợp:
               - Liệt kê và giải thích lý do chọn các công nghệ cụ thể cho từng thành phần
               - So sánh ưu nhược điểm của các công nghệ được đề xuất
               - Thảo luận về khả năng tích hợp giữa các công nghệ
               - Đề xuất các tools và platforms hỗ trợ cho quá trình phát triển và vận hành
        
            6. Thiết kế cơ sở dữ liệu:
               - Đề xuất schema cơ sở dữ liệu (relational hoặc NoSQL)
               - Giải thích lý do chọn loại cơ sở dữ liệu
               - Thảo luận về các strategies để đảm bảo data consistency và integrity
               - Đề xuất cách backup và recovery data
        
            7. Xử lý các edge cases và scenarios phức tạp:
               - Liệt kê ít nhất 5 edge cases hoặc scenarios phức tạp
               - Giải thích cách hệ thống xử lý mỗi trường hợp
               - Đề xuất các giải pháp để cải thiện khả năng xử lý các trường hợp này
        
            8. Đánh giá và so sánh với các hệ thống tương tự:
               - So sánh thiết kế đề xuất với ít nhất 2 hệ thống tương tự đã tồn tại
               - Thảo luận về điểm mạnh và điểm yếu của thiết kế so với các hệ thống này
               - Đề xuất cách áp dụng các bài học từ các hệ thống khác
        
            9. Lộ trình triển khai và phát triển:
               - Đề xuất các giai đoạn phát triển và triển khai hệ thống
               - Thảo luận về cách áp dụng Agile hoặc các methodologies phát triển khác
               - Đề xuất cách quản lý và theo dõi tiến độ dự án
        
            10. Tổng kết và đánh giá:
                - Tóm tắt các điểm chính của thiết kế
                - Thảo luận về các thách thức lớn nhất và cách khắc phục
                - Đề xuất các bước tiếp theo để hoàn thiện và triển khai thiết kế
        
            Vấn đề cần thiết kế hệ thống: "${inputText}"
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'algorithm_breakdown') {
            promptText = `Phân tích chi tiết thuật toán sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Mô tả tổng quan về thuật toán:
               - Giải thích mục đích và ứng dụng của thuật toán
               - Mô tả ngắn gọn cách thuật toán hoạt động
               - Thảo luận về nguồn gốc và lịch sử của thuật toán (nếu có)
               - So sánh tổng quát với các thuật toán tương tự
        
            2. Phân tích từng bước của thuật toán:
               - Chia nhỏ thuật toán thành các bước cụ thể
               - Giải thích chi tiết logic đằng sau mỗi bước
               - Cung cấp ví dụ cụ thể cho mỗi bước
               - Vẽ sơ đồ hoặc lưu đồ minh họa quá trình thực hiện
        
            3. Đánh giá độ phức tạp thời gian và không gian:
               - Phân tích độ phức tạp thời gian cho trường hợp tốt nhất, trung bình và xấu nhất
               - Tính toán độ phức tạp không gian
               - So sánh độ phức tạp với các thuật toán tương tự
               - Thảo luận về các yếu tố ảnh hưởng đến hiệu suất
        
            4. Thảo luận về ưu và nhược điểm:
               - Liệt kê ít nhất 5 ưu điểm của thuật toán
               - Xác định ít nhất 5 nhược điểm hoặc hạn chế
               - Phân tích các trường hợp sử dụng phù hợp nhất
               - Thảo luận về các tình huống không nên sử dụng thuật toán này
        
            5. Đề xuất các cải tiến hoặc biến thể có thể có:
               - Đề xuất ít nhất 3 cách để cải thiện thuật toán
               - Mô tả các biến thể có thể có của thuật toán
               - Thảo luận về cách áp dụng thuật toán trong các ngữ cảnh khác nhau
               - Đề xuất cách kết hợp với các thuật toán khác để tăng hiệu quả
        
            6. Implement và demo:
               - Cung cấp mã giả hoặc pseudocode cho thuật toán
               - Implement thuật toán bằng ngôn ngữ lập trình phổ biến (ví dụ: Python, Java)
               - Cung cấp ít nhất 3 test cases với input và output mong đợi
               - Thảo luận về các edge cases và cách xử lý
        
            7. So sánh với các thuật toán tương tự:
               - Xác định ít nhất 2 thuật toán tương tự hoặc thay thế
               - So sánh hiệu suất và độ phức tạp
               - Thảo luận về các trường hợp sử dụng phù hợp cho mỗi thuật toán
               - Đề xuất tiêu chí để chọn giữa các thuật toán này
        
            8. Ứng dụng thực tế:
               - Mô tả ít nhất 3 ứng dụng thực tế của thuật toán
               - Thảo luận về cách thuật toán được sử dụng trong các hệ thống hoặc sản phẩm cụ thể
               - Đề xuất các lĩnh vực mới có thể áp dụng thuật toán
        
            9. Tối ưu hóa và cải tiến:
               - Thảo luận về các kỹ thuật tối ưu hóa có thể áp dụng
               - Đề xuất cách cải thiện hiệu suất trên các kiến trúc phần cứng khác nhau
               - Thảo luận về khả năng song song hóa hoặc phân tán thuật toán
        
            10. Tổng kết và đánh giá:
                - Tóm tắt các điểm chính về thuật toán
                - Đánh giá tổng thể về tính ứng dụng và hiệu quả
                - Đề xuất hướng nghiên cứu hoặc phát triển tiếp theo
        
            Thuật toán cần phân tích:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'debug_strategy') {
            promptText = `Đề xuất chiến lược debug cho vấn đề sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định các triệu chứng và lỗi có thể xảy ra:
               - Mô tả chi tiết các triệu chứng của vấn đề
               - Liệt kê tất cả các lỗi có thể xảy ra
               - Phân loại các lỗi theo mức độ nghiêm trọng
               - Thảo luận về các nguyên nhân tiềm ẩn cho mỗi lỗi
        
            2. Đề xuất các bước debug có hệ thống:
               - Xây dựng quy trình debug chi tiết, từng bước
               - Giải thích lý do đằng sau mỗi bước trong quy trình
               - Đề xuất cách tiếp cận cho các loại lỗi khác nhau
               - Thảo luận về các kỹ thuật debug nâng cao (ví dụ: binary search debugging)
        
            3. Gợi ý các công cụ và kỹ thuật debug phù hợp:
               - Liệt kê và mô tả ít nhất 5 công cụ debug phù hợp
               - So sánh ưu và nhược điểm của mỗi công cụ
               - Hướng dẫn cách sử dụng hiệu quả mỗi công cụ
               - Đề xuất các kỹ thuật debug manual và automated
        
            4. Thảo luận về cách tái tạo và cô lập vấn đề:
               - Đề xuất các phương pháp để tái tạo lỗi một cách nhất quán
               - Hướng dẫn cách cô lập vấn đề để dễ dàng debug
               - Thảo luận về tầm quan trọng của việc tạo test case tối thiểu
               - Đề xuất cách xử lý các lỗi không thể tái tạo
        
            5. Đề xuất cách ngăn chặn lỗi tương tự trong tương lai:
               - Đề xuất các best practices để tránh lỗi tương tự
               - Thảo luận về cách cải thiện quy trình phát triển
               - Đề xuất các công cụ và kỹ thuật để phát hiện lỗi sớm
               - Thảo luận về tầm quan trọng của việc viết unit test và integration test
        
            6. Phân tích root cause:
               - Hướng dẫn cách thực hiện phân tích root cause
               - Đề xuất các kỹ thuật để xác định nguyên nhân gốc rễ
               - Thảo luận về cách phân biệt giữa triệu chứng và nguyên nhân
               - Đề xuất cách document và chia sẻ kết quả phân tích
        
            7. Debug trong môi trường phức tạp:
               - Thảo luận về cách debug trong hệ thống phân tán
               - Đề xuất chiến lược cho debug các vấn đề liên quan đến concurrency
               - Hướng dẫn cách xử lý các lỗi liên quan đến network hoặc I/O
               - Thảo luận về cách debug trong môi trường production an toàn
        
            8. Sử dụng logging và monitoring:
               - Đề xuất chiến lược logging hiệu quả cho mục đích debug
               - Thảo luận về cách sử dụng các công cụ monitoring để phát hiện và debug lỗi
               - Hướng dẫn cách phân tích log files để tìm ra nguyên nhân lỗi
               - Đề xuất các metrics cần theo dõi để phát hiện lỗi sớm
        
            9. Collaboration và communication trong quá trình debug:
               - Đề xuất cách chia sẻ thông tin về lỗi với team
               - Thảo luận về cách tổ chức pair debugging hoặc mob debugging sessions
               - Hướng dẫn cách tạo báo cáo lỗi chi tiết và hữu ích
               - Đề xuất cách tận dụng kiến thức tập thể để giải quyết các vấn đề phức tạp
        
            10. Tổng kết và đánh giá:
                - Tóm tắt các bước quan trọng nhất trong chiến lược debug
                - Đề xuất cách đánh giá hiệu quả của quá trình debug
                - Thảo luận về cách cải thiện kỹ năng debug liên tục
                - Đề xuất resources để học hỏi thêm về kỹ thuật debug nâng cao
        
            Vấn đề cần debug:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'code_optimization') {
            promptText = `Đề xuất cách tối ưu hóa đoạn code sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định các điểm có thể tối ưu:
               - Phân tích code để tìm ra các bottlenecks
               - Xác định các phần code chạy không hiệu quả
               - Tìm kiếm các patterns không tối ưu
               - Đánh giá việc sử dụng tài nguyên (CPU, memory, I/O)
        
            2. Đề xuất các kỹ thuật tối ưu hóa cụ thể:
               - Liệt kê ít nhất 10 kỹ thuật tối ưu hóa có thể áp dụng
               - Giải thích chi tiết cách áp dụng mỗi kỹ thuật
               - Cung cấp ví dụ code cho mỗi kỹ thuật tối ưu
               - Thảo luận về pros và cons của mỗi kỹ thuật
        
            3. So sánh hiệu suất trước và sau khi tối ưu:
               - Đề xuất các metrics để đo lường hiệu suất
               - Hướng dẫn cách benchmark code trước và sau khi tối ưu
               - Phân tích kết quả benchmark và giải thích sự cải thiện
               - Thảo luận về các tools có thể sử dụng để đo lường hiệu suất
        
            4. Thảo luận về trade-offs của việc tối ưu:
               - Phân tích tác động của việc tối ưu đến tính đọc hiểu của code
               - Thảo luận về khả năng bảo trì của code sau khi tối ưu
               - Đánh giá tác động của việc tối ưu đến các phần khác của hệ thống
               - Thảo luận về thời điểm nên và không nên tối ưu
        
            5. Đề xuất các best practices để viết code hiệu quả hơn:
               - Liệt kê ít nhất 15 best practices cho việc viết code hiệu quả
               - Giải thích lý do đằng sau mỗi best practice
               - Cung cấp ví dụ cụ thể cho mỗi best practice
               - Thảo luận về cách áp dụng các best practices trong quy trình phát triển
        
            6. Phân tích thuật toán và cấu trúc dữ liệu:
               - Đánh giá độ phức tạp của các thuật toán hiện tại
               - Đề xuất các thuật toán hoặc cấu trúc dữ liệu hiệu quả hơn
               - So sánh độ phức tạp trước và sau khi tối ưu
               - Thảo luận về trade-offs giữa thời gian và không gian
        
            7. Tối ưu hóa cho các platform cụ thể:
               - Đề xuất các tối ưu hóa specific cho ngôn ngữ lập trình đang sử dụng
               - Thảo luận về các tối ưu hóa liên quan đến compiler hoặc runtime
               - Đề xuất cách tận dụng các tính năng phần cứng để tăng hiệu suất
               - Thảo luận về cách tối ưu cho các môi trường khác nhau (ví dụ: mobile, cloud)
        
            8. Tối ưu hóa memory usage:
               - Phân tích cách code sử dụng bộ nhớ
               - Đề xuất các kỹ thuật để giảm memory footprint
               - Thảo luận về cách xử lý memory leaks
               - Đề xuất cách tối ưu garbage collection (nếu áp dụng)
        
            9. Concurrency và parallelism:
               - Xác định các phần có thể thực hiện song song
               - Đề xuất cách áp dụng concurrency để tăng hiệu suất
               - Thảo luận về các challenges khi implement concurrency
               - Đề xuất các patterns và best practices cho concurrent programming
        
            10. Tổng kết và lộ trình tối ưu:
                - Tóm tắt các điểm chính trong quá trình tối ưu
                - Đề xuất lộ trình tối ưu theo thứ tự ưu tiên
                - Thảo luận về cách đo lường và theo dõi hiệu suất liên tục
                - Đề xuất cách tích hợp quá trình tối ưu vào quy trình phát triển
        
            Đoạn code cần tối ưu:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'design_patterns') {
            promptText = `Áp dụng design patterns cho vấn đề sau bằng tiếng Việt. Hãy:
            1. Xác định các design patterns phù hợp
            2. Giải thích cách áp dụng từng pattern
            3. Mô tả cấu trúc và tương tác giữa các thành phần
            4. Thảo luận về ưu và nhược điểm của việc sử dụng patterns
            5. Đề xuất các biến thể hoặc kết hợp patterns nếu cần

            Vấn đề cần áp dụng design patterns, nếu có solution thì cung cấp solution cụ thể kèm code mẫu hoặc vấn đề:
            Vấn đề cần áp dụng design patterns: "${inputText}"`;
        }
        else if (selectedPrompt === 'tech_stack_comparison') {
            promptText = `So sánh các tech stack cho vấn đề sau bằng tiếng Việt. Hãy:
            1. Xác định các tech stack phù hợp
            2. So sánh ưu và nhược điểm của mỗi stack
            3. Đánh giá khả năng mở rộng, hiệu suất và bảo mật
            4. Thảo luận về ecosystem và cộng đồng hỗ trợ
            5. Đề xuất stack phù hợp nhất và giải thích lý do

            Vấn đề cần so sánh tech stack, nếu có solution thì cung cấp solution cụ thể kèm code mẫu hoặc vấn đề:
            Vấn đề cần so sánh tech stack: "${inputText}"`;
        }
        else if (selectedPrompt === 'code_to_pseudocode') {
            promptText = `Chuyển đổi đoạn code sau thành pseudocode bằng tiếng Việt. Hãy:
            1. Mô tả tổng quan về chức năng của code
            2. Chuyển đổi từng phần của code thành pseudocode dễ hiểu
            3. Sử dụng cấu trúc và từ khóa phổ biến trong pseudocode
            4. Giải thích các bước logic quan trọng
            5. Đảm bảo pseudocode dễ đọc và hiểu cho người không chuyên

            Đoạn code cần chuyển đổi, nếu có solution thì cung cấp solution cụ thể kèm code mẫu hoặc đoạn code:
            ${inputText}`;
        }
        else if (selectedPrompt === 'pseudocode_to_code') {
            promptText = `Chuyển đổi pseudocode sau thành code thực tế bằng tiếng Việt. Hãy:
            1. Chọn ngôn ngữ lập trình phù hợp
            2. Chuyển đổi từng phần của pseudocode thành code thực tế
            3. Đảm bảo code tuân thủ các best practices và coding standards
            4. Giải thích các quyết định implement quan trọng
            5. Đề xuất các tối ưu hóa hoặc cải tiến có thể có

            Pseudocode cần chuyển đổi, nếu có solution thì cung cấp solution cụ thể kèm code mẫu hoặc pseudocode:
            ${inputText}`;
        }
        else if (selectedPrompt === 'time_complexity') {
            promptText = `Phân tích độ phức tạp thời gian của thuật toán sau bằng tiếng Việt. Hãy:
            1. Xác định các phần chính của thuật toán
            2. Phân tích độ phức tạp của từng phần
            3. Tính toán độ phức tạp tổng thể
            4. Thảo luận về best case, average case và worst case
            5. Đề xuất cách cải thiện độ phức tạp nếu có thể

            Thuật toán cần phân tích, nếu có solution thì cung cấp solution cụ thể kèm code mẫu hoặc thuật toán:
            ${inputText}`;
        }
        else if (selectedPrompt === 'space_complexity') {
            promptText = `Phân tích độ phức tạp không gian của thuật toán sau bằng tiếng Việt. Hãy:
            1. Xác định các cấu trúc dữ liệu chính được sử dụng
            2. Phân tích không gian bộ nhớ cần thiết cho mỗi cấu trúc
            3. Tính toán độ phức tạp không gian tổng thể
            4. Thảo luận về các trường hợp sử dụng bộ nhớ khác nhau
            5. Đề xuất cách tối ưu hóa sử dụng bộ nhớ nếu có thể

            Thuật toán cần phân tích, nếu có solution thì cung cấp solution cụ thể kèm code mẫu hoặc thuật toán:
            ${inputText}`;
        }
        else if (selectedPrompt === 'code_smells') {
            promptText = `Phát hiện code smells trong đoạn code sau bằng tiếng Việt. Hãy:
            1. Xác định các code smells có trong đoạn code
            2. Giải thích tại sao đó là code smells
            3. Đánh giá mức độ nghiêm trọng của mỗi smell
            4. Đề xuất cách refactor để loại bỏ code smells
            5. Thảo luận về tác động của việc refactor đối với code

            Đoạn code cần phân tích, nếu có solution thì cung cấp solution cụ thể kèm code mẫu hoặc đoạn code cần phân tích:
            ${inputText}`;
        }
        else if (selectedPrompt === 'refactoring_suggestions') {
            promptText = `Đề xuất cách refactor đoạn code sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định các phần cần refactor:
               - Phân tích code để tìm ra các code smells
               - Xác định các vi phạm nguyên tắc SOLID
               - Tìm kiếm các patterns không hiệu quả hoặc khó bảo trì
               - Đánh giá tính đọc hiểu và khả năng mở rộng của code
        
            2. Đề xuất các kỹ thuật refactor cụ thể:
               - Liệt kê ít nhất 10 kỹ thuật refactor có thể áp dụng
               - Giải thích chi tiết cách áp dụng mỗi kỹ thuật
               - Cung cấp ví dụ code trước và sau khi áp dụng mỗi kỹ thuật
               - Thảo luận về ưu và nhược điểm của mỗi kỹ thuật
        
            3. Giải thích lý do và lợi ích của việc refactor:
               - Phân tích tác động của refactor đến chất lượng code
               - Thảo luận về cải thiện hiệu suất và khả năng bảo trì
               - Giải thích cách refactor giúp giảm technical debt
               - Đánh giá tác động của refactor đến quá trình phát triển dài hạn
        
            4. Cung cấp ví dụ code sau khi refactor:
               - Viết lại toàn bộ đoạn code sau khi áp dụng tất cả các kỹ thuật refactor
               - Giải thích chi tiết các thay đổi và lý do đằng sau mỗi thay đổi
               - So sánh code trước và sau refactor về mặt độ phức tạp, tính đọc hiểu và hiệu suất
               - Đề xuất các unit tests để đảm bảo tính đúng đắn sau khi refactor
        
            5. Thảo luận về các rủi ro và cách giảm thiểu khi refactor:
               - Xác định ít nhất 5 rủi ro tiềm ẩn khi thực hiện refactor
               - Đề xuất các biện pháp cụ thể để giảm thiểu mỗi rủi ro
               - Thảo luận về cách đảm bảo tính đúng đắn của code sau khi refactor
               - Đề xuất quy trình refactor an toàn và hiệu quả
        
            6. Phân tích tác động của refactor đến hiệu suất:
               - Đánh giá tác động của refactor đến thời gian thực thi
               - Thảo luận về ảnh hưởng đến việc sử dụng bộ nhớ
               - Đề xuất cách benchmark trước và sau khi refactor
               - Phân tích trade-offs giữa tính đọc hiểu và hiệu suất
        
            7. Refactor cho khả năng mở rộng:
               - Đề xuất cách cấu trúc lại code để dễ dàng thêm tính năng mới
               - Thảo luận về việc áp dụng các design patterns phù hợp
               - Giải thích cách refactor có thể cải thiện khả năng tái sử dụng code
               - Đề xuất cách tổ chức code để dễ dàng test và maintain
        
            8. Tối ưu hóa thuật toán trong quá trình refactor:
               - Xác định các thuật toán không hiệu quả trong code hiện tại
               - Đề xuất các thuật toán tối ưu hơn
               - So sánh độ phức tạp thời gian và không gian trước và sau khi tối ưu
               - Cung cấp ví dụ cụ thể về cách implement thuật toán mới
        
            9. Refactor để cải thiện khả năng test:
               - Đề xuất cách cấu trúc lại code để dễ dàng viết unit tests
               - Thảo luận về việc áp dụng Dependency Injection và Inversion of Control
               - Giải thích cách refactor có thể cải thiện test coverage
               - Đề xuất các mocking strategies cho các dependencies
        
            10. Lộ trình và kế hoạch refactor:
                - Đề xuất các bước cụ thể để thực hiện refactor
                - Thảo luận về cách ưu tiên các phần cần refactor
                - Đề xuất cách tích hợp quá trình refactor vào quy trình phát triển liên tục
                - Thảo luận về cách đo lường và theo dõi hiệu quả của quá trình refactor
        
            Đoạn code cần refactor:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'testing_strategies') {
            promptText = `Đề xuất chiến lược kiểm thử cho đoạn code hoặc chức năng sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định các loại test cần thực hiện:
               - Phân tích và đề xuất các loại test phù hợp (unit, integration, e2e, performance, security, etc.)
               - Giải thích chi tiết mục đích và tầm quan trọng của mỗi loại test
               - Thảo luận về tỷ lệ phân bổ giữa các loại test (ví dụ: Test Pyramid)
               - Đề xuất cách tích hợp các loại test vào quy trình phát triển
        
            2. Đề xuất các test case cụ thể:
               - Liệt kê ít nhất 20 test cases chi tiết cho các chức năng chính
               - Mô tả input, expected output, và các bước thực hiện cho mỗi test case
               - Phân loại test cases theo mức độ ưu tiên và độ phức tạp
               - Đề xuất các test data cần thiết cho mỗi test case
        
            3. Thảo luận về các edge cases và cách test chúng:
               - Xác định ít nhất 10 edge cases tiềm ẩn
               - Giải thích tại sao mỗi edge case là quan trọng
               - Đề xuất cách tạo và mô phỏng các edge cases trong môi trường test
               - Thảo luận về cách xử lý và validate kết quả của các edge cases
        
            4. Đề xuất các công cụ và framework testing phù hợp:
               - Liệt kê và so sánh ít nhất 5 công cụ/framework testing phổ biến
               - Phân tích ưu và nhược điểm của mỗi công cụ/framework
               - Đề xuất công cụ/framework phù hợp nhất cho dự án cụ thể này
               - Cung cấp hướng dẫn cơ bản về cách set up và sử dụng công cụ/framework được chọn
        
            5. Thảo luận về cách đảm bảo code coverage và test quality:
               - Đề xuất mục tiêu code coverage cụ thể (ví dụ: 80% statement coverage)
               - Giải thích các loại code coverage (statement, branch, function, etc.) và tầm quan trọng của chúng
               - Đề xuất các công cụ đo lường code coverage
               - Thảo luận về các metrics khác để đánh giá chất lượng của tests (ví dụ: mutation testing)
        
            6. Chiến lược Continuous Testing:
               - Đề xuất cách tích hợp testing vào quy trình CI/CD
               - Thảo luận về cách tự động hóa việc chạy tests
               - Đề xuất cách xử lý và báo cáo kết quả test trong pipeline
               - Thảo luận về chiến lược để giảm thời gian chạy test trong CI/CD
        
            7. Mocking và Stubbing:
               - Giải thích khi nào và tại sao cần sử dụng mocks và stubs
               - Đề xuất các công cụ mocking phù hợp
               - Cung cấp ví dụ cụ thể về cách sử dụng mocks và stubs trong tests
               - Thảo luận về các best practices khi sử dụng mocking
        
            8. Performance Testing:
               - Đề xuất các loại performance tests cần thực hiện (load testing, stress testing, etc.)
               - Xác định các metrics cần đo lường trong performance tests
               - Đề xuất công cụ và framework cho performance testing
               - Thảo luận về cách phân tích và tối ưu hiệu suất dựa trên kết quả tests
        
            9. Security Testing:
               - Xác định các loại security tests cần thực hiện
               - Đề xuất các công cụ và framework cho security testing
               - Thảo luận về cách tích hợp security testing vào quy trình phát triển
               - Đề xuất cách xử lý và khắc phục các lỗ hổng bảo mật được phát hiện
        
            10. Test-Driven Development (TDD) và Behavior-Driven Development (BDD):
                - Giải thích cách áp dụng TDD và BDD vào dự án
                - Đề xuất các công cụ và framework hỗ trợ TDD và BDD
                - Cung cấp ví dụ cụ thể về cách viết tests theo phương pháp TDD và BDD
                - Thảo luận về lợi ích và thách thức khi áp dụng TDD và BDD
        
            Đoạn code hoặc chức năng cần test:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'api_design') {
            promptText = `Thiết kế API RESTful cho vấn đề sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định các resources chính:
               - Phân tích yêu cầu và xác định ít nhất 5 resources chính
               - Mô tả chi tiết mỗi resource và các thuộc tính của nó
               - Thảo luận về mối quan hệ giữa các resources
               - Đề xuất cách đặt tên cho các resources theo best practices
        
            2. Định nghĩa các endpoints và HTTP methods:
               - Liệt kê tất cả các endpoints cho mỗi resource
               - Xác định HTTP method phù hợp cho mỗi endpoint (GET, POST, PUT, DELETE, etc.)
               - Mô tả chức năng cụ thể của mỗi endpoint
               - Đề xuất cấu trúc URL chuẩn cho các endpoints
        
            3. Mô tả cấu trúc request và response:
               - Định nghĩa cấu trúc JSON cho requests và responses của mỗi endpoint
               - Mô tả các parameters bắt buộc và tùy chọn cho mỗi request
               - Đề xuất cách xử lý pagination, filtering, và sorting
               - Thảo luận về cách xử lý các trường hợp lỗi và status codes
        
            4. Thảo luận về authentication và authorization:
               - Đề xuất phương pháp authentication phù hợp (ví dụ: JWT, OAuth2)
               - Mô tả cách implement authorization cho các endpoints khác nhau
               - Thảo luận về cách xử lý và lưu trữ tokens
               - Đề xuất cách implement rate limiting và throttling
        
            5. Đề xuất các best practices về versioning, error handling, và documentation:
               - Thảo luận về các chiến lược versioning API (URL, header, etc.)
               - Đề xuất cấu trúc chuẩn cho error responses
               - Mô tả cách implement logging và monitoring cho API
               - Đề xuất công cụ và format để tạo API documentation (ví dụ: Swagger/OpenAPI)
        
            6. Bảo mật API:
               - Đề xuất các biện pháp bảo mật cho API (HTTPS, CORS, etc.)
               - Thảo luận về cách xử lý các vấn đề bảo mật phổ biến (SQL injection, XSS, etc.)
               - Đề xuất cách implement input validation và sanitization
               - Thảo luận về cách xử lý sensitive data trong API
        
            7. Caching và Performance:
               - Đề xuất chiến lược caching cho API (client-side, server-side)
               - Thảo luận về cách sử dụng ETags và conditional requests
               - Đề xuất cách tối ưu hóa performance của API
               - Thảo luận về cách xử lý large payload và file uploads
        
            8. Webhooks và Real-time Updates:
               - Đề xuất cách implement webhooks cho real-time updates
               - Thảo luận về các use cases phù hợp cho webhooks
               - Mô tả cách xử lý retry logic và error handling cho webhooks
               - Đề xuất cách implement long polling hoặc WebSockets nếu cần
        
            9. API Governance và Lifecycle Management:
               - Đề xuất quy trình phát triển và review API
               - Thảo luận về cách quản lý các phiên bản API
               - Đề xuất cách thu thập và phân tích API metrics
               - Thảo luận về cách deprecate và retire các API endpoints
        
            10. Testing và Documentation:
                - Đề xuất chiến lược testing toàn diện cho API
                - Mô tả cách tạo và duy trì API documentation
                - Đề xuất cách tạo SDK hoặc client libraries cho API
                - Thảo luận về cách tạo developer portal và resources
        
            Vấn đề cần thiết kế API:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'database_schema') {
            promptText = `Thiết kế schema cơ sở dữ liệu cho vấn đề sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định các entities chính:
               - Phân tích yêu cầu và xác định ít nhất 5 entities chính
               - Mô tả chi tiết mỗi entity và các thuộc tính của nó
               - Thảo luận về mối quan hệ giữa các entities
               - Đề xuất cách đặt tên cho các entities và thuộc tính theo best practices
        
            2. Định nghĩa các bảng và mối quan hệ giữa chúng:
               - Tạo danh sách các bảng cần thiết cho mỗi entity
               - Xác định khóa chính (primary key) cho mỗi bảng
               - Mô tả các mối quan hệ (1-1, 1-N, N-N) giữa các bảng
               - Đề xuất cách implement các mối quan hệ (foreign keys, junction tables)
        
            3. Mô tả các trường dữ liệu, kiểu dữ liệu và ràng buộc:
               - Liệt kê tất cả các trường cho mỗi bảng
               - Xác định kiểu dữ liệu phù hợp cho mỗi trường
               - Đề xuất các ràng buộc (constraints) cần thiết (NOT NULL, UNIQUE, CHECK, etc.)
               - Thảo luận về cách xử lý null values và default values
        
            4. Thảo luận về indexing và optimization:
               - Xác định các trường cần đánh index
               - Đề xuất các loại index phù hợp (B-tree, Hash, etc.)
               - Thảo luận về trade-offs khi sử dụng indexes
               - Đề xuất các query hints để tối ưu hiệu suất
        
            5. Đề xuất các best practices về normalization và data integrity:
               - Phân tích mức độ normalization phù hợp (1NF, 2NF, 3NF, etc.)
               - Thảo luận về các trường hợp nên và không nên denormalize
               - Đề xuất cách implement các ràng buộc toàn vẹn (integrity constraints)
               - Thảo luận về cách xử lý các anomalies trong dữ liệu
        
            6. Quản lý phiên bản và migration:
               - Đề xuất chiến lược quản lý phiên bản schema
               - Mô tả cách thực hiện database migrations
               - Thảo luận về cách xử lý backward compatibility
               - Đề xuất công cụ và quy trình cho schema migrations
        
            7. Bảo mật và quyền truy cập:
               - Đề xuất cách implement user authentication và authorization ở mức database
               - Thảo luận về cách mã hóa dữ liệu nhạy cảm
               - Đề xuất cách implement row-level security nếu cần
               - Thảo luận về các best practices bảo mật cho database
        
            8. Scaling và Performance:
               - Đề xuất chiến lược partitioning hoặc sharding nếu cần
               - Thảo luận về cách implement caching ở mức database
               - Đề xuất cách tối ưu hóa queries phức tạp
               - Thảo luận về cách monitor và tune database performance
        
            9. Backup và Recovery:
               - Đề xuất chiến lược backup phù hợp
               - Mô tả quy trình recovery trong trường hợp mất dữ liệu
               - Thảo luận về cách implement high availability và disaster recovery
               - Đề xuất các công cụ và best practices cho backup và recovery
        
            10. Tích hợp với Application Layer:
                - Thảo luận về cách tích hợp schema với ORM hoặc data access layer
                - Đề xuất cách xử lý connection pooling
                - Thảo luận về cách implement caching ở application layer
                - Đề xuất best practices cho việc viết database queries trong application code
        
            Vấn đề cần thiết kế schema:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'security_analysis') {
            promptText = `Phân tích bảo mật cho hệ thống hoặc đoạn code sau bằng tiếng Việt. Hãy thực hiện các bước sau một cách cực kỳ chi tiết và toàn diện:
        
            1. Xác định các potential security vulnerabilities:
               - Phân tích code hoặc hệ thống để tìm ít nhất 10 lỗ hổng bảo mật tiềm ẩn
               - Mô tả chi tiết cách mỗi lỗ hổng có thể bị khai thác
               - Thảo luận về các điều kiện cần thiết để lỗ hổng tồn tại
               - Đề xuất các test cases để xác nhận sự tồn tại của mỗi lỗ hổng
        
            2. Đánh giá mức độ nghiêm trọng của mỗi vulnerability:
               - Sử dụng một hệ thống đánh giá chuẩn (ví dụ: CVSS) để đánh giá mỗi lỗ hổng
               - Phân tích tác động tiềm ẩn của mỗi lỗ hổng đối với hệ thống và dữ liệu
               - Thảo luận về khả năng xảy ra và mức độ dễ khai thác của mỗi lỗ hổng
               - Xếp hạng các lỗ hổng theo mức độ ưu tiên cần xử lý
        
            3. Đề xuất các biện pháp khắc phục cụ thể:
               - Đề xuất ít nhất 3 giải pháp cho mỗi lỗ hổng đã xác định
               - Mô tả chi tiết cách implement mỗi giải pháp
               - Thảo luận về ưu và nhược điểm của mỗi giải pháp
               - Đề xuất lộ trình triển khai các giải pháp theo thứ tự ưu tiên
        
            4. Thảo luận về các best practices bảo mật:
               - Liệt kê ít nhất 15 best practices bảo mật phù hợp với hệ thống
               - Giải thích chi tiết cách áp dụng mỗi best practice
               - Thảo luận về lợi ích và potential challenges khi áp dụng mỗi best practice
               - Đề xuất cách tích hợp các best practices vào quy trình phát triển
        
            5. Đề xuất cách implement security testing và monitoring:
               - Đề xuất chiến lược testing bảo mật toàn diện (SAST, DAST, penetration testing, etc.)
               - Mô tả cách set up và cấu hình các công cụ monitoring bảo mật
               - Thảo luận về cách xử lý và phản ứng với các security alerts
               - Đề xuất quy trình incident response và recovery
        
            6. Phân tích bảo mật ở các lớp khác nhau:
               - Thảo luận về bảo mật ở lớp network (firewalls, IDS/IPS, etc.)
               - Phân tích bảo mật ở lớp application (input validation, authentication, etc.)
               - Đánh giá bảo mật ở lớp data (encryption, access control, etc.)
               - Thảo luận về bảo mật physical và environmental
        
            7. Compliance và Regulations:
               - Xác định các tiêu chuẩn và quy định bảo mật liên quan (GDPR, PCI DSS, etc.)
               - Thảo luận về cách đảm bảo tuân thủ các tiêu chuẩn này
               - Đề xuất cách implement và duy trì các controls cần thiết
               - Thảo luận về cách chuẩn bị cho các cuộc audit bảo mật
        
            8. Threat Modeling:
               - Thực hiện phân tích threat modeling cho hệ thống
               - Xác định các potential attackers và motivations của họ
               - Mô tả các attack vectors và scenarios có thể xảy ra
               - Đề xuất các countermeasures cho mỗi threat
        
            9. Secure Development Lifecycle:
               - Đề xuất quy trình phát triển bảo mật (SDL) phù hợp
               - Thảo luận về cách tích hợp bảo mật vào mỗi giai đoạn của SDLC
               - Đề xuất các công cụ và practices cho secure coding
               - Thảo luận về cách thực hiện code reviews tập trung vào bảo mật
        
            10. Đào tạo và Awareness:
                - Đề xuất chương trình đào tạo bảo mật cho các developers và stakeholders
                - Thảo luận về cách nâng cao nhận thức bảo mật trong tổ chức
                - Đề xuất các resources và tools để học hỏi về bảo mật
                - Thảo luận về cách xây dựng văn hóa bảo mật trong tổ chức
        
            Hệ thống hoặc đoạn code cần phân tích:
            ${inputText}
        
            Hãy đảm bảo phân tích cực kỳ chi tiết, đưa ra nhiều ví dụ cụ thể, và cung cấp hướng dẫn rõ ràng để người đọc có thể áp dụng được ngay.`;
        }
        else if (selectedPrompt === 'ielts_reading_practice') {
            const selectedTypes = selectedIeltsTypes || []; // Ensure it's an array
            promptText = `Tạo một bài tập IELTS Reading dựa trên văn bản sau. Bao gồm các dạng bài sau: ${selectedTypes.join(', ')}. Nếu không có dạng bài nào được chọn, hãy tạo một bài tập tổng hợp với nhiều dạng khác nhau.
        
            Văn bản:
            "${inputText}"
        
            Hãy tạo bài tập với các yêu cầu sau:
            1. Một đoạn văn hoặc bài đọc dài (khoảng 700-1000 từ) dựa trên văn bản gốc.
            2. Ít nhất 10 câu hỏi thuộc các dạng đã chọn (hoặc tổng hợp nếu không có dạng nào được chọn). Mỗi dạng bài nên có ít nhất 3-5 câu hỏi.
            3. Cung cấp đáp án và giải thích.
            4. Có thể cung cấp danh sách từ vựng, với định nghĩa bằng tiếng Việt.
        
            Hãy trình bày bài tập một cách rõ ràng và dễ hiểu, phù hợp với format của bài thi IELTS Reading. Đảm bảo độ khó của bài tập phù hợp với cấp độ IELTS.`;
        }
        else if (selectedPrompt === 'ielts_listening_practice') {
            const selectedTypes = selectedIeltsListeningTypes || []; // Ensure it's an array
            promptText = `Tạo một bài tập IELTS Listening dựa trên văn bản sau. Bao gồm các dạng bài sau: ${selectedTypes.join(', ')}. Nếu không có dạng bài nào được chọn, hãy tạo một bài tập tổng hợp với nhiều dạng khác nhau.
    
            Văn bản:
            "${inputText}"
    
            Hãy tạo bài tập với các yêu cầu sau:
            1. Một đoạn văn hoặc bài nghe giả định (khoảng 300-500 từ) dựa trên văn bản gốc.
            2. Ít nhất 10 câu hỏi thuộc các dạng đã chọn (hoặc tổng hợp nếu không có dạng nào được chọn). Mỗi dạng bài nên có ít nhất 2-3 câu hỏi.
            3. Cung cấp đáp án và giải thích.
            4. Có thể cung cấp danh sách từ vựng, với định nghĩa bằng tiếng Việt.
            5. Đảm bảo bài tập phù hợp với format của bài thi IELTS Listening, bao gồm cả việc sử dụng các từ khóa và cụm từ thường xuất hiện trong bài nghe.
    
            Hãy trình bày bài tập một cách rõ ràng và dễ hiểu, phù hợp với format của bài thi IELTS Listening. Đảm bảo độ khó của bài tập phù hợp với cấp độ IELTS.`;
        }
        else if (selectedPrompt === 'ielts_writing_practice') {
            promptText = `Tạo một bài tập luyện IELTS Writing Task 2 dựa trên chủ đề sau:
    
            "${inputText}"
    
            Hãy cung cấp:
            1. Đề bài IELTS Writing Task 2 hoàn chỉnh
            2. Gợi ý cấu trúc bài viết
            3. Từ vựng và cụm từ quan trọng liên quan đến chủ đề
            4. Ví dụ về câu mở đầu và kết luận
            5. Các ý tưởng chính cho phần thân bài
            6. Lưu ý về ngữ pháp và cấu trúc câu nên sử dụng
            7. Tiêu chí chấm điểm và lời khuyên để đạt điểm cao
    
            Hãy trình bày chi tiết và cụ thể để người học có thể dễ dàng áp dụng.`;
        }
        else if (selectedPrompt === 'ielts_speaking_practice') {
            promptText = `Tạo một bài tập luyện IELTS Speaking dựa trên chủ đề sau:
    
            "${inputText}"
    
            Hãy cung cấp:
            1. Câu hỏi cho Part 1 (4-5 câu)
            2. Chủ đề và câu hỏi cho Part 2 (cue card)
            3. Câu hỏi follow-up cho Part 3 (5-6 câu)
            4. Từ vựng và cụm từ quan trọng liên quan đến chủ đề
            5. Mẫu câu trả lời cho một số câu hỏi
            6. Lưu ý về phát âm và ngữ điệu
            7. Chiến lược trả lời cho từng phần
            8. Tiêu chí chấm điểm và lời khuyên để đạt điểm cao
    
            Hãy trình bày chi tiết và cụ thể để người học có thể dễ dàng luyện tập.`;
        }
        else if (selectedPrompt === 'toeic_practice') {
            promptText = `Tạo một bài tập luyện TOEIC dựa trên chủ đề sau:
    
            "${inputText}"
    
            Hãy cung cấp:
            1. Một đoạn văn ngắn hoặc đối thoại liên quan đến chủ đề (khoảng 100-150 từ)
            2. 5 câu hỏi trắc nghiệm về đoạn văn/đối thoại (với 4 lựa chọn cho mỗi câu)
            3. 5 câu incomplete sentences
            4. 5 câu error identification
            5. Từ vựng và cụm từ quan trọng liên quan đến chủ đề
            6. Giải thích đáp án cho mỗi câu hỏi
            7. Lưu ý về ngữ pháp và cấu trúc câu thường gặp trong TOEIC
            8. Chiến lược làm bài và quản lý thời gian
    
            Hãy trình bày chi tiết và cụ thể để người học có thể dễ dàng luyện tập và cải thiện kỹ năng TOEIC.`;
        }
        else if (selectedPrompt === 'english_conversation') {
            promptText = `Tạo một bài tập luyện tiếng Anh giao tiếp dựa trên tình huống sau:
    
            "${inputText}"
    
            Hãy cung cấp:
            1. Mô tả chi tiết về tình huống giao tiếp
            2. Đoạn hội thoại mẫu liên quan đến tình huống (khoảng 10-15 câu trao đổi)
            3. Từ vựng và cụm từ quan trọng sử dụng trong tình huống
            4. Giải thích về ngữ cảnh và văn hóa (nếu cần)
            5. Các cách diễn đạt khác nhau cho cùng một ý
            6. Lưu ý về ngữ điệu, cách phát âm và nhấn mạnh
            7. Bài tập thực hành: 5 câu hỏi hoặc tình huống để người học tự trả lời
            8. Gợi ý để mở rộng cuộc hội thoại
    
            Hãy trình bày chi tiết và cụ thể để người học có thể dễ dàng luyện tập và cải thiện kỹ năng giao tiếp tiếng Anh.`;
        }
        else {
            promptText = `${selectedPrompt} trong khoảng 50000 từ: ${inputText}`;
>>>>>>> c0075df (Reinitialize Git repository)
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: promptText
                            }
                        ]
                    }
                ]
            }
        );

        const generatedSummary = response.data.candidates[0]?.content?.parts[0]?.text;
        if (generatedSummary) {
<<<<<<< HEAD
            setSummary(generatedSummary);
=======
            let finalSummary = generatedSummary;
            setSummary(finalSummary);
>>>>>>> c0075df (Reinitialize Git repository)
            setInputExpanded(false);

            const keywordPrompt = `Trích xuất 15 từ khóa quan trọng nhất từ văn bản sau, chỉ liệt kê các từ khóa, không giải thích: ${generatedSummary}`;
            const keywordResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                {
                    contents: [{ parts: [{ text: keywordPrompt }] }]
                }
            );
            const extractedKeywords = keywordResponse.data.candidates[0]?.content?.parts[0]?.text
                .split(/[,\n]/)
                .map(k => k.trim())
                .filter(k => k.length > 0);
            setKeywords(extractedKeywords);

            setCodeSections([]);

            if (selectedPrompt === 'cv') {
                const pairs = generatedSummary.split('\n\n').map(pair => {
                    const [question, answer] = pair.split('\n');
                    return { question, answer };
                });
                setInterviewQuestions(pairs);
            } else {
                setInterviewQuestions([]);
            }

            // Removed the suggested prompts generation
        } else {
            setErrorMessage('No summary generated. Please check the input or try again.');
        }
    } catch (error) {
<<<<<<< HEAD
        console.error('Error summarizing text:', error.response || error.message);
=======
        console.error('Error summarizing text:', error.response?.data?.error?.message || error.message);
>>>>>>> c0075df (Reinitialize Git repository)
        setErrorMessage('Error occurred while summarizing the text: ' + (error.response?.data?.error?.message || error.message));
    } finally {
        setIsLoading(false);
    }
};

export const handleCreateQuiz = async (summary, api, setIsLoading, setErrorMessage, setQuizQuestions) => {
    if (!summary) {
        setErrorMessage('Please generate a summary first');
        return;
    }

    setIsLoading(true);
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
            {
                contents: [
                    {
                        parts: [
                            {
<<<<<<< HEAD
                                text: `Dựa trên đoạn tóm tắt sau, hãy tạo 20 câu hỏi trắc nghiệm với 4 lựa chọn cho mỗi câu. Đảm bảo chỉ có một đáp án đúng cho mỗi câu hỏi. Trả lời theo định dạng JSON như sau:
=======
                                text: `Dựa trên đoạn tóm tắt sau, hãy tạo 20 câu hỏi trắc nghiệm với 4 lựa chọn cho mỗi câu. Đảm bảo chỉ có một đáp án đúng cho mỗi câu hỏi. Hãy đảm bảo rằng đáp án đúng được phân bố ngẫu nhiên giữa các lựa chọn A, B, C, D. Trả lời theo định dạng JSON như sau:
>>>>>>> c0075df (Reinitialize Git repository)
                                [
                                    {
                                        "question": "Câu hỏi",
                                        "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
                                        "correctAnswer": 0,
                                        "explanation": "Giải thích cụ thể và chi tiết tại sao đáp án này là đúng và các đáp án khác là sai"
                                    },
                                    ...
                                ]
<<<<<<< HEAD
                                Trong đó correctAnswer là chỉ số của đáp án đúng (0-3).
=======
                                Trong đó correctAnswer là chỉ số của đáp án đúng (0-3). Hãy đảm bảo rằng correctAnswer có sự phân bố đều giữa các giá trị 0, 1, 2, 3 trong toàn bộ bộ câu hỏi.
>>>>>>> c0075df (Reinitialize Git repository)
                                Đây là đoạn tóm tắt:
                                "${summary}"`
                            }
                        ]
                    }
                ]
            }
        );

        const quizQuestionsText = response.data.candidates[0]?.content?.parts[0]?.text;

        // Tìm và trích xuất phần JSON từ chuỗi trả về
        const jsonMatch = quizQuestionsText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            const jsonString = jsonMatch[1].trim();
            const quizQuestions = JSON.parse(jsonString);
<<<<<<< HEAD
=======

            // Kiểm tra phân bố của đáp án đúng
            const distribution = quizQuestions.reduce((acc, q) => {
                acc[q.correctAnswer] = (acc[q.correctAnswer] || 0) + 1;
                return acc;
            }, {});

            console.log("Phân bố đáp án đúng:", distribution);

>>>>>>> c0075df (Reinitialize Git repository)
            setQuizQuestions(quizQuestions);
        } else {
            throw new Error('Không tìm thấy dữ liệu JSON hợp lệ trong phản hồi');
        }
    } catch (error) {
        console.error('Error creating quiz:', error);
        setErrorMessage('Error occurred while creating the quiz: ' + error.message);
    } finally {
        setIsLoading(false);
    }
};

// Đăng ký các ngôn ngữ cho SyntaxHighlighter ở cuối file
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('powershell', powershell);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('scala', scala);
SyntaxHighlighter.registerLanguage('dart', dart);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('groovy', groovy);
SyntaxHighlighter.registerLanguage('perl', perl);
SyntaxHighlighter.registerLanguage('matlab', matlab);
SyntaxHighlighter.registerLanguage('r', r);
SyntaxHighlighter.registerLanguage('scheme', scheme);
SyntaxHighlighter.registerLanguage('lisp', lisp);
SyntaxHighlighter.registerLanguage('prolog', prolog);
SyntaxHighlighter.registerLanguage('haskell', haskell);
SyntaxHighlighter.registerLanguage('erlang', erlang);
SyntaxHighlighter.registerLanguage('clojure', clojure);
SyntaxHighlighter.registerLanguage('coffeescript', coffeescript);