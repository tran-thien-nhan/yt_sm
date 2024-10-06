import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import axios from 'axios';

const FlowchartComponent = ({ summary }) => {
  const mermaidRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });

    const generateFlowchart = async () => {
      if (mermaidRef.current) {
        try {
          const sanitizedInput = await sanitizeInput(summary);
          const flowchartDef = await generateFlowchartDefinition(sanitizedInput);
          const sanitizedFlowchartDef = sanitizeMermaidSyntax(flowchartDef);
          const { svg } = await mermaid.render('flowchart', sanitizedFlowchartDef);
          mermaidRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          mermaidRef.current.innerHTML = `<div class="error">Flowchart generation failed. Please check input format.</div>`;
        }
      }
    };

    generateFlowchart();
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
                  text: `Sanitize the following text for use in a Mermaid flowchart. Remove any special characters or formatting that might interfere with Mermaid syntax: ${text}`
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

  const generateFlowchartDefinition = async (text) => {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB9Ckwlluxnx1ka93LXZditdOz1L7yMGs4',
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate a Mermaid flowchart definition based on the following text. Use proper Mermaid syntax: ${text}`
                }
              ]
            }
          ]
        }
      );
      return response.data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Error generating flowchart definition:', error);
      return '';
    }
  };

  const sanitizeMermaidSyntax = (mermaidCode) => {
    // Ensure the flowchart starts with the correct syntax
    let sanitized = 'flowchart TD\n';
    
    // Split the code into lines and process each line
    const lines = mermaidCode.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (/^[A-Za-z0-9_-]+(\[.*?\])?$/.test(line)) {
        // Node definition
        sanitized += line + '\n';
      } else if (/^[A-Za-z0-9_-]+\s*(-+>|=+>|\.-+>|==+>)\s*[A-Za-z0-9_-]+/.test(line)) {
        // Edge definition
        sanitized += line + '\n';
      }
    }

    return sanitized;
  };

  return <div ref={mermaidRef}></div>;
};

export default FlowchartComponent;
