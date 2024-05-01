package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	common "part1/pkg"
)

// validate ensures that the user data is not empty
func validate(item common.RequestData) error {
	if item.Name == "" {
		return fmt.Errorf("name cannot be empty")
	} else if item.Price <= 0 {
		return fmt.Errorf("price must be a positive integer")
	} else if item.Quantity < 0 {
		return fmt.Errorf("quantity cannot be negative")
	}
	return nil
}

func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method please", http.StatusMethodNotAllowed)
		return
	}

	// unmarshal and validate input data
	var item common.RequestData
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := validate(item); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// print json input to stdout
	log.Printf("Received item: %+v\n", item)

	// send the data to the locally running server API
	jsonData, err := json.Marshal(item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	apiURL := "http://localhost:8081/my-local-api"
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	fmt.Fprintln(w, "Data sent successfully to API")
}

func main() {
	http.HandleFunc("/submit", handler)
	log.Println("Server waiting for JSON input on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
