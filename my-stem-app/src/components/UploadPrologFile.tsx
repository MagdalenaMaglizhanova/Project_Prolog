import { useState } from "react";
import { supabase } from "../services/supabase";

const folders = ["animals", "geography", "history"]; // папките, които вече имаш в Supabase

export default function UploadPrologFile() {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState(folders[0]);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    if (!file.name.endsWith(".pl")) {
      setStatus("❌ Only .pl files allowed");
      return;
    }

    const path = `${folder}/${file.name}`;

    const { error } = await supabase.storage
      .from("prolog-files")
      .upload(path, file, { upsert: true });

    if (error) {
      setStatus("❌ " + error.message);
    } else {
      setStatus("✅ Uploaded successfully");
    }
  };

  return (
    <div className="upload-box">
      <h3>Upload Prolog file</h3>

      <select value={folder} onChange={e => setFolder(e.target.value)}>
        {folders.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      <input
        type="file"
        accept=".pl"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>Upload</button>

      {status && <p>{status}</p>}
    </div>
  );
}
