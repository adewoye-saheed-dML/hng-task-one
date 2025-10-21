# String Analyzer API

A simple RESTful API built with Node.js and Express that analyzes strings, computes their properties, and supports both query filtering and natural language filtering.

---

##  Features

For each string analyzed, the API computes:

- **length** → number of characters  
- **is_palindrome** → checks if string reads the same backward (case-insensitive)  
- **unique_characters** → number of distinct characters  
- **word_count** → number of words separated by spaces  
- **sha256_hash** → unique hash ID of the string  
- **character_frequency_map** → object showing how many times each character occurs  

---

##  Tech Stack

- **Node.js** 
- **Express.js**
- **File System (fs)** for local storage
- **Crypto** (for SHA-256 hashing)

---

## Project Structure

string-analyzer/

├── server.js

├── strings.json 

└── utils/
  - └── analyzeString.js
  - └── naturallang.js
  - └── filters.js

---

##  Setup Instructions

###  Clone the repository

```
git clone https://github.com/adewoye-saheed-dML/string-analyzer.git
cd string-analyzer
```
### Install dependencies
```
npm install
```
### Run the server
Add this script in package.json:
```
"scripts": {
  "start": "nodemon server.js"
}
```
Then run:

```
npm start
```
Server starts on:
`http://localhost:3001`

###  API Endpoints
1. Create / Analyze String
POST `/strings`

Request Body
```
{ "value": "racecar" }
```
Response (201 Created)
```
{
  "id": "7fdb0c...",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 5,
    "word_count": 1,
    "sha256_hash": "7fdb0c...",
    "character_frequency_map": {
      "r": 2,
      "a": 2,
      "c": 2,
      "e": 1
    }
  },
  "created_at": "2025-10-21T10:00:00Z"
}
```
Error Responses

- 400 – Missing or invalid request body
- 409 – String already exists
- 422 – Value not a string

2. Get Specific String
GET `/strings/{string_value}`

Example
GET `/strings/racecar`
Response (200 OK)
```
{
  "id": "7fdb0c...",
  "value": "racecar",
  "properties": { ... },
  "created_at": "2025-10-21T10:00:00Z"
}
```
Error
- 404 – Not found

3. Get All Strings
GET `/strings`

Response (200 OK)
```
{
  "data": [ ...all strings... ],
  "count": 5
}
```
4. Natural Language Filtering
GET `/strings/filter-by-natural-language?query=<your sentence>`

Examples
```
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
GET /strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters
GET /strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20z
```
Response (200 OK)
```
{
  "data": [
    {
      "value": "racecar",
      "properties": { "is_palindrome": true, "word_count": 1, ... }
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": { "is_palindrome": true, "word_count": 1 }
  }
}
```
Error
- 400 – Missing or unrecognized query
- 422 – Conflicting query filters

5. Delete String
DELETE `/strings/{string_value}`

Example
```
DELETE /strings/racecar
```
Response
- 204 No Content
Error
- 404 – Not found

### Local Testing (using curl)
Add a string
```
curl -X POST http://localhost:3001/strings \
-H "Content-Type: application/json" \
-d '{"value": "racecar"}'
```
Get all strings
```
curl http://localhost:3001/strings
```
Natural language filter
```
curl "http://localhost:3001/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```
Delete a string
```
curl -X DELETE http://localhost:3001/strings/racecar
```
### How It Works
- Strings are stored in a local JSON file (strings.json).
- Each string is hashed with SHA-256 to create a unique ID.
- The analysis function calculates length, word count, unique characters, and palindrome status.
- You can filter stored strings via query parameters or natural language input.

### Deployment
This API is deployed on Railway, use the link below to access It
