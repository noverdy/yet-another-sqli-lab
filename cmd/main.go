package main

import (
	"flag"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/noverdy/sqli-demo-lab/db"
	"github.com/noverdy/sqli-demo-lab/seeders"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	db.InitDB()
	defer db.DB.Close()

	migrate := flag.Bool("migrate", false, "Apply database migrations")
	rollback := flag.Bool("rollback", false, "Rollback database migrations")
	seed := flag.Bool("seed", false, "Run database seeders")
	server := flag.Bool("server", false, "Start the server")
	flag.Parse()

	if *migrate {
		log.Println("Applying migrations...")
		err := db.ApplyMigrations(db.DB, "./migrations")
		if err != nil {
			log.Fatalf("Failed to apply migrations: %v", err)
		}
		log.Println("Migrations applied successfully!")
	}

	if *rollback {
		log.Println("Rolling back migrations...")
		err := db.RollbackMigrations(db.DB, "./migrations")
		if err != nil {
			log.Fatalf("Failed to rollback migrations: %v", err)
		}
		log.Println("Migrations rolled back successfully!")
	}

	if *seed {
		log.Println("Running seeders...")
		seeders.SeedUsers()
		seeders.SeedInternetPackages()
		log.Println("Seeders completed successfully!")
	}

	if *server {
		log.Println("Starting the server...")
		startServer()
	}

	log.Println("No valid command provided. Use --migrate, --rollback, --seed, or --server.")
}

func startServer() {
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	r := setupRouter()

	log.Printf("Server is running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	return r
}
