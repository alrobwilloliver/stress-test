const express = require('express');
const mongoose = require('mongoose');

const fs = require('fs');

// Create Express app
const app = express();

// JSON body parsing middleware
app.use(express.json({ limit: "50mb" }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/scans', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Scan model
const Scan = mongoose.model('Scan', {
  jobId: String,
  scanUrl: String,
  date: String,
  status: String,
  issues: Array,
});

const Render = mongoose.model('Render', {
  blob: String,
  format: String,
  url: String,
  coords: Array,
  status: String
});

// POST endpoint to receive scan results
app.get('/scan-results', async (req, res) => {
  res.sendStatus(200);
});

// POST endpoint to receive scan results
app.post('/scan-results', async (req, res) => {
  const { job_id, scan_url, payload } = req.body;

  const status = payload.status;
  const issues = payload.issues;
  const date = payload.date;
  const blob = payload.blob;
  // Save scan results to MongoDB
  console.log(job_id)
  writeArrayToJsonFile(issues, "issues.json");

  // await Scan.create({
  //   jobId: job_id,
  //   scanUrl: scan_url,
  //   date,
  //   status,
  //   issues,
  //   blob
  // });

  res.sendStatus(200);
});

// body of request (scan)
/*
status: "completed",
job_id: job.data.jobId,
payload: {
    scan_url: job.data.scanUrl,
    date: new Date().toISOString(),
    status: "complete",
    issues: job.data.issues
},
*/

// POST endpoint to receive render results
app.post('/scan-results-render', async (req, res) => {
  const { status, payload, result } = req.body;

  if (payload) {
    await Render.create({
      blob: "",
      url: "",
      status,
      coords: []
    });
    res.sendStatus(200)
    return
  }

  // Save scan results to MongoDB
  await Render.create({
    blob: result.blob,
    url: result.url,
    status,
    coords: result.coords
  });

  res.sendStatus(200);
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


function writeArrayToJsonFile(array, fileName) {
  // Convert the array of objects to a JSON string
  const jsonString = JSON.stringify(array, null, 2);

  // Write the JSON string to a file
  fs.writeFile(fileName, jsonString, 'utf8', (err) => {
      if (err) {
          console.log("An error occurred while writing JSON Object to File.");
          return console.log(err);
      }

      console.log("JSON file has been saved.");
  });
}