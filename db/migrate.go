package db

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"sort"
	"strings"
)

type Migration struct {
	Version string
	UpSQL   string
	DownSQL string
}

func LoadMigrations(dir string) ([]Migration, error) {
	var migrations []Migration

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("failed to read migrations directory: %v", err)
	}

	migrationMap := make(map[string]*Migration)
	for _, file := range files {
		if file.IsDir() {
			continue
		}

		filename := file.Name()
		if strings.HasSuffix(filename, ".up.sql") {
			version := strings.TrimSuffix(filename, ".up.sql")
			if _, exists := migrationMap[version]; !exists {
				migrationMap[version] = &Migration{Version: version}
			}
			migrationMap[version].UpSQL = filepath.Join(dir, filename)
		} else if strings.HasSuffix(filename, ".down.sql") {
			version := strings.TrimSuffix(filename, ".down.sql")
			if _, exists := migrationMap[version]; !exists {
				migrationMap[version] = &Migration{Version: version}
			}
			migrationMap[version].DownSQL = filepath.Join(dir, filename)
		}
	}

	for _, migration := range migrationMap {
		migrations = append(migrations, *migration)
	}
	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

func ApplyMigrations(db *sql.DB, dir string) error {
	migrations, err := LoadMigrations(dir)
	if err != nil {
		return err
	}

	for _, migration := range migrations {
		log.Printf("Applying migration: %s", migration.Version)

		sqlBytes, err := ioutil.ReadFile(migration.UpSQL)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %v", migration.UpSQL, err)
		}

		_, err = db.Exec(string(sqlBytes))
		if err != nil {
			return fmt.Errorf("failed to apply migration %s: %v", migration.Version, err)
		}
	}

	log.Println("All migrations applied successfully")
	return nil
}

func RollbackMigrations(db *sql.DB, dir string) error {
	migrations, err := LoadMigrations(dir)
	if err != nil {
		return err
	}

	for i := len(migrations) - 1; i >= 0; i-- {
		migration := migrations[i]
		log.Printf("Rolling back migration: %s", migration.Version)

		sqlBytes, err := ioutil.ReadFile(migration.DownSQL)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %v", migration.DownSQL, err)
		}

		_, err = db.Exec(string(sqlBytes))
		if err != nil {
			return fmt.Errorf("failed to rollback migration %s: %v", migration.Version, err)
		}
	}

	log.Println("All migrations rolled back successfully")
	return nil
}
