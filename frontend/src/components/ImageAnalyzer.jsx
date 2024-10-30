import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button, Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Paper, TextField } from '@mui/material';
import { apiKey } from '../const';
import { formatSummary } from '../helper';

const ImageAnalyzer = ({ isDarkMode }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('describe');
  const [isPasteEnabled, setIsPasteEnabled] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const promptOptions = {
    describe: 'Hãy mô tả về hình ảnh này bằng tiếng Việt.',
    identify: 'Hãy xác định các đối tượng chính trong hình ảnh này và mô tả chúng bằng tiếng Việt.',
    analyze: 'Hãy phân tích bố cục và màu sắc của hình ảnh này bằng tiếng Việt.',
    story: 'Hãy tạo một câu chuyện ngắn dựa trên hình ảnh này bằng tiếng Việt.',
    custom: 'custom',
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setImage(blob);
        setImagePreview(URL.createObjectURL(blob));
        break;
      }
    }
  };

  useEffect(() => {
    // Cleanup function to revoke the object URL when component unmounts or image changes
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (isPasteEnabled) {
      window.addEventListener('paste', handlePaste);
    }
    return () => {
      window.removeEventListener('paste', handlePaste);
      // Cleanup function to revoke the object URL when component unmounts or image changes
      return () => {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
      };
    };
  }, [isPasteEnabled, imagePreview]);

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const analyzeImage = async () => {
    if (!image) {
      alert('Vui lòng chọn một hình ảnh!');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const imageData = await fileToGenerativePart(image);
      const fullPrompt = prompt === 'custom' 
        ? `${customPrompt} Hãy trả lời bằng tiếng Việt.`
        : `${promptOptions[prompt]} Hãy trả lời bằng tiếng Việt.`;

      const result = await model.generateContent([fullPrompt, imageData]);
      const response = await result.response;
      const text = response.text();

      setResult(text);
    } catch (error) {
      console.error('Lỗi khi phân tích hình ảnh:', error);
      setResult('Đã xảy ra lỗi khi phân tích hình ảnh.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Phân tích Hình ảnh
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Choose Image
          </Button>
        </label>
        <Button
          variant="contained"
          onClick={() => setIsPasteEnabled(!isPasteEnabled)}
          color={isPasteEnabled ? "secondary" : "primary"}
        >
          {isPasteEnabled ? "Disable Paste" : "Enable Paste"}
        </Button>
      </Box>
      {isPasteEnabled && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: isDarkMode ? 'grey.800' : 'grey.100',
            color: isDarkMode ? 'grey.300' : 'grey.800',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setIsPasteEnabled(true)}
        >
          Click here and paste your image (Ctrl+V)
        </Paper>
      )}
      {imagePreview && (
        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
          />
        </Box>
      )}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="prompt-select-label">Chọn câu hỏi</InputLabel>
        <Select
          labelId="prompt-select-label"
          value={prompt}
          label="Chọn câu hỏi"
          onChange={(e) => setPrompt(e.target.value)}
        >
          <MenuItem value="describe">Mô tả hình ảnh</MenuItem>
          <MenuItem value="identify">Xác định đối tượng</MenuItem>
          <MenuItem value="analyze">Phân tích bố cục và màu sắc</MenuItem>
          <MenuItem value="story">Tạo câu chuyện</MenuItem>
          <MenuItem value="custom">Nhập câu hỏi tùy chỉnh</MenuItem>
        </Select>
      </FormControl>
      {prompt === 'custom' && (
        <TextField
          fullWidth
          label="Nhập câu hỏi tùy chỉnh"
          variant="outlined"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      <Button
        variant="contained"
        onClick={analyzeImage}
        disabled={!image || isLoading}
      >
        Phân tích
      </Button>
      {isLoading && <CircularProgress sx={{ ml: 2 }} />}
      {result && (
        <Box sx={{ mt: 2, p: 2, bgcolor: isDarkMode ? 'grey.800' : 'grey.100', borderRadius: 1 }}>
          <Typography variant="body1">{formatSummary(result)}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageAnalyzer;
