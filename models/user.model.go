package models

type User struct {
	ID        int    `json:"id"`
	Name      string `json:"name" binding:"required"`
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	IsAdmin   bool   `json:"is_admin"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
