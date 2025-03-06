package seeders

import (
	"log"

	"github.com/noverdy/sqli-demo-lab/db"
	"golang.org/x/crypto/bcrypt"
)

func SeedUsers() {
	users := []struct {
		Name     string
		Email    string
		Password string
		IsAdmin  bool
	}{
		{"Admin", "admin@example.com", "admin123", true},
		{"John Doe", "john.doe@example.com", "password123", false},
		{"Jane Doe", "jane.doe@example.com", "password123", false},
	}

	for _, user := range users {
		checkQuery := "SELECT COUNT(*) FROM users WHERE email = $1"
		var count int
		db.DB.QueryRow(checkQuery, user.Email).Scan(&count)
		if count > 0 {
			log.Printf("User %s already exists", user.Email)
			continue
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Failed to hash password for user %s: %v", user.Email, err)
		}

		query := "INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)"
		_, err = db.DB.Exec(query, user.Name, user.Email, string(hashedPassword), user.IsAdmin)
		if err != nil {
			log.Printf("Failed to seed user %s: %v", user.Email, err)
		} else {
			log.Printf("Seeded user: %s", user.Email)
		}
	}
}
