package services

import (
	"database/sql"
	"errors"

	"github.com/noverdy/sqli-demo-lab/db"
	"github.com/noverdy/sqli-demo-lab/models"
)

func CreateUser(user models.User) (models.User, error) {
	query := "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id"
	err := db.DB.QueryRow(query, user.Name, user.Email, user.Password).Scan(&user.ID)
	if err != nil {
		return user, err
	}
	return user, nil
}

func GetAllUsers() ([]models.User, error) {
	query := "SELECT id, name, email FROM users"
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func GetUserByID(id int) (models.User, error) {
	query := "SELECT id, name, email, is_admin FROM users WHERE id = $1"
	var user models.User
	err := db.DB.QueryRow(query, id).Scan(&user.ID, &user.Name, &user.Email, &user.IsAdmin)
	if err == sql.ErrNoRows {
		return user, errors.New("user not found")
	}
	if err != nil {
		return user, err
	}
	return user, nil
}

func GetUserByEmail(email string) (models.User, error) {
	query := "SELECT id, name, email, is_admin, password FROM users WHERE email = $1"
	var user models.User
	err := db.DB.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email, &user.IsAdmin, &user.Password)
	if err == sql.ErrNoRows {
		return user, errors.New("user not found")
	}
	if err != nil {
		return user, err
	}
	return user, nil
}

func UpdateUser(id int, updatedUser models.User) (models.User, error) {
	query := "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email"
	err := db.DB.QueryRow(query, updatedUser.Name, updatedUser.Email, id).Scan(&updatedUser.ID, &updatedUser.Name, &updatedUser.Email)
	if err == sql.ErrNoRows {
		return updatedUser, errors.New("user not found")
	}
	if err != nil {
		return updatedUser, err
	}
	return updatedUser, nil
}

func UpdateUserPassword(userID int, newPassword string) error {
	query := "UPDATE users SET password = $1 WHERE id = $2"
	result, err := db.DB.Exec(query, newPassword, userID)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("user not found")
	}
	return nil
}

func DeleteUser(id int) error {
	query := "DELETE FROM users WHERE id = $1"
	result, err := db.DB.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("user not found")
	}
	return nil
}
