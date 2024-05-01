package main

import (
	"encoding/json"
	"log"
	"net/http"
	common "part1/pkg"
	"strconv"
)

type ResponseData struct {
	Message string `json:"message"`
}

func calcTotalPrice(item common.RequestData) int32 {
	return item.Price * item.Quantity
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	// restrict request method to POST only
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is handled", http.StatusMethodNotAllowed)
		return
	}

	var item common.RequestData
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// process data
	total := calcTotalPrice(item)
	log.Println("Data received and process, you need to pay: $" + strconv.Itoa(int(total)))

	// Create a response data
	respData := ResponseData{Message: "Data received and processed successfully!"}
	response, err := json.Marshal(respData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func main() {
	http.HandleFunc("/my-local-api", apiHandler)
	log.Println("Local API Server listening on port 8081...")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
