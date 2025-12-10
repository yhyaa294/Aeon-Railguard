package models

// Role constants
const (
	RoleDAOPAdmin     = "DAOP_ADMIN"
	RoleStationMaster = "STATION_MASTER"
	RoleJPLOfficer    = "JPL_OFFICER"
)

// RoleHierarchy defines access level for each role
var RoleHierarchy = map[string]int{
	RoleDAOPAdmin:     3,
	RoleStationMaster: 2,
	RoleJPLOfficer:    1,
}
