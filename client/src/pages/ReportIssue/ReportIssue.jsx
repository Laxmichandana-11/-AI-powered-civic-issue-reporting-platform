import { useState, useRef, useEffect } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [severity, setSeverity] = useState("low");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation: image type and size (5MB)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid image type. Please upload JPG/PNG/WEBP.");
      e.target.value = null;
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Image too large. Maximum size is 5MB.");
      e.target.value = null;
      return;
    }

    setImage(file);
  };

  // Geolocation: get current position
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (err) => {
        console.error(err);
        alert("Unable to retrieve your location.");
      }
    );
  };

  // Voice transcription using Web Speech API (if available)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let interim = "";
      let final = transcript || "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      setTranscript(final + interim);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (!isRecording) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      recognition.stop();
      setIsRecording(false);
      // Append transcript to description
      if (transcript) setDescription((d) => (d ? d + "\n" + transcript : transcript));
      setTranscript("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("severity", severity);
      formData.append("location", JSON.stringify({ lat, lng, address }));
      if (image) formData.append("image", image);

      const res = await API.post("/reports", formData);

      alert("Report submitted successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit report.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-3 mb-4 border rounded-lg" required />

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-3 mb-4 border rounded-lg" rows={4} required />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 border rounded-lg">
            <option>Pothole</option>
            <option>Garbage</option>
            <option>Streetlight</option>
            <option>Drainage</option>
            <option>Water Leakage</option>
          </select>

          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="p-3 border rounded-lg">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Location (address)</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address or landmark" className="w-full p-3 mb-2 border rounded-lg" />
          <div className="flex gap-2 mb-2">
            <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" className="w-1/2 p-3 border rounded-lg" />
            <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" className="w-1/2 p-3 border rounded-lg" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleGetCurrentLocation} className="px-3 py-2 bg-gray-200 rounded-lg">Get Current Location</button>
            <p className="text-sm text-gray-500">Or enter coordinates manually</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Voice Description (optional)</label>
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={handleToggleRecording} className={`px-3 py-2 rounded-lg ${isRecording ? 'bg-red-500 text-white':'bg-green-500 text-white'}`}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <p className="text-sm text-gray-500">Click to transcribe speech into the description field.</p>
          </div>
          {transcript && (
            <div className="mb-2 p-2 bg-gray-50 border rounded">Live: {transcript}</div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Voice description and AI classification placeholders will be added later.</p>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">Submit Report</button>
      </form>
    </div>
  );
}

export default ReportIssue;