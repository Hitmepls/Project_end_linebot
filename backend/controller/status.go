package controller

import (
	"net/http"

	"github.com/Hitmepls/my-project/entity"
	"github.com/gin-gonic/gin"
)

func CreateStatus(c *gin.Context) {
	var status entity.ProcessStatus
	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": status})
}

// GET /user/:id
func GetStatus(c *gin.Context) {
	var status entity.ProcessStatus
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM Accidents WHERE id = ?", id).Scan(&status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": status})
}

// GET /users
func ListStatus(c *gin.Context) {
	var status []entity.ProcessStatus
	if err := entity.DB().Raw("SELECT * FROM Accidents").Scan(&status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": status})
}
