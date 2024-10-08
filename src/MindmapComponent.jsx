import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import axios from 'axios';

const MindmapComponent = ({ summary }) => {
  const mermaidRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });

    const generateMindmap = async () => {
      if (mermaidRef.current) {
        try {
          const sanitizedInput = await sanitizeInput(summary);
          const mindmapDef = await generateMindmapDefinition(sanitizedInput);
          const sanitizedMindmapDef = sanitizeMermaidSyntax(mindmapDef);
          const { svg } = await mermaid.render('mindmap', sanitizedMindmapDef);
          mermaidRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          mermaidRef.current.innerHTML = `<div class="error">Mindmap generation failed. Please check input format.</div>`;
        }
      }
    };

    generateMindmap();
  }, [summary]);

  const sanitizeInput = async (text) => {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
        {
          contents: [
            {
              parts: [
                {
                  text: `Sanitize the following text for use in a Mermaid mindmap. Remove any special characters or formatting that might interfere with Mermaid syntax: ${text}`
                }
              ]
            }
          ]
        }
      );
      return response.data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Error sanitizing input:', error);
      return text;
    }
  };

  const generateMindmapDefinition = async (text) => {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate a Mermaid mindmap definition based on the following text. Use proper Mermaid syntax: ${text}`
                }
              ]
            }
          ]
        }
      );
      return response.data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Error generating mindmap definition:', error);
      return '';
    }
  };

  const sanitizeMermaidSyntax = (mermaidCode) => {
    // Ensure the mindmap starts with the correct syntax
    let sanitized = 'mindmap\n';
    
    // Split the code into lines and process each line
    const lines = mermaidCode.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('root')) {
        sanitized += line + '\n';
      } else if (/^[+-]\s/.test(line)) {
        // Ensure proper indentation and formatting for child nodes
        sanitized += '  ' + line + '\n';
      }
    }

    return sanitized;
  };

  return <div ref={mermaidRef}></div>;
};

export default MindmapComponent;
