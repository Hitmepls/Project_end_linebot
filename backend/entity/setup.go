package entity

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("sa-64.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(&Accident{},
		&Reporter{},
		&ProcessStatus{},
		&Level{},
	)

	db = database
	// var ProcessStatus = []ProcessStatus{{Name: "pending"}, {Name: "processing"}, {Name: "complete"}}
	// db.Create(&ProcessStatus)
	// var Level = []Level{{Name: "อุบัติเหตุที่ไม่สร้างความบาดเจ็บ"}, {Name: "อุบัติเหตุที่สร้างความบาดเจ็บเล็กน้อย"}, {Name: "อุบัติเหตุที่สร้างความบาดเจ็บรุนแรง"}}
	// db.Create(&Level)
	// db.Model(&Accident{}).Create([]map[string]interface{}{
	// 	{
	// 		"Description":     "ชนเละ9คันโคราชฝนตกถนนลื่นเจ็บ4",
	// 		"Latitude":        "14.912325",
	// 		"Longitude":       "102.067743",
	// 		"Time":            time.Now(),
	// 		"Contact":         "0954978261",
	// 		"ImageID":         "image",
	// 		"ProcessStatusID": 1,
	// 		"ReporterID":      1,
	// 		"LevelID":         3},
	// })

}
