import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Button } from '@mui/material';
import { FaLightbulb, FaChartBar, FaUserCheck } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { apiKey } from './const';

const InfographicComponent = ({ summary, isDarkMode }) => {
  const [infographicData, setInfographicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const infographicRef = useRef(null);

  useEffect(() => {
    generateInfographic();
  }, [summary]);

  const generateInfographic = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Create an infographic based on the following summary. Provide a JSON structure with sections, key points, and suggested icons or images for each section:

${summary}

Format the response as a valid JSON object with the following structure:
{
  "title": "Main title for the infographic",
  "sections": [
    {
      "heading": "Section heading",
      "points": ["Key point 1", "Key point 2", ...],
      "icon": "Suggested icon or image description"
    },
    ...
  ]
}`
                }
              ]
            }
          ]
        }
      );

      let infographicContent = response.data.candidates[0]?.content?.parts[0]?.text;
      infographicContent = infographicContent.replace(/```json|```/g, '').trim();
      const parsedInfographic = JSON.parse(infographicContent);
      setInfographicData(parsedInfographic);
    } catch (error) {
      console.error('Error generating infographic:', error);
      setError('Failed to generate infographic. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInfographic = () => {
    html2canvas(infographicRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'infographic.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const getIcon = (iconDescription) => {
    if (iconDescription.toLowerCase().includes("idea")) return <FaLightbulb />;
    if (iconDescription.toLowerCase().includes("statistic")) return <FaChartBar />;
    if (iconDescription.toLowerCase().includes("user")) return <FaUserCheck />;
    return null;
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!infographicData) {
    return <Typography>No infographic data available.</Typography>;
  }

  return (
    <div>
      <div ref={infographicRef} className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-3xl font-extrabold mb-6">{infographicData.title}</h2>
        {infographicData.sections.map((section, index) => (
          <div key={index} className="mb-8 p-4 rounded-lg border border-gray-300 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{getIcon(section.icon)}</span>
              <h3 className="text-xl font-bold">{section.heading}</h3>
            </div>
            <ul className="list-disc pl-6">
              {section.points.map((point, pointIndex) => (
                <li key={pointIndex} className="mb-1 text-lg">{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Button variant="contained" color="primary" onClick={downloadInfographic}>
        Download Infographic
      </Button>
    </div>
  );
};

export default InfographicComponent;
