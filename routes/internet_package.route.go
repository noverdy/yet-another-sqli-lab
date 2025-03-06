package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/noverdy/sqli-demo-lab/controllers"
	"github.com/noverdy/sqli-demo-lab/middlewares"
)

func RegisterInternetPackageRoutes(r *gin.RouterGroup) {
	packages := r.Group("/internet-packages")
	{
		packages.GET("/", middlewares.AuthMiddleware(), controllers.GetAllInternetPackages)

		packages.POST("/", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.CreateInternetPackage)
		packages.PUT("/:id", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.UpdateInternetPackage)
		packages.DELETE("/:id", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.DeleteInternetPackage)
	}
}
