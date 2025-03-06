package models

import "time"

type PasswordResetToken struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id" binding:"required"`
	Token     string    `json:"token" binding:"required"`
	ExpiresAt time.Time `json:"expires_at" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
}
