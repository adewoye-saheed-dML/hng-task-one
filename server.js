const express =require('express');
const fs = require("fs");
const crypto = require("crypto");
const app=express();
app.use(express.json());


const dataFile = "./strings.json";
const readData = () => JSON.parse(fs.readFileSync(dataFile, "utf8"));
const writeData = (d) => fs.writeFileSync(dataFile, JSON.stringify(d, null, 2));
const analyze = require("./utils/analyzeString");
const parseNaturalLanguageQuery = require("./utils/naturallang");
const applyFilters = require("./utils/filters");


// POST /strings
app.post("/strings", (req, res) => {
    const { value } = req.body;
    if (typeof value !== "string")
      return res.status(422).json({ error: "Value must be a string" });
    const all = readData();
    const sha = crypto.createHash("sha256").update(value).digest("hex");
    if (all.find((s) => s.id === sha))
      return res.status(409).json({ error: "String already exists" });
  
    const props = analyze(value);
    const record = {
      id: sha,
      value,
      properties: props,
      created_at: new Date().toISOString(),
    };
    all.push(record);
    writeData(all);
    res.status(201).json(record);
  });
  

// GET /strings/filter-by-natural-language
app.get("/strings/filter-by-natural-language", (req, res) => {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ error: "Missing query" });
  
    const parsed = parseNaturalLanguageQuery(query);
    if (!parsed)
      return res.status(400).json({ error: "Unable to parse query" });
  
    const all = readData();
    const filtered = applyFilters(all, parsed);
  
    res.json({
      data: filtered,
      count: filtered.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsed,
      },
    });
  });


  // GET /strings/:value
  app.get("/strings/:value", (req, res) => {
    const { value } = req.params;
    const sha = crypto.createHash("sha256").update(value).digest("hex");
    const all = readData();
    const found = all.find((s) => s.id === sha);
    if (!found) return res.status(404).json({ error: "Not found" });
    res.json(found);
  });
  
  // GET /strings (basic filtering)
  app.get("/strings", (req, res) => {
    const all = readData();
    res.json({ data: all, count: all.length });
  });
  


  // DELETE /strings/:value
  app.delete("/strings/:value", (req, res) => {
    const { value } = req.params;
    const sha = crypto.createHash("sha256").update(value).digest("hex");
    let all = readData();
    const idx = all.findIndex((s) => s.id === sha);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.splice(idx, 1);
    writeData(all);
    res.status(204).end();
  });
  

  

  app.listen(3001, () => console.log("Server running on http://localhost:3001"));


