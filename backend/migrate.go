package main

import (
    "database/sql"
    "log"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    // Ganti dengan kredensial database Anda
    db, err := sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/?charset=utf8mb4")
    if err != nil {
        log.Fatal("Gagal koneksi ke database:", err)
    }
    defer db.Close()

    // Buat database
    _, err = db.Exec("CREATE DATABASE IF NOT EXISTS article")
    if err != nil {
        log.Fatal("Gagal membuat database:", err)
    }

    // Pilih database
    _, err = db.Exec("USE article")
    if err != nil {
        log.Fatal("Gagal memilih database:", err)
    }

    // Buat tabel posts
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status VARCHAR(100) NOT NULL,
            CONSTRAINT valid_status CHECK (status IN ('publish', 'draft', 'thrash'))
        )
    `)
    if err != nil {
        log.Fatal("Gagal membuat tabel:", err)
    }

    log.Println("Migrasi database selesai!")
}