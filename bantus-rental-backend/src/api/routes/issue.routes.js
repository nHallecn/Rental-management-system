const express = require('express');
const router = express.Router();
const IssueReportController = require('../controllers/issuereport.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

// All routes for landlords to manage issues
router.use(protect, isLandlord);

// GET /api/issues -> Get all issues for the landlord's properties
router.get('/', IssueReportController.getAllIssuesForLandlord);

// PUT /api/issues/:issueId/status -> Update the status of an issue
router.put('/:issueId/status', IssueReportController.updateIssueStatus);

module.exports = router;

