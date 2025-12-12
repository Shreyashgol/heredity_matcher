const express = require('express');
const router = express.Router();
const {
  addPerson,
  addRelationship,
  addCondition,
  getAllPeople,
  getFamilyTree,
  calculateRisk
} = require('../controllers/familyController');

// Person routes
router.post('/person', addPerson);
router.get('/people', getAllPeople);

// Relationship routes
router.post('/relationship', addRelationship);

// Condition routes
router.post('/condition', addCondition);

// Family tree routes
router.get('/tree/:personId', getFamilyTree);
router.get('/risk/:personId/:conditionName', calculateRisk);

module.exports = router;
