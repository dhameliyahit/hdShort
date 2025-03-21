import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';


function App() {
  const [short, setShort] = useState(null);
  const [url, setURL] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");

  const validateURL = (input) => {
    const urlPattern = /^(https?:\/\/)([\w.-]+)/i;
    if (!urlPattern.test(input) && input !== "") {
      setError("Please enter a valid URL");
    } else {
      setError("");
    }
    setURL(input);
  };

  async function ShortURL() {
    
    try {
      setLoading(true)
      const response = await fetch("https://hdshort.vercel.app/api/v1/shortner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalURL: url,
        }),
      });
      setLoading(false)
      const result = await response.json();
      if (response.ok) {
        setShort(result);
        setCopied(false); // Reset copied state
        toast("Short URL Generate Successfully")
      } else {
        console.error("Error:", result.message);
        toast("Error While send Request")
      }
    } catch (e) {
      console.error("Error while shortening URL:", e);
    }
  }

  function copyToClipboard() {
    if (short) {
      navigator.clipboard.writeText(`${short.backEndURL}/${short.shortURL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-white text-xl font-bold text-center mb-4">
            Shorten Your URL
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => validateURL(e.target.value)}
                placeholder="Enter long URL..."
                className={`block flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            <button
              onClick={ShortURL}
              disabled={loading}
              className="px-6 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {loading ? "Loading..." : "Short URL"}
            </button>
          </div>

          {short && (
            <div className="mt-4 flex items-center justify-between bg-gray-700 px-4 py-3 rounded-lg">
              <span className="text-white truncate">
                {`${short.backEndURL}/${short.shortURL}`}
              </span>
              <button
                onClick={copyToClipboard}
                className="ml-3 text-blue-400 hover:text-blue-300 transition"
              >
                📋
              </button>
            </div>
          )}

          {copied && (
            <p className="text-green-400 mt-2 text-center">Copied to clipboard!</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
