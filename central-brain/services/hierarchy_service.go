package services

import (
	"central-brain/models"
	"sync"
)

// In-memory hierarchy data
var (
	region          models.Region
	unitStatuses    = make(map[string]string)
	hierarchyMutex  sync.RWMutex
	unitStatusMutex sync.RWMutex
)

func init() {
	initHierarchyData()
}

func initHierarchyData() {
	// Initialize Units
	unitJBG01 := models.Unit{ID: "CCTV-JBG-01", Name: "CCTV-JBG-01 (Arah Timur)", Type: "CCTV", Status: "ONLINE", Lat: -7.5456, Long: 112.2134}
	unitJBG02 := models.Unit{ID: "CCTV-JBG-02", Name: "CCTV-JBG-02 (Arah Barat)", Type: "CCTV", Status: "ONLINE", Lat: -7.5456, Long: 112.2134}
	unitPTR01 := models.Unit{ID: "CCTV-PTR-01", Name: "CCTV-PTR-01 (Flyover)", Type: "CCTV", Status: "ONLINE", Lat: -7.5478, Long: 112.2156}
	unitBRN01 := models.Unit{ID: "CCTV-BRN-01", Name: "CCTV-BRN-01", Type: "CCTV", Status: "ONLINE", Lat: -7.6012, Long: 112.1000}

	// Initialize Posts
	postA := models.Post{
		ID:          "JPL-102",
		Name:        "Pos JPL 102 (Jombang Kota)",
		GeoLocation: "-7.5456, 112.2134",
		Units:       []models.Unit{unitJBG01, unitJBG02},
	}
	postB := models.Post{
		ID:          "JPL-105",
		Name:        "Pos JPL 105 (Peterongan)",
		GeoLocation: "-7.5478, 112.2156",
		Units:       []models.Unit{unitPTR01},
	}
	postC := models.Post{
		ID:          "JPL-98",
		Name:        "Pos JPL 98 (Baron)",
		GeoLocation: "-7.6012, 112.1000",
		Units:       []models.Unit{unitBRN01},
	}

	// Initialize Stations
	station1 := models.Station{
		ID:          "STA-JBG",
		Name:        "Stasiun Jombang",
		HeadOfficer: "Bpk. Sutrisno",
		Posts:       []models.Post{postA, postB},
	}
	station2 := models.Station{
		ID:          "STA-KTS",
		Name:        "Stasiun Kertosono",
		HeadOfficer: "Bpk. Hartono",
		Posts:       []models.Post{postC},
	}

	// Initialize Region (Root)
	region = models.Region{
		ID:       "DAOP-7",
		Name:     "DAOP 7 MADIUN",
		Code:     "D7",
		Stations: []models.Station{station1, station2},
	}

	// Initialize unit statuses
	unitStatuses["CCTV-JBG-01"] = "ONLINE"
	unitStatuses["CCTV-JBG-02"] = "ONLINE"
	unitStatuses["CCTV-PTR-01"] = "ONLINE"
	unitStatuses["CCTV-BRN-01"] = "ONLINE"
}

// GetHierarchy returns the full hierarchy
func GetHierarchy() models.Region {
	hierarchyMutex.RLock()
	defer hierarchyMutex.RUnlock()
	return updateHierarchyStatuses(region)
}

// GetHierarchyForRole returns filtered hierarchy based on user role
func GetHierarchyForRole(role, postID, stationID string) interface{} {
	hierarchyMutex.RLock()
	defer hierarchyMutex.RUnlock()

	switch role {
	case models.RoleJPLOfficer:
		// JPL Officer: Return only their post
		return getPostByID(postID)
	case models.RoleStationMaster:
		// Station Master: Return their station
		return getStationByID(stationID)
	default:
		// DAOP Admin: Return full region
		return updateHierarchyStatuses(region)
	}
}

func getPostByID(postID string) *models.Post {
	for _, station := range region.Stations {
		for _, post := range station.Posts {
			if post.ID == postID {
				updatedPost := post
				updatedPost.Units = updateUnitStatuses(post.Units)
				return &updatedPost
			}
		}
	}
	return nil
}

func getStationByID(stationID string) *models.Station {
	for _, station := range region.Stations {
		if station.ID == stationID {
			updatedStation := station
			for i, post := range updatedStation.Posts {
				updatedStation.Posts[i].Units = updateUnitStatuses(post.Units)
			}
			return &updatedStation
		}
	}
	return nil
}

func updateHierarchyStatuses(r models.Region) models.Region {
	updated := r
	for i, station := range updated.Stations {
		for j, post := range station.Posts {
			updated.Stations[i].Posts[j].Units = updateUnitStatuses(post.Units)
		}
	}
	return updated
}

func updateUnitStatuses(units []models.Unit) []models.Unit {
	unitStatusMutex.RLock()
	defer unitStatusMutex.RUnlock()

	updated := make([]models.Unit, len(units))
	copy(updated, units)
	for i := range updated {
		if status, ok := unitStatuses[updated[i].ID]; ok {
			updated[i].Status = status
		}
	}
	return updated
}
