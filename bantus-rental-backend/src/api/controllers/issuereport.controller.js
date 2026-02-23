const IssueReportModel = require('../../models/issuereport.model');
const TenantModel = require('../../models/tenant.model');
const TenantSessionModel = require('../../models/tenantsession.model');
const LandlordModel = require('../../models/landlord.model');

// --- Tenant Actions ---

// Controller for a tenant to create a new issue report
const createIssueReport = async (req, res) => {
    const { description, image } = req.body;
    const tenantUserId = req.user.userId;

    if (!description) {
        return res.status(400).json({ message: 'A description of the issue is required.' });
    }

    try {
        // Find the tenant's active session
        const tenant = await TenantModel.findByUserId(tenantUserId);
        const activeSession = await TenantSessionModel.findActiveByTenantId(tenant.tenantId);
        if (!activeSession) {
            return res.status(404).json({ message: 'No active rental session found.' });
        }

        const newIssue = await IssueReportModel.create({ sessionId: activeSession.sessionId, description, image });
        res.status(201).json({ message: 'Issue reported successfully!', data: newIssue });

    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while reporting the issue.' });
    }
};

// Controller for a tenant to view their own reported issues
const getMyIssues = async (req, res) => {
    const tenantUserId = req.user.userId;
    try {
        const tenant = await TenantModel.findByUserId(tenantUserId);
        const activeSession = await TenantSessionModel.findActiveByTenantId(tenant.tenantId);
        if (!activeSession) {
            return res.status(200).json({ data: [] }); // No session means no issues
        }
        const issues = await IssueReportModel.findBySessionId(activeSession.sessionId);
        res.status(200).json({ message: 'Issues fetched successfully.', data: issues });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- Landlord Actions ---

// Controller for a landlord to view all issues in their properties
const getAllIssuesForLandlord = async (req, res) => {
    const landlordUserId = req.user.userId;
    try {
        const landlord = await LandlordModel.findByUserId(landlordUserId);
        const issues = await IssueReportModel.findByLandlordId(landlord.landlordId);
        res.status(200).json({ message: 'All issues fetched successfully.', data: issues });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller for a landlord to update the status of an issue
const updateIssueStatus = async (req, res) => {
    const { issueId } = req.params;
    const { status } = req.body;
    const landlordUserId = req.user.userId;

    if (!status || !['open', 'in_progress', 'resolved'].includes(status)) {
        return res.status(400).json({ message: 'A valid status (open, in_progress, resolved) is required.' });
    }

    try {
        // Security check: Ensure the landlord owns the property associated with the issue
        const landlord = await LandlordModel.findByUserId(landlordUserId);
        const issue = await IssueReportModel.findById(issueId);
        if (!issue) return res.status(404).json({ message: 'Issue not found.' });

        const allIssues = await IssueReportModel.findByLandlordId(landlord.landlordId);
        if (!allIssues.some(i => i.issueId === parseInt(issueId))) {
            return res.status(403).json({ message: 'Access denied. You do not own the property related to this issue.' });
        }

        await IssueReportModel.updateStatusById(issueId, status);
        res.status(200).json({ message: `Issue status updated to '${status}'.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createIssueReport,
    getMyIssues,
    getAllIssuesForLandlord,
    updateIssueStatus,
};
