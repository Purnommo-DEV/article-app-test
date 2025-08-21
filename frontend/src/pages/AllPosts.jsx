import { useEffect, useState } from "react";
import ArticleTable from "../components/ArticleTable.jsx";

export default function AllPosts() {
  const [articles, setArticles] = useState([]);
  const [tab, setTab] = useState("publish");

  const fetchArticles = async () => {
    try {
      const res = await fetch("http://localhost:8080/article/100/0");
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []); // <-- SELALU array
    } catch (err) {
      console.error("Gagal fetch artikel:", err);
      setArticles([]); // fallback biar nggak null
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    try {
        const articleToUpdate = articles.find((a) => a.id === id);
        if (articleToUpdate && articleToUpdate.status !== "thrash") {
          const response = await fetch(`http://localhost:8080/article/id/${id}`, {
            method: "PUT", // Ubah ke PUT
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: articleToUpdate.title,
              content: articleToUpdate.content,
              category: articleToUpdate.category,
              status: "thrash",
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorData)}`);
          }
          await fetchArticles();
        }
      } catch (error) {
        console.error("Gagal memperbarui status", error.message);
      }
  };

  const filtered = (articles ?? []).filter(
    (a) => a?.status?.toLowerCase() === tab
  );
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Semua Artikel</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Total: {filtered.length} artikel
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
        {["publish", "draft", "thrash"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
              tab === t
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-transparent text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ArticleTable articles={filtered} onDelete={handleDelete} />
      </div>
    </div>
  );
}