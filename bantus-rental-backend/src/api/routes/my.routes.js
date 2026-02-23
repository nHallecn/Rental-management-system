const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenant.controller');
const IssueReportController = require('../controllers/issuereport.controller'); // <-- Import
const { protect, isTenant } = require('../middleware/auth.middleware');

router.use(protect, isTenant);

// Dashboard
router.get('/dashboard', TenantController.getMyDashboard);

// Issue Reporting
router.post('/issues', IssueReportController.createIssueReport); // <-- Add this
router.get('/issues', IssueReportController.getMyIssues);       // <-- Add this

module.exports = router;
