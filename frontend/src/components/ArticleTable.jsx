import { Link } from "react-router-dom";

export default function ArticleTable({ articles, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="w-full border-collapse text-sm md:text-base">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs md:text-sm">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{a.title}</td>
              <td className="px-4 py-3">{a.category}</td>
              <td className="px-4 py-3 flex flex-wrap gap-4">
                <Link to={`/edit/${a.id}`} className="text-blue-600 hover:underline">✏️</Link>
                <button onClick={() => onDelete(a.id)} className="text-red-600 hover:underline">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
