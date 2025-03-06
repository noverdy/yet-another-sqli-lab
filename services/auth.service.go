package services

import (
	"database/sql"
	"errors"
	"log"
	"math/rand"
	"time"

	"github.com/noverdy/sqli-demo-lab/db"
	"golang.org/x/crypto/bcrypt"
)

func ForgotPassword(email string) error {
	resetToken := generateRandomToken()
	user, err := GetUserByEmail(email)
	if err != nil {
		return nil
	}

	expiresAt := time.Now().Add(15 * time.Minute)
	query := "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)"
	_, err = db.DB.Exec(query, user.ID, resetToken, expiresAt)
	if err != nil {
		log.Println(err)
		return errors.New("failed to store reset token")
	}

	return nil
}

func ResetPassword(resetToken string, newPassword string) error {
	var userID int
	var expiresAt time.Time
	query := "SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1"
	err := db.DB.QueryRow(query, resetToken).Scan(&userID, &expiresAt)
	if err == sql.ErrNoRows {
		return errors.New("invalid or expired reset token")
	}
	if err != nil {
		return errors.New("failed to validate reset token")
	}

	if time.Now().After(expiresAt) {
		return errors.New("reset token has expired")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	err = UpdateUserPassword(userID, string(hashedPassword))
	if err != nil {
		return errors.New("failed to reset password")
	}

	deleteQuery := "DELETE FROM password_reset_tokens WHERE token = $1"
	_, err = db.DB.Exec(deleteQuery, resetToken)
	if err != nil {
		return errors.New("failed to clean up reset token")
	}

	return nil
}

func generateRandomToken() string {
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	b := make([]rune, 128)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
