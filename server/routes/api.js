const express = require('express');
const router = express.Router();
const {addPerson, addRelationship, addCondition, getAllPeople, getFamilyTree, calculateRisk} = require('../controllers/familyController');
const {
  getPeopleWithFilters,
  deletePerson,
  deleteRelationship,
  deleteCondition,
  getActivityHistory,
  getConditionsWithFilters,
  updatePerson
} = require('../controllers/enhancedFamilyController');
const { verifyToken } = require('../middleware/middleware');
const { generatePDFReport } = require('../services/reportService');

// All routes require authentication
router.use(verifyToken);

// Person routes
router.post('/person', addPerson);
router.get('/people', getAllPeople); 
router.get('/people/filtered', getPeopleWithFilters); 
router.put('/person/:personId', updatePerson);
router.delete('/person/:personId', deletePerson);

// Relationship routes
router.post('/relationship', addRelationship);
router.delete('/relationship/:relationshipId', deleteRelationship);

// Condition routes
router.post('/condition', addCondition);
router.get('/conditions', getConditionsWithFilters);
router.delete('/condition/:conditionId', deleteCondition);

// Family tree routes
router.get('/tree/:personId', getFamilyTree);
router.get('/risk/:personId/:conditionName', calculateRisk);

// History route
router.get('/history', getActivityHistory);

router.post('/generate-report-pdf', async (req, res) => {
  try {
    const { patientName, condition, totalRisk, riskLevel, affectedAncestors, aiReport, generatedAt, treeData } = req.body;

    if (!patientName || !condition || totalRisk === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for report generation'
      });
    }

    if (typeof patientName !== 'string' || patientName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid patient name'
      });
    }

    if (typeof condition !== 'string' || condition.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid condition'
      });
    }

    if (typeof totalRisk !== 'number' || totalRisk < 0 || totalRisk > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid risk percentage'
      });
    }

    if (treeData && !Array.isArray(treeData)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tree data format'
      });
    }

    if (affectedAncestors && !Array.isArray(affectedAncestors)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid affected ancestors format'
      });
    }

    const reportData = {
      patientName: patientName.trim(),
      condition: condition.trim(),
      totalRisk,
      riskLevel: riskLevel || 'Unknown',
      affectedAncestors: Array.isArray(affectedAncestors) ? affectedAncestors : [],
      aiReport: aiReport || '',
      generatedAt: generatedAt || new Date().toISOString(),
      treeData: Array.isArray(treeData) ? treeData : []
    };

    const result = await generatePDFReport(reportData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in generate-report-pdf endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF report'
    });
  }
});

module.exports = router;
