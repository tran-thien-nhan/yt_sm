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