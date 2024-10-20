import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TextField, Button, Box, IconButton, CircularProgress, Typography, Select, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { apiKey } from '../const';
import { formatSummary } from '../helper';

const ChatPractice = ({ practiceType }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [currentPart, setCurrentPart] = useState(1);
    const [cueCard, setCueCard] = useState('');
    const api = apiKey;
    const [part3QuestionCount, setPart3QuestionCount] = useState(0);
    const [proficiencyLevel, setProficiencyLevel] = useState('A1');

    const getTopics = (type) => {
        switch (type) {
            case 'ielts_speaking':
                return ['Work', 'Education', 'Technology', 'Environment', 'Travel'];
            case 'english_conversation':
                return ['Daily Life', 'Hobbies', 'Culture', 'Current Events', 'Food'];
            default:
                return [];
        }
    };

    useEffect(() => {
        if (selectedTopic) {
            const initializeChat = async () => {
                const initialMessage = await getInitialMessage(practiceType, selectedTopic);
                setMessages([{ text: initialMessage, sender: 'assistant' }]);
                setChatHistory([{ role: 'assistant', content: initialMessage }]);
                setIsLoading(true);
                await handleAssistantResponse(initialMessage);
            };
            initializeChat();
        }
    }, [selectedTopic]);

    const getInitialMessage = async (type, topic) => {
        switch (type) {
            case 'ielts_speaking':
                const firstQuestion = await getIELTSQuestion(topic, 1);
                return `Welcome to the IELTS Speaking test. We'll go through all three parts of the test. Let's begin with Part 1. ${firstQuestion}`;
            case 'english_conversation':
                return `Let's start our conversation about "${topic}". ${getConversationStarter(topic, proficiencyLevel)}`;
            default:
                return `Let's begin our English practice session on "${topic}". How would you like to start?`;
        }
    };

    const getIELTSQuestion = async (topic, part) => {
        switch (part) {
            case 1:
                const partOneQuestion = await getPartOneQuestion(topic);
                return `Let's talk about ${topic}. ${partOneQuestion}`;
            case 2:
                const cueCardText = await getCueCard(topic);
                setCueCard(cueCardText);
                return `Now, I'm going to give you a topic and I'd like you to talk about it for 1 to 2 minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Do you understand? Here's your topic: ${cueCardText}`;
            case 3:
                const partThreeQuestion = await getPartThreeQuestion(topic);
                return `Let's consider more general questions related to ${topic}. ${partThreeQuestion}`;
            default:
                const defaultQuestion = await getPartOneQuestion(topic);
                return `Let's move on to the next question about ${topic}. ${defaultQuestion}`;
        }
    };

    const getConversationStarter = async (topic, level) => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Generate a conversation starter question about "${topic}" suitable for an English learner at ${level} level. The question should be appropriate for the chosen level in terms of vocabulary and complexity. Provide only the question without any additional text.`
                                }
                            ]
                        }
                    ]
                }
            );
    
            const starter = response.data.candidates[0]?.content?.parts[0]?.text;
            return starter || `What's your opinion on ${topic}?`;
        } catch (error) {
            console.error('Error generating conversation starter:', error);
            return `What's your opinion on ${topic}?`;
        }
    };

    const getPartOneQuestion = async (topic) => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Generate a Part 1 IELTS Speaking question about the topic "${topic}". The question should be simple, direct, and suitable for a brief response. Do not include any additional text or explanations, just provide the question.`
                                }
                            ]
                        }
                    ]
                }
            );

            const question = response.data.candidates[0]?.content?.parts[0]?.text;
            return question || `Can you tell me a little about your interests in ${topic}?`;
        } catch (error) {
            console.error('Error generating Part 1 question:', error);
            return `Can you tell me a little about your interests in ${topic}?`;
        }
    };

    const getCueCard = async (topic) => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Generate an IELTS Speaking Part 2 cue card about the topic "${topic}". The cue card should include a main topic and 3-4 bullet points for the candidate to address. Format it as follows:
                                    Describe [main topic related to ${topic}]. You should say:
                                    - [bullet point 1]
                                    - [bullet point 2]
                                    - [bullet point 3]
                                    - and explain [final point or overall question]`
                                }
                            ]
                        }
                    ]
                }
            );

            const cueCard = response.data.candidates[0]?.content?.parts[0]?.text;
            return cueCard || `Describe something related to ${topic}. You should say:\n- what it is\n- why it's interesting\n- how you learned about it\n- and explain its significance to you.`;
        } catch (error) {
            console.error('Error generating cue card:', error);
            return `Describe something related to ${topic}. You should say:\n- what it is\n- why it's interesting\n- how you learned about it\n- and explain its significance to you.`;
        }
    };

    const getPartThreeQuestion = async (topic) => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Generate an IELTS Speaking Part 3 question about the topic "${topic}". The question should be more abstract and require a more in-depth response. Provide only the question without any additional text.`
                                }
                            ]
                        }
                    ]
                }
            );

            const question = response.data.candidates[0]?.content?.parts[0]?.text;
            return question || `What are some of the major challenges related to ${topic} in your country?`;
        } catch (error) {
            console.error('Error generating Part 3 question:', error);
            return `What are some of the major challenges related to ${topic} in your country?`;
        }
    };

    const handleAssistantResponse = useCallback(async (userMessage) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const updatedHistory = [...chatHistory, { role: 'user', content: userMessage }];

            if (practiceType === 'english_conversation') {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `You are an English conversation partner for ${practiceType} practice on the topic "${selectedTopic}". The user's proficiency level is ${proficiencyLevel}. Engage in a natural conversation, asking questions and responding appropriately. Vary your questions and avoid repetition. Base your response on this chat history:\n\n${updatedHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nProvide a conversational response in English, suitable for level ${proficiencyLevel}. Ask a new question that hasn't been asked before in this conversation:`
                                    }
                                ]
                            }
                        ]
                    }
                );

                const assistantResponse = response.data.candidates[0]?.content?.parts[0]?.text;

                if (assistantResponse) {
                    const formattedResponse = formatSummary(assistantResponse);
                    setChatHistory([...updatedHistory, { role: 'assistant', content: formattedResponse }]);
                    setMessages(prevMessages => [...prevMessages, { text: formattedResponse, sender: 'assistant' }]);
                } else {
                    throw new Error('No response from the assistant');
                }
            } else if (practiceType === 'ielts_speaking' && currentPart === 3 && part3QuestionCount >= 3) {
                // Time to grade the test
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `You are an IELTS examiner. Please review the following chat history for an IELTS Speaking test and provide a detailed assessment with scores for Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation. Also provide an overall band score and brief feedback on strengths and areas for improvement. Here's the chat history:\n\n${updatedHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
                                    }
                                ]
                            }
                        ]
                    }
                );

                const assessment = response.data.candidates[0]?.content?.parts[0]?.text;
                setChatHistory([...updatedHistory, { role: 'assistant', content: assessment }]);
                setMessages(prevMessages => [...prevMessages, { text: assessment, sender: 'assistant' }]);
                // Reset part3QuestionCount for future tests
                setPart3QuestionCount(0);
            } else {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `You are an IELTS examiner for ${practiceType} practice on the topic "${selectedTopic}". We are currently in Part ${currentPart} of the IELTS Speaking test. Ask questions in the style of an IELTS Speaking test, following the structure and difficulty level appropriate for Part ${currentPart}. Respond to this message and provide the next question or prompt based on the following chat history:\n\n${updatedHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nProvide a detailed response in English:`
                                    }
                                ]
                            }
                        ]
                    }
                );

                const assistantResponse = response.data.candidates[0]?.content?.parts[0]?.text;

                if (assistantResponse) {
                    const formattedResponse = formatSummary(assistantResponse);
                    setChatHistory([...updatedHistory, { role: 'assistant', content: formattedResponse }]);
                    setMessages(prevMessages => [...prevMessages, { text: formattedResponse, sender: 'assistant' }]);

                    // Move to the next part if necessary
                    if (practiceType === 'ielts_speaking' && currentPart < 3 && messages.length > 5) {
                        setCurrentPart(prevPart => prevPart + 1);
                        const nextPartMessage = await getIELTSQuestion(selectedTopic, currentPart + 1);
                        setChatHistory(prev => [...prev, { role: 'assistant', content: nextPartMessage }]);
                        setMessages(prev => [...prev, { text: nextPartMessage, sender: 'assistant' }]);
                    } else if (practiceType === 'ielts_speaking' && currentPart === 3) {
                        setPart3QuestionCount(prevCount => prevCount + 1);
                    }
                } else {
                    throw new Error('No response from the assistant');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            let errorMsg = 'An error occurred while processing your request.';
            if (error.response) {
                console.error('Error response:', error.response.data);
                errorMsg = `Error: ${error.response.data.error.message}`;
            } else if (error.request) {
                console.error('Error request:', error.request);
                errorMsg = 'Unable to connect to the server. Please check your network connection and try again.';
            } else {
                console.error('Error message:', error.message);
                errorMsg = 'An unexpected error occurred. Please check your API key and try again.';
            }
            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [practiceType, selectedTopic, api, chatHistory, currentPart, messages.length, part3QuestionCount, proficiencyLevel]);

    const handleSend = async () => {
        if (!input) return;

        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setChatHistory([...chatHistory, { role: 'user', content: input }]);
        setInput('');
        setIsLoading(true);

        await handleAssistantResponse(input);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const formatMessage = (text) => {
        // ... (same as in the ChatAssistant component)
    };

    return (
        <div className="chat-practice-container w-full">
            <Typography variant="h6" className="mb-4">
                {practiceType === 'ielts_speaking' ? 'IELTS Speaking Practice' : 'English Conversation Practice'}
            </Typography>
            <Select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                fullWidth
                className="mb-4"
            >
                {getTopics(practiceType).map((topic) => (
                    <MenuItem key={topic} value={topic}>{topic}</MenuItem>
                ))}
            </Select>
            {practiceType === 'english_conversation' && (
                <Select
                    value={proficiencyLevel}
                    onChange={(e) => setProficiencyLevel(e.target.value)}
                    fullWidth
                    className="mb-4"
                >
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                </Select>
            )}
            {practiceType === 'ielts_speaking' && (
                <Typography variant="subtitle1" className="mb-2">
                    Current Part: {currentPart}
                </Typography>
            )}
            {cueCard && (
                <Box className="cue-card mb-4 p-4 border border-gray-300 rounded-lg">
                    <Typography variant="subtitle2">Cue Card:</Typography>
                    <Typography>{cueCard}</Typography>
                </Box>
            )}
            <Box className="chat-box mb-4 p-4 border border-gray-300 rounded-lg w-full h-80 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'user' ? 'bg-blue-500 text-white text-right' : 'bg-green-100 text-black text-left'} p-2 my-2 rounded ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'} max-w-3/4`}>
                        {msg.sender === 'assistant' ? (
                            <>{msg.text}</>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="message text-left p-2 my-2 rounded">
                        <CircularProgress size={24} />
                    </div>
                )}
            </Box>
            <div className="flex w-full">
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your response..."
                    className="mr-2"
                    onKeyPress={handleKeyPress}
                />
                <IconButton onClick={handleSend} color="primary">
                    <SendIcon />
                </IconButton>
            </div>
            {errorMessage && (
                <div className="error-message text-red-500 mt-2">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default ChatPractice;