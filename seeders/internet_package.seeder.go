package seeders

import (
	"log"

	"github.com/noverdy/sqli-demo-lab/db"
)

func SeedInternetPackages() {
	packages := []struct {
		Name        string
		Description string
		Price       float64
	}{
		{
			Name:        "Super Seru",
			Description: "Paket Super Seru adalah paket internet yang menawarkan kuota besar dengan kecepatan tinggi, cocok untuk streaming, gaming, dan browsing tanpa batas.",
			Price:       120000,
		},
		{
			Name:        "StreaMAX",
			Description: "Paket StreaMAX dirancang khusus untuk pengguna yang suka streaming video dan musik dengan kualitas HD tanpa buffering.",
			Price:       200000,
		},
		{
			Name:        "Internet Sakti",
			Description: "Paket Internet Sakti memberikan kuota hemat dengan harga terjangkau, ideal untuk pengguna yang membutuhkan internet untuk kebutuhan sehari-hari.",
			Price:       80000,
		},
		{
			Name:        "Paket Serbu Sahur",
			Description: "Paket Serbu Sahur adalah paket internet khusus yang memberikan kuota besar dengan harga hemat, aktif pada jam sahur untuk mendukung aktivitas malam hari.",
			Price:       50000,
		},
		{
			Name:        "Internet OMG!",
			Description: "Paket Internet OMG! menawarkan kuota besar untuk semua aplikasi favorit Anda, termasuk media sosial, streaming, dan gaming, dengan kecepatan tinggi.",
			Price:       150000,
		},
		{
			Name:        "Kuota Ketengan",
			Description: "Kuota Ketengan adalah paket internet fleksibel dengan kuota kecil yang cocok untuk kebutuhan mendadak atau penggunaan singkat.",
			Price:       25000,
		},
	}

	for _, internetPackage := range packages {
		query := "INSERT INTO internet_packages (name, description, price) VALUES ($1, $2, $3)"
		_, err := db.DB.Exec(query, internetPackage.Name, internetPackage.Description, internetPackage.Price)
		if err != nil {
			log.Printf("Failed to seed internet package %s: %v", internetPackage.Name, err)
		} else {
			log.Printf("Seeded internet package: %s", internetPackage.Name)
		}
	}
}
