package common

type RequestData struct {
	Name     string `json:"name"`
	Price    int32  `json:"price"`
	Quantity int32  `json:"quantity"`
}
