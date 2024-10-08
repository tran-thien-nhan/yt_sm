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


export const handleSummarize = async (inputText, selectedPrompt, summaryLength, api, setIsLoading, setSummary, setErrorMessage, setInputExpanded, setKeywords, setCodeSections, setInterviewQuestions, selectedLanguage, setSelectedLanguage) => {
    if (!inputText) return;

    setIsLoading(true);
    setSummary('');
    setErrorMessage('');

    try {
        let promptText = '';

        if (selectedPrompt === 'specific') {
            promptText = `cụ thể hơn bằng tiếng việt: ${inputText}`;
        } else if (selectedPrompt === 'detailed') {
            promptText = `giải thích và hướng dẫn cụ thể hơn có ví dụ cụ thể, nếu có code thì code cụ thể, cực kỳ chi tiết và viết dài hơn bằng tiếng việt: ${inputText}`;
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
        } else {
            promptText = `${selectedPrompt} trong khoảng ${summaryLength} từ: ${inputText}`;
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
            setSummary(generatedSummary);
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
        console.error('Error summarizing text:', error.response || error.message);
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
                                text: `Dựa trên đoạn tóm tắt sau, hãy tạo 20 câu hỏi trắc nghiệm với 4 lựa chọn cho mỗi câu. Đảm bảo chỉ có một đáp án đúng cho mỗi câu hỏi. Trả lời theo định dạng JSON như sau:
                                [
                                    {
                                        "question": "Câu hỏi",
                                        "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
                                        "correctAnswer": 0,
                                        "explanation": "Giải thích cụ thể và chi tiết tại sao đáp án này là đúng và các đáp án khác là sai"
                                    },
                                    ...
                                ]
                                Trong đó correctAnswer là chỉ số của đáp án đúng (0-3).
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