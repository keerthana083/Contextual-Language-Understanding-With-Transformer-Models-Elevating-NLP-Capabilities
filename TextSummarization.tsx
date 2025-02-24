import React, { useState } from "react";
import { FileText, Loader, CheckCircle, AlertTriangle, Copy, Upload } from "lucide-react";
import { hf } from "../utils/api";

const TextSummarization: React.FC = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const summarizeText = async () => {
    if (!text.trim()) {
      setError("⚠️ Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);
    setCopied(false);

    try {
      const response = await hf.summarization({
        model: "facebook/bart-large-cnn",
        inputs: text,
        parameters: { max_length: 300, min_length: 200 },
      });

      if (!response || !response.summary_text) {
        throw new Error("❌ Failed to generate summary. Please try again.");
      }

      const formattedSummary = response.summary_text
        .split(". ")
        .filter(
          (point: string) =>
            point.length > 0 &&
            !point.includes("Back to Mail Online home") &&
            !point.includes("back to the page you came from")
        )
        .map((point: string) => `🔹 ${point.trim()}.`)
        .join("\n");

      setSummary(formattedSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "❌ An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/plain") {
        setError("⚠️ Please upload a valid .txt file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold flex items-center justify-center">
          ✨ AI-Powered Text Summarization
        </h1>
      </div>

      {/* Input Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <label htmlFor="text" className="block text-lg font-semibold text-gray-800 mb-2">
          📝 Enter text or upload a file:
        </label>
        
        {/* File Upload */}
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition-all"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload .txt File
          </label>
        </div>

        {/* Textarea */}
        <textarea
          id="text"
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here (min 100 words for best results)..."
        />
        <div className="text-sm text-gray-500 mt-2">
          🔢 {text.length} characters | 📝 {text.split(" ").length} words
        </div>

        {/* Generate Button */}
        <button
          onClick={summarizeText}
          disabled={loading}
          className={`w-full mt-4 py-2 px-4 text-white font-medium rounded-lg shadow-md transition-all
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin h-5 w-5 mr-2 text-white" />
              Generating Summary...
            </span>
          ) : (
            "🔍 Generate Summary"
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 flex items-center p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Summary Output */}
        {summary && !error && (
          <div className="mt-6 bg-gray-100 p-5 rounded-lg shadow-lg border-l-4 border-indigo-500 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">📄 Summary</h3>
              </div>
              <button onClick={copyToClipboard} className="text-indigo-600 hover:text-indigo-800" title="Copy to clipboard">
                <Copy className="h-5 w-5" />
              </button>
            </div>
            <pre className="text-gray-700 whitespace-pre-wrap">{summary}</pre>

            {/* Success Indicator */}
            <div className="mt-4 flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Summary Generated Successfully!
            </div>
          </div>
        )}

        {/* Copy Success Message */}
        {copied && (
          <div className="mt-2 text-green-600 text-sm font-semibold">
            ✅ Summary copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSummarization;
