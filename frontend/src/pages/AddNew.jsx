import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddNew() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (status) => {
    if (title.length < 20) {
      alert("❌ Judul minimal 20 karakter");
      return;
    }
    if (content.length < 200) {
      alert("❌ Konten minimal 200 karakter");
      return;
    }
    if (content.length < 3) {
      alert("❌ Kategori minimal 3 karakter");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/article/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, status })
      });

      if (!res.ok) {
        const errText = await res.text();
        alert("❌ Gagal menambahkan artikel: " + errText);
        return;
      }
      alert("✅ Artikel berhasil ditambahkan!");
      navigate("/");
    } catch (err) {
      alert("⚠️ Error jaringan: " + err.message);
    }
  };


  return (
<div className="bg-white shadow rounded-xl p-6 max-w-2xl mx-auto">
  <h2 className="text-2xl font-semibold mb-6">➕ Add New Article</h2>

  <label className="block mb-2 text-sm font-medium">Title</label>
  <input value={title} onChange={e=>setTitle(e.target.value)}
    placeholder="Enter article title"
    className="border rounded-lg w-full p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none" />

  <label className="block mb-2 text-sm font-medium">Content</label>
  <textarea value={content} onChange={e=>setContent(e.target.value)}
    placeholder="Write at least 200 characters"
    className="border rounded-lg w-full p-3 mb-4 h-40 focus:ring-2 focus:ring-blue-400 outline-none" />

  <label className="block mb-2 text-sm font-medium">Category</label>
  <input value={category} onChange={e=>setCategory(e.target.value)}
    placeholder="Category name"
    className="border rounded-lg w-full p-3 mb-6 focus:ring-2 focus:ring-blue-400 outline-none" />

  <div className="flex gap-3">
    <button onClick={()=>handleSubmit("publish")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
      Publish
    </button>
    <button onClick={()=>handleSubmit("draft")}
      className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow">
      Draft
    </button>
  </div>
</div>

  );
}
