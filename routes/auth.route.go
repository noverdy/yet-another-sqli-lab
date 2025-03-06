package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/noverdy/sqli-demo-lab/controllers"
)

func RegisterAuthRoutes(r *gin.RouterGroup) {
	authRoutes := r.Group("/auth")
	{
		authRoutes.POST("/register", controllers.Register)
		authRoutes.POST("/login", controllers.Login)
		authRoutes.POST("/forgot-password", controllers.ForgotPassword)
		authRoutes.POST("/reset-password", controllers.ResetPassword)
	}
}
