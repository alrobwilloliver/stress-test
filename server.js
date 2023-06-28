const express = require('express');
const mongoose = require('mongoose');

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

// POST endpoint to receive scan results
app.post('/scan-results', async (req, res) => {
  const { job_id, scan_url, payload } = req.body;

  const status = payload.status;
  const issues = payload.issues;
  const date = payload.date;
  // Save scan results to MongoDB
  await Scan.create({
    jobId: job_id,
    scanUrl: scan_url,
    date,
    status,
    issues,
  });

  res.sendStatus(200);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// body of request
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