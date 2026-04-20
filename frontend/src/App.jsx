import { useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  if (page === "upload") {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-center transition-all duration-500 hover:scale-105">
          <h1 className="text-2xl font-bold mb-4">Upload Image</h1>

          <label className="block mb-4">
            <span className="block mb-2 text-sm text-gray-300">
              Choose Image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setResult("");
                setConfidence(null);
              }}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 cursor-pointer"
            />
          </label>

          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-full rounded-lg mb-4"
            />
          )}

          <button
            onClick={async () => {
              if (!file) {
                alert("Upload image first");
                return;
              }

              const formData = new FormData();
              formData.append("file", file);

              try {
                setLoading(true);

                const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();
                setResult(data.emotion);
                setConfidence(data.confidence);
              } catch (err) {
                alert("Backend error");
                console.error(err);
              } finally {
                setLoading(false);
              }
            }}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
          >
            Detect Emotion
          </button>

          {loading && (
            <p className="mt-4 text-sm text-gray-300">Detecting...</p>
          )}

          {result && (
            <div className="mt-4 bg-black/30 p-4 rounded-lg">
              <h2 className="text-3xl">
                {result === "happy" && "😊"}
                {result === "sad" && "😢"}
                {result === "angry" && "😠"}
                {result === "surprise" && "😲"}
                {result === "neutral" && "😐"}
                {result === "fear" && "😨"}
                {result === "disgust" && "🤢"}
                {result === "No face detected" && "🫥"}
              </h2>

              <p className="mt-2 text-lg">
                {result.charAt(0).toUpperCase() + result.slice(1)}
              </p>

              {confidence !== null && (
                <p className="text-sm text-gray-300 mt-1">
                  Confidence: {(confidence * 100).toFixed(1)}%
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => setPage("home")}
            className="mt-6 text-sm text-gray-300 hover:text-white"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex items-center justify-center text-white">
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Emotion AI</h1>

        <p className="text-lg text-gray-300 mb-6">
          Detect emotions from images using AI
        </p>

        <button
          onClick={async () => {
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/`);
              await res.json();
              setPage("upload");
            } catch {
              alert("Backend not running");
            }
          }}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;