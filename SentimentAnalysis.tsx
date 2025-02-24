import React, { useState } from "react";
import * as Papa from "papaparse";

type SentimentResult = {
  text: string;
  label: string;
  reason: string;
  score: number;
};

const SentimentAnalysis: React.FC = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<string[]>([]);
  const [startRow, setStartRow] = useState<number | null>(null);
  const [endRow, setEndRow] = useState<number | null>(null);

  // Handle File Upload (CSV, JSON, TXT)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setError(null); // Reset error on new upload

      if (file.name.endsWith(".txt")) {
        const lines = content.split(/\r?\n/).map((line) => line.trim()).filter((line) => isNaN(Number(line))); 
        setUploadedData(lines);
      } else if (file.name.endsWith(".csv")) {
        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const rows = result.data as { Text: string }[];
            setUploadedData(rows.map((row) => row.Text?.trim()).filter(Boolean));
          },
          error: () => setError("Error parsing CSV file."),
        });
      } else if (file.name.endsWith(".json")) {
        try {
          const jsonData = JSON.parse(content);
          if (Array.isArray(jsonData) && jsonData.every((item) => typeof item.text === "string")) {
            setUploadedData(jsonData.map((item) => item.text.trim()).filter(Boolean));
          } else {
            setError("Invalid JSON format. Ensure the file contains an array of objects with a 'text' field.");
          }
        } catch {
          setError("Error parsing JSON file.");
        }
      } else {
        setError("Unsupported file format. Upload CSV, JSON, or TXT.");
      }
    };
    reader.readAsText(file);
  };

  // Sentiment Analysis Logic
  const analyzeSentiment = (text: string): SentimentResult => {
    const positiveWords = ["good", "happy", "amazing", "love", "great", "excellent", "wonderful"];
    const negativeWords = ["bad", "sad", "terrible", "hate", "awful", "horrible"];

    let score = Math.random(); // Simulating score
    let label = "Neutral";
    let reason = "Balanced or mixed sentiment.";

    if (positiveWords.some((word) => text.toLowerCase().includes(word))) {
      label = "Positive";
      reason = `Contains optimistic words like "${positiveWords.find((word) => text.includes(word))}".`;
      score = Math.random() * 0.5 + 0.5; // Higher score for positivity
    } else if (negativeWords.some((word) => text.toLowerCase().includes(word))) {
      label = "Negative";
      reason = `Contains negative words like "${negativeWords.find((word) => text.includes(word))}".`;
      score = Math.random() * 0.5; // Lower score for negativity
    }

    return { text, label, reason, score };
  };

  // Analyze selected rows
  const analyzeRows = () => {
    if (startRow === null || endRow === null || startRow < 0 || endRow >= uploadedData.length || startRow > endRow) {
      setError("Please enter valid row numbers.");
      return;
    }

    const selectedSentences = uploadedData.slice(startRow, endRow + 1);
    const newResults = selectedSentences.map(analyzeSentiment);
    setResults(newResults);
    setError(null);
  };

  // Handle Text Input Analysis
  const analyzeText = () => {
    if (!textInput.trim()) {
      setError("Please enter text.");
      return;
    }
    setResults([analyzeSentiment(textInput)]);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">✨ Sentiment Analysis ✨</h2>

      {/* Text Input */}
      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter text for sentiment analysis..."
        rows={4}
        className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      ></textarea>
      <button
        onClick={analyzeText}
        className="w-full mt-3 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition text-lg"
      >
        Analyze Text
      </button>

      {/* File Upload */}
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Upload a File:</label>
        <input
          type="file"
          accept=".csv,.json,.txt"
          onChange={handleFileUpload}
          className="block w-full text-gray-600 border p-2 rounded-lg"
          title="Upload a file for sentiment analysis"
        />
      </div>

      {/* Row Selection */}
      {uploadedData.length > 0 && (
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Select Rows for Analysis:</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max={uploadedData.length - 1}
              value={startRow ?? ""}
              onChange={(e) => setStartRow(Number(e.target.value))}
              className="w-1/2 p-2 border rounded-lg text-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Start Row"
            />
            <input
              type="number"
              min="0"
              max={uploadedData.length - 1}
              value={endRow ?? ""}
              onChange={(e) => setEndRow(Number(e.target.value))}
              className="w-1/2 p-2 border rounded-lg text-lg focus:ring-2 focus:ring-blue-400"
              placeholder="End Row"
            />
          </div>
          <button
            onClick={analyzeRows}
            className="w-full mt-3 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition text-lg"
          >
            Analyze Selected Rows
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-600 font-semibold text-lg mt-3">{error}</p>}

      {/* Sentiment Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-700 mb-2">📊 Results:</h3>
          {results.map((result, index) => (
            <div key={index} className={`p-5 rounded-lg mb-3 shadow-md border-l-8 ${result.label === "Positive" ? "border-green-500 bg-green-100" : result.label === "Negative" ? "border-red-500 bg-red-100" : "border-yellow-500 bg-yellow-100"}`}>
              <p className="text-lg font-bold">📌 Sentence {index + 1}:</p>
              <p className="text-lg">{result.text}</p>
              <p className="text-lg font-semibold">
                <strong>🔍 Sentiment:</strong> <span className={`ml-2 ${result.label === "Positive" ? "text-green-600" : result.label === "Negative" ? "text-red-600" : "text-yellow-600"}`}>{result.label}</span>
              </p>
              <p className="text-gray-600"><strong>💡 Reason:</strong> {result.reason}</p>
              <p className="font-bold text-blue-600"><strong>📈 Score:</strong> {result.score.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
