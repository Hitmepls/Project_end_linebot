package controller

import (
	"net/http"

	"github.com/Hitmepls/my-project/entity"
	"github.com/gin-gonic/gin"
)

func CreateReporter(c *gin.Context) {
	var reporter entity.Reporter
	if err := c.ShouldBindJSON(&reporter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&reporter).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reporter})
}

// GET /ReporterId/:id
func GetReporterID(c *gin.Context) {
	var reporter entity.Reporter
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM reporters WHERE id = ?", id).Scan(&reporter).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reporter})
}

// GET /users
func ListReporter(c *gin.Context) {
	var reporter []entity.Reporter
	if err := entity.DB().Raw("SELECT * FROM reporters").Scan(&reporter).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reporter})
}
