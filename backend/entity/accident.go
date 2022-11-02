package entity

import (
	"time"

	"gorm.io/gorm"
)

type Accident struct {
	gorm.Model
	Description     string
	Latitude        string
	Longitude       string
	Time            time.Time
	Contact         string
	ImageID         string
	ProcessStatusID *uint
	ProcessStatus   ProcessStatus
	ReporterID      *uint
	Reporter        Reporter
	LevelID         *uint
	Level           Level
}
type Level struct {
	gorm.Model
	Name      string
	Accidents []Accident `gorm:"foreignKey:ProcessStatusID"`
}
type Reporter struct {
	gorm.Model
	UserId      string `gorm:"uniqueIndex"`
	DisplayName string
	PictureUrl  string
	Accidents   []Accident `gorm:"foreignKey:ReporterID"`
}
type ProcessStatus struct {
	gorm.Model
	Name      string
	Accidents []Accident `gorm:"foreignKey:ProcessStatusID"`
}
