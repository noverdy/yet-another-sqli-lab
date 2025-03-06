package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/noverdy/sqli-demo-lab/auth"
	"github.com/noverdy/sqli-demo-lab/db"
	"github.com/noverdy/sqli-demo-lab/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	err = auth.InitializeJWTSecret()
	if err != nil {
		log.Fatalf("Error initializing JWT secret: %v", err)
	}

	db.InitDB()
	defer db.DB.Close()

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	r := routes.SetupRouter()

	log.Printf("Server is running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
