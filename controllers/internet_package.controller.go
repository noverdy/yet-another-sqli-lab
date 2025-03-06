package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/noverdy/sqli-demo-lab/models"
	"github.com/noverdy/sqli-demo-lab/services"
)

func BuyInternetPackage(c *gin.Context) {
	time.Sleep(1 * time.Second)

	var requestBody struct {
		ID string `json:"package_id"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	_, err := services.CheckInternetPackageExists(requestBody.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "The internet package purchase has been processed."})
}

func GetAllInternetPackages(c *gin.Context) {
	searchQuery := c.Query("q")
	packages, err := services.GetAllInternetPackages(searchQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve internet packages"})
		return
	}
	c.JSON(http.StatusOK, packages)
}

func CreateInternetPackage(c *gin.Context) {
	var pkg models.InternetPackage
	if err := c.ShouldBindJSON(&pkg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdPackage, err := services.CreateInternetPackage(pkg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create internet package"})
		return
	}

	c.JSON(http.StatusCreated, createdPackage)
}

func UpdateInternetPackage(c *gin.Context) {
	id := c.Param("id")

	var pkg models.InternetPackage
	if err := c.ShouldBindJSON(&pkg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.UpdateInternetPackage(id, pkg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update internet package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Internet package updated successfully"})
}

func DeleteInternetPackage(c *gin.Context) {
	id := c.Param("id")

	err := services.DeleteInternetPackage(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete internet package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Internet package deleted successfully"})
}
