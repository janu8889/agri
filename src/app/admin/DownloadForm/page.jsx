"use client";

import { useState } from "react";

export default function DownloadForm() {
  const [productIds, setProductIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productIds) return;

    setLoading(true);
    setMessage("");

    // transformăm textul într-un array de ID-uri
    const ids = productIds
      .split("\n")
      .map((id) => id.trim())
      .filter(Boolean);
    console.log(ids)
    try {
      const res = await fetch("/api/downloadProductImages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: ids }),
      });

      const data = await res.json();
      if (res.ok) setMessage(`Success: ${data.message}`);
      else setMessage(`Error: ${data.error}`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Download Product Images</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter product IDs, one per line"
          value={productIds}
          onChange={(e) => setProductIds(e.target.value)}
          className="border p-2 w-full h-40"
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">
          {loading ? "Downloading..." : "Download Images"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}