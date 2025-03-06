package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/noverdy/sqli-demo-lab/models"
	"github.com/noverdy/sqli-demo-lab/services"
)

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
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var pkg models.InternetPackage
	if err := c.ShouldBindJSON(&pkg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = services.UpdateInternetPackage(id, pkg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update internet package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Internet package updated successfully"})
}

func DeleteInternetPackage(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	err = services.DeleteInternetPackage(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete internet package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Internet package deleted successfully"})
}
