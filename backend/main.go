package main

import (
	"github.com/Hitmepls/my-project/controller"
	"github.com/Hitmepls/my-project/entity"
	"github.com/gin-gonic/gin"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())
	// User Routes
	r.GET("/accidents", controller.ListAccidents)
	r.GET("/accidentsActive", controller.ListAccidentsActive)
	r.GET("/accidents/count", controller.GetCountAccidentsActive)
	r.GET("/accidents/:id", controller.GetAccidents)
	r.POST("/accidents", controller.CreateAccidents)

	r.GET("/reporters", controller.ListReporter)
	r.GET("/reporter/:id", controller.GetReporterID)
	r.POST("/reporters", controller.CreateReporter)

	// Run the server
	r.Run()
}
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
