import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);


const app = express();

// Configure CORS to allow both local and Netlify domains
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://tutorsjt.netlify.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/generate-scenario', async (req, res) => {
  try {
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const requestBody = {
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{
        role: "user",
        content: `Generate a medical ethics scenario for a Situational Judgment Test (SJT) with exactly 3 follow-up questions. The scenario should be realistic and challenging, focusing on healthcare professional decision-making.

Format the response EXACTLY as a JSON object with the following structure, ensuring valid JSON:
{
  "scenario": "detailed scenario text here",
  "questions": [
    "first question here",
    "second question here",
    "third question here"
  ]
}

Make the scenario detailed but concise, around 150-200 words. Ensure the response is properly formatted JSON without any special characters or line breaks in the strings.`
      }],
      temperature: 0.7
    };

    console.log('Making request to OpenRouter API...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': req.headers.origin || 'https://tutorsjt.netlify.app',
        'X-Title': 'SJT Test Simulator'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Response Status:', response.status);
      console.error('API Response:', errorData);
      throw new Error(`OpenRouter API request failed: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Raw API Response:', data);
    
    const content = data.choices[0].message.content;
    console.log('Content before parsing:', content);
    
    try {
      // Try to clean the content before parsing
      const cleanContent = content
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\t/g, ' ')
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, '')
        .replace(/\\/g, '\\\\');
        
      const scenarioData = JSON.parse(cleanContent);
      console.log('Parsed scenario data:', scenarioData);
      res.json(scenarioData);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Failed to parse content:', content);
      throw new Error(`Failed to parse scenario data: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error generating scenario:', error);
    res.status(500).json({ 
      error: 'Failed to generate scenario', 
      details: error.message,
      type: error.constructor.name
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
