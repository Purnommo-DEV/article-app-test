import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:8080/article/id/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
    };
    load();
  }, [id]);

  const handleUpdate = async (status) => {
    if (title.length < 20) {
      alert("❌ Title minimal 20 karakter");
      return;
    }
    if (content.length < 200) {
      alert("❌ Content minimal 200 karakter");
      return;
    }
    if (content.length < 3) {
      alert("❌ Kategori minimal 3 karakter");
      return;
    }

    await fetch(`http://localhost:8080/article/id/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category, status })
    });
    navigate("/");
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-xl mb-4">Edit Article</h2>
      <input value={title} onChange={e=>setTitle(e.target.value)} className="border p-2 w-full mb-2" />
      <textarea value={content} onChange={e=>setContent(e.target.value)} className="border p-2 w-full mb-2 h-40" />
      <input value={category} onChange={e=>setCategory(e.target.value)} className="border p-2 w-full mb-2" />
      <div className="flex gap-2">
        <button onClick={()=>handleUpdate("publish")} className="bg-blue-600 text-white px-4 py-2 rounded">Publish</button>
        <button onClick={()=>handleUpdate("draft")} className="bg-gray-600 text-white px-4 py-2 rounded">Draft</button>
      </div>
    </div>
  );
}
