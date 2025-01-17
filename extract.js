import { extract } from 'documind';
import fs from 'fs/promises';
import path from 'path';

async function extractDictionary() {
  try {
    console.log('API Key:', process.env.OPENAI_API_KEY);
    
    const pdfPath = path.resolve('CreeLanguageDictionary.pdf');
    console.log('Using PDF file:', pdfPath);

    const result = await extract({
      file: pdfPath,
      apiKey: process.env.OPENAI_API_KEY,
      schema: [
        {
          name: "title",
          type: "string",
          description: "The title of the dictionary."
        },
        {
          name: "author",
          type: "string",
          description: "The author of the dictionary."
        },
        {
          name: "publicationDate",
          type: "string",
          description: "The publication date of the dictionary."
        },
        {
          name: "entries",
          type: "array",
          description: "The list of Cree language entries.",
          children: [
            {
              name: "word",
              type: "string",
              description: "The Cree word being defined."
            },
            {
              name: "partOfSpeech",
              type: "string",
              description: "The grammatical category of the word."
            },
            {
              name: "pronunciation",
              type: "string",
              description: "The pronunciation of the word."
            },
            {
              name: "meaning",
              type: "string",
              description: "The English translation or explanation."
            },
            {
              name: "examples",
              type: "array",
              description: "Example sentences or phrases.",
              children: [
                {
                  name: "example",
                  type: "string",
                  description: "An example sentence or phrase."
                }
              ]
            }
          ]
        }
      ],
      options: {
        maxPages: 10,
        verbose: true
      }
    });
    
    console.log('Extraction result:', result);
    
    try {
      await fs.writeFile('dictionary-output.json', JSON.stringify(result, null, 2));
      console.log('Successfully saved output to dictionary-output.json');
    } catch (writeError) {
      console.error('Error writing to file:', writeError);
    }
    
  } catch (error) {
    console.error('Error during extraction:', error);
    if (error.response) {
      console.error('API Response:', await error.response.text());
    }
    throw error;
  }
}

(async () => {
  try {
    await extractDictionary();
  } catch (error) {
    console.error('Unhandled error:', error);
    process.exit(1);
  }
})(); 