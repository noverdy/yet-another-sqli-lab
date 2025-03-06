package services

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/noverdy/sqli-demo-lab/db"
	"github.com/noverdy/sqli-demo-lab/models"
)

func CheckInternetPackageExists(packageID string) (bool, error) {
	query := fmt.Sprintf("SELECT COUNT(*) FROM internet_packages WHERE id = '%s'", packageID)
	fmt.Println(">", query)
	var count int
	err := db.DB.QueryRow(query).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return count > 0, nil
}

func GetAllInternetPackages(searchQuery string) ([]models.InternetPackage, error) {
	var rows *sql.Rows
	var err error

	if searchQuery != "" {
		query := "SELECT id, name, description, price, created_at, updated_at FROM internet_packages WHERE name ILIKE $1"
		rows, err = db.DB.Query(query, "%"+searchQuery+"%")
	} else {
		query := "SELECT id, name, description, price, created_at, updated_at FROM internet_packages"
		rows, err = db.DB.Query(query)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var packages []models.InternetPackage = []models.InternetPackage{}
	for rows.Next() {
		var pkg models.InternetPackage
		if err := rows.Scan(&pkg.ID, &pkg.Name, &pkg.Description, &pkg.Price, &pkg.CreatedAt, &pkg.UpdatedAt); err != nil {
			return nil, err
		}
		packages = append(packages, pkg)
	}

	return packages, nil
}

func CreateInternetPackage(pkg models.InternetPackage) (models.InternetPackage, error) {
	query := "INSERT INTO internet_packages (name, description, price) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at"
	err := db.DB.QueryRow(query, pkg.Name, pkg.Description, pkg.Price).Scan(&pkg.ID, &pkg.CreatedAt, &pkg.UpdatedAt)
	if err != nil {
		return pkg, err
	}

	return pkg, nil
}

func UpdateInternetPackage(id string, pkg models.InternetPackage) error {
	query := "UPDATE internet_packages SET name = $1, description = $2, price = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4"
	result, err := db.DB.Exec(query, pkg.Name, pkg.Description, pkg.Price, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return errors.New("internet package not found")
	}

	return nil
}

func DeleteInternetPackage(id string) error {
	query := "DELETE FROM internet_packages WHERE id = $1"
	result, err := db.DB.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return errors.New("internet package not found")
	}

	return nil
}
