import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllPosts from "./pages/AllPosts.jsx";
import AddNew from "./pages/AddNew.jsx";
import EditArticle from "./pages/EditArticle.jsx";
import Preview from "./pages/Preview.jsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <nav className="bg-white shadow-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600"></span>
              </div>
              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
                >
                  Semua Artikel
                </Link>
                <Link
                  to="/add"
                  className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
                >
                  Tambah Baru
                </Link>
                <Link
                  to="/preview"
                  className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
                >
                  Pratinjau
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="mt-4"
          />
          <Routes>
            <Route path="/" element={<AllPosts />} />
            <Route path="/add" element={<AddNew />} />
            <Route path="/edit/:id" element={<EditArticle />} />
            <Route path="/preview" element={<Preview />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          </div>
        </footer>
      </div>
    </Router>
  );
}