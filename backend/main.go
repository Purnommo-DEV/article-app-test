package main

import (
    "database/sql"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
    _ "github.com/go-sql-driver/mysql"
    "github.com/gin-contrib/cors" // Tambahkan package CORS
)

type Article struct {
    ID          int    `json:"id"`
    Title       string `json:"title" binding:"required,min=20"`
    Content     string `json:"content" binding:"required,min=200"`
    Category    string `json:"category" binding:"required,min=3"`
    Status      string `json:"status" binding:"required,oneof=publish draft thrash"`
    CreatedDate string `json:"created_date"`
    UpdatedDate string `json:"updated_date"`
}

func main() {
    // Koneksi ke database
    db, err := sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/article?charset=utf8mb4")

    if err != nil {
        panic("Gagal koneksi ke database: " + err.Error())
    }
    defer db.Close()

    // Inisialisasi router Gin
    r := gin.Default()

    // Tambahkan middleware CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:8080", "http://localhost", "http://localhost:8081", "http://localhost:5173"} // Izinkan origin frontend
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"} // Izinkan metode
    config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"} // Izinkan header
    r.Use(cors.New(config))

    // Endpoint 1: Membuat article baru
    r.POST("/article/", func(c *gin.Context) {
        var article Article
        if err := c.ShouldBindJSON(&article); err != nil {
            // Tangani error validasi
            if validationErrs, ok := err.(validator.ValidationErrors); ok {
                errors := make([]string, 0, len(validationErrs))
                for _, e := range validationErrs {
                    switch e.Field() {
                    case "Title":
                        if e.Tag() == "required" {
                            errors = append(errors, "Judul wajib diisi")
                        } else if e.Tag() == "min" {
                            errors = append(errors, "Judul harus memiliki minimal 20 karakter")
                        }
                    case "Content":
                        if e.Tag() == "required" {
                            errors = append(errors, "Konten wajib diisi")
                        } else if e.Tag() == "min" {
                            errors = append(errors, "Konten harus memiliki minimal 200 karakter")
                        }
                    case "Category":
                        if e.Tag() == "required" {
                            errors = append(errors, "Kategori wajib diisi")
                        } else if e.Tag() == "min" {
                            errors = append(errors, "Kategori harus memiliki minimal 3 karakter")
                        }
                    case "Status":
                        if e.Tag() == "required" {
                            errors = append(errors, "Status wajib diisi")
                        } else if e.Tag() == "oneof" {
                            errors = append(errors, "Status harus salah satu dari: publish, draft, thrash")
                        }
                    }
                }
                c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
                return
            }
            // Tangani error JSON parsing
            c.JSON(http.StatusBadRequest, gin.H{"error": "Format JSON tidak valid: " + err.Error()})
            return
        }

        result, err := db.Exec(
            "INSERT INTO posts (title, content, category, status) VALUES (?, ?, ?, ?)",
            article.Title, article.Content, article.Category, article.Status,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan artikel: " + err.Error()})
            return
        }

        id, _ := result.LastInsertId()
        c.JSON(http.StatusOK, gin.H{"id": id})
    })

    // Endpoint 2: Mendapatkan daftar artikel dengan limit dan offset
    r.GET("/article/:limit/:offset", func(c *gin.Context) {
        limit, _ := strconv.Atoi(c.Param("limit"))
        offset, _ := strconv.Atoi(c.Param("offset"))

        rows, err := db.Query("SELECT id, title, content, category, status, created_date, updated_date FROM posts LIMIT ? OFFSET ?", limit, offset)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data: " + err.Error()})
            return
        }
        defer rows.Close()

        var articles []Article
        for rows.Next() {
            var a Article
            if err := rows.Scan(&a.ID, &a.Title, &a.Content, &a.Category, &a.Status, &a.CreatedDate, &a.UpdatedDate); err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses data: " + err.Error()})
                return
            }
            articles = append(articles, a)
        }
        c.JSON(http.StatusOK, articles)
    })

    // Endpoint 3: Mendapatkan artikel berdasarkan ID
    r.GET("/article/id/:id", func(c *gin.Context) {
        id := c.Param("id")
        var a Article
        err := db.QueryRow("SELECT id, title, content, category, status, created_date, updated_date FROM posts WHERE id = ?", id).
            Scan(&a.ID, &a.Title, &a.Content, &a.Category, &a.Status, &a.CreatedDate, &a.UpdatedDate)
        if err == sql.ErrNoRows {
            c.JSON(http.StatusNotFound, gin.H{"error": "Artikel tidak ditemukan"})
            return
        }
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data: " + err.Error()})
            return
        }
        c.JSON(http.StatusOK, a)
    })

    // Endpoint 4: Mengubah artikel berdasarkan ID
    r.PUT("/article/id/:id", func(c *gin.Context) {
        id := c.Param("id")
        var article Article
        if err := c.ShouldBindJSON(&article); err != nil {
            // Tangani error validasi
            if validationErrs, ok := err.(validator.ValidationErrors); ok {
                errors := make([]string, 0, len(validationErrs))
                for _, e := range validationErrs {
                    switch e.Field() {
                    case "Title":
                        if e.Tag() == "required" {
                            errors = append(errors, "Judul wajib diisi")
                        } else if e.Tag() == "min" {
                            errors = append(errors, "Judul harus memiliki minimal 20 karakter")
                        }
                    case "Content":
                        if e.Tag() == "required" {
                            errors = append(errors, "Konten wajib diisi")
                        } else if e.Tag() == "min" {
                            errors = append(errors, "Konten harus memiliki minimal 200 karakter")
                        }
                    case "Category":
                        if e.Tag() == "required" {
                            errors = append(errors, "Kategori wajib diisi")
                        } else if e.Tag() == "min" {
                            errors = append(errors, "Kategori harus memiliki minimal 3 karakter")
                        }
                    case "Status":
                        if e.Tag() == "required" {
                            errors = append(errors, "Status wajib diisi")
                        } else if e.Tag() == "oneof" {
                            errors = append(errors, "Status harus salah satu dari: publish, draft, thrash")
                        }
                    }
                }
                c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
                return
            }
            // Tangani error JSON parsing
            c.JSON(http.StatusBadRequest, gin.H{"error": "Format JSON tidak valid: " + err.Error()})
            return
        }

        result, err := db.Exec(
            "UPDATE posts SET title = ?, content = ?, category = ?, status = ? WHERE id = ?",
            article.Title, article.Content, article.Category, article.Status, id,
        )
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui artikel: " + err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusNotFound, gin.H{"error": "Artikel tidak ditemukan"})
            return
        }

        c.JSON(http.StatusOK, gin.H{})
    })

    // Endpoint 5: Menghapus artikel berdasarkan ID
    r.DELETE("/article/id/:id", func(c *gin.Context) {
        id := c.Param("id")
        result, err := db.Exec("DELETE FROM posts WHERE id = ?", id)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus artikel: " + err.Error()})
            return
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            c.JSON(http.StatusNotFound, gin.H{"error": "Artikel tidak ditemukan"})
            return
        }

        c.JSON(http.StatusOK, gin.H{})
    })

    // Jalankan server
    r.Run(":8080")
}