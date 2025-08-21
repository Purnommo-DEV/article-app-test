# 📰 Blog Article App (Frontend Test)

Aplikasi sederhana untuk mengelola artikel dengan fitur **CRUD (Create, Read, Update, Delete)**.  
Frontend dibuat dengan **React + Vite + TailwindCSS**, sedangkan backend menggunakan **Golang + MySQL**.

---

## 🛠️ Tech Stack
- **Frontend**
  - React + Vite
  - React Router
  - TailwindCSS (v3.4.1)

- **Backend**
  - Golang (Gin Framework)
  - MySQL
  - Go Playground Validator
  - Gin CORS Middleware

### 1. Jalankan Backend (Golang + MySQL)
1. Pastikan MySQL sudah berjalan dan database sudah tersedia.  
2. Masuk ke folder backend (yang ada `main.go`).  
3. Install dependency Go (sekali saja):
   ```bash
   go mod tidy
   ```
4. Jalankan server:
   ```bash
   go run main.go
   ```
5. Backend berjalan di:  
   👉 `http://localhost:8080`

---

### 2. Jalankan Frontend (React + Vite)
1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Frontend berjalan di:  
   👉 `http://localhost:5173`

---

## 📌 Fitur
- Melihat semua artikel (Publish, Draft, Trash)  
- Menambahkan artikel baru  
- Mengedit artikel  
- Ubah status artikel  
- Preview artikel  