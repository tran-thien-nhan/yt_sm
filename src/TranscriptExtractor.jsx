import { useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';

function TranscriptExtractor() {  
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTranscript('');

    try {
      const videoId = extractVideoId(videoUrl);
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      const fullTranscript = transcriptData.map(item => item.text).join(' ');
      setTranscript(fullTranscript);
    } catch (error) {
      setError('Failed to fetch transcript: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  // ... existing code ...
}

export default TranscriptExtractor;

