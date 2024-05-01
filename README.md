
# Coding Assignment
(For the notes below, I was assuming Go and Node have been already installed on the computer)

### Part1

To start the main Go application, go to `cmd/client/` and run 
```
go run ./main.go
```

To start the API server, go to `cmd/server/` and run
```
go run ./main.go
```

Use software like Postman to send a POST request (can refer to sample data in `/sampleData.json` for request body) to `localhost:8080/submit`

Then the JSON data and some other relevant information will be logged in stdout in both servers.

Can try some invalid fields to test input validation.

### Part2
To install the typescript compiler and run my solution, go to `/part2` and sequentially run
```
npm install
npm link typescript
tsc ./compiler.ts
node compiler.js
```


