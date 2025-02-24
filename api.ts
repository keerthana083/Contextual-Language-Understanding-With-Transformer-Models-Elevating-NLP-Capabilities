import { HfInference } from '@huggingface/inference';

export const validateApiKey = () => {
  const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;

  // Debugging: Log the API key value
  console.log("Loaded API Key:", apiKey);

  if (!apiKey) {
    throw new Error('Invalid API key. Please set the correct key in the .env file');
  }
  
  return new HfInference(apiKey);
};

export const hf = validateApiKey();
