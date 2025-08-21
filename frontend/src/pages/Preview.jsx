import { useEffect, useState } from "react";

export default function Preview() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);

  const fetchArticles = async () => {
    const res = await fetch(`http://localhost:8080/article/100/${page * 6}`);
    const data = await res.json();
    setArticles(data.filter((a) => a.status?.toLowerCase() === "publish"));
  };

  useEffect(() => { fetchArticles(); }, [page]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Published Articles</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <article key={a.id} className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
            <p className="text-sm text-gray-500 mb-3">Category: {a.category}</p>
            <p className="text-gray-700 line-clamp-4">{a.content}</p>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4">
        <button disabled={page===0}
          onClick={() => setPage(p=>Math.max(0,p-1))}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
          Prev
        </button>
        <button onClick={() => setPage(p=>p+1)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>
  );
}
