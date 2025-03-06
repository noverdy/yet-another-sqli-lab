package seeders

import (
	"log"
	"math/rand"

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
		{"Admin", "admin@myseclab.com", generateRandomString(16), true},
		{"John Doe", "john.doe@myseclab.com", generateRandomString(16), false},
		{"Jane Doe", "jane.doe@myseclab.com", "password123", false},
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

func generateRandomString(n int) string {
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
