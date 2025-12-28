const pool = require('../config/db');
const { generateRiskReport } = require('../services/geminiService');
const { logActivity } = require('./enhancedFamilyController');

const addPerson = async (req, res) => {
  try {
    const { name, birth_date, gender } = req.body;
    const userId = req.user?.userId;

    if (!name || !birth_date || !gender) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, birth_date, gender'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    if (new Date(birth_date) > new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Birth date cannot be in the future'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO people (name, birth_date, gender, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, birth_date, gender, userId]
    );
    
    await logActivity(userId, 'CREATE', 'PERSON', result.rows[0].id, {
      name, birth_date, gender
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding person:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add person'
    });
  }
};

const addRelationship = async (req, res) => {
  try {
    const { parent_id, child_id, type } = req.body;
    const userId = req.user?.userId;
    
    if (!['Father', 'Mother'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either "Father" or "Mother"'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO relationships (parent_id, child_id, type) VALUES ($1, $2, $3) RETURNING *',
      [parent_id, child_id, type]
    );
    
    await logActivity(userId, 'CREATE', 'RELATIONSHIP', result.rows[0].id, {
      parent_id, child_id, type
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding relationship:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add relationship'
    });
  }
};

const addCondition = async (req, res) => {
  try {
    const { person_id, condition_name, diagnosed_date } = req.body;
    const userId = req.user?.userId;
    
    const result = await pool.query(
      'INSERT INTO conditions (person_id, condition_name, diagnosed_date) VALUES ($1, $2, $3) RETURNING *',
      [person_id, condition_name, diagnosed_date]
    );
    
    await logActivity(userId, 'CREATE', 'CONDITION', result.rows[0].id, {
      person_id, condition_name, diagnosed_date
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding condition:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add condition'
    });
  }
};

const getAllPeople = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const result = await pool.query(
      'SELECT * FROM people WHERE user_id = $1 ORDER BY id',
      [userId]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch people'
    });
  }
};

const getFamilyTree = async (req, res) => {
  try {
    const { personId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const personCheck = await pool.query(
      'SELECT id FROM people WHERE id = $1 AND user_id = $2',
      [personId, userId]
    );

    if (personCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Person not found or access denied'
      });
    }
    
    const query = `
      WITH RECURSIVE ancestors AS (
        -- Base case: Start with the person
        SELECT 
          p.id,
          p.name,
          p.birth_date,
          p.gender,
          0 as generation_level,
          ARRAY[p.id] as path
        FROM people p
        WHERE p.id = $1 AND p.user_id = $2
        
        UNION ALL
        
        -- Recursive case: Get parents
        SELECT 
          p.id,
          p.name,
          p.birth_date,
          p.gender,
          a.generation_level + 1 as generation_level,
          a.path || p.id as path
        FROM people p
        INNER JOIN relationships r ON p.id = r.parent_id
        INNER JOIN ancestors a ON r.child_id = a.id
        WHERE NOT p.id = ANY(a.path) AND p.user_id = $2
      )
      SELECT 
        a.id,
        a.name,
        a.birth_date,
        a.gender,
        a.generation_level,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'condition_name', c.condition_name,
              'diagnosed_date', c.diagnosed_date
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) as conditions
      FROM ancestors a
      LEFT JOIN conditions c ON a.id = c.person_id
      GROUP BY a.id, a.name, a.birth_date, a.gender, a.generation_level
      ORDER BY a.generation_level;
    `;
    
    const result = await pool.query(query, [personId, userId]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching family tree:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch family tree'
    });
  }
};

const calculateRisk = async (req, res) => {
  try {
    const { personId, conditionName } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const personCheck = await pool.query(
      'SELECT id, name FROM people WHERE id = $1 AND user_id = $2',
      [personId, userId]
    );

    if (personCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Person not found or access denied'
      });
    }

    const patientName = personCheck.rows[0].name;
    
    const query = `
      WITH RECURSIVE ancestors AS (
        SELECT 
          p.id,
          p.name,
          p.birth_date,
          0 as generation_level,
          ARRAY[p.id] as path
        FROM people p
        WHERE p.id = $1 AND p.user_id = $3
        
        UNION ALL
        
        SELECT 
          p.id,
          p.name,
          p.birth_date,
          a.generation_level + 1 as generation_level,
          a.path || p.id as path
        FROM people p
        INNER JOIN relationships r ON p.id = r.parent_id
        INNER JOIN ancestors a ON r.child_id = a.id
        WHERE NOT p.id = ANY(a.path) AND p.user_id = $3
      )
      SELECT DISTINCT
        a.id,
        a.name,
        a.birth_date,
        a.generation_level,
        c.condition_name,
        c.diagnosed_date
      FROM ancestors a
      INNER JOIN conditions c ON a.id = c.person_id
      WHERE c.condition_name = $2 AND a.generation_level > 0
      ORDER BY a.generation_level;
    `;
    
    const result = await pool.query(query, [personId, conditionName, userId]);

    const riskMap = {
      1: 50,    // Parents
      2: 25,    // Grandparents
      3: 12.5,  // Great-grandparents
      4: 6.25   // Great-great-grandparents
    };
    
    let totalRisk = 0;
    const affectedAncestors = [];
    
    result.rows.forEach(ancestor => {
      const risk = riskMap[ancestor.generation_level] || 3.125;
      totalRisk += risk;
      affectedAncestors.push({
        name: ancestor.name,
        generation: ancestor.generation_level,
        risk: risk,
        diagnosedDate: ancestor.diagnosed_date
      });
    });
    
    totalRisk = Math.min(totalRisk, 100);
    const riskLevel = totalRisk > 50 ? 'High' : totalRisk > 25 ? 'Medium' : totalRisk > 0 ? 'Low' : 'None';
    

    const aiReportResult = await generateRiskReport({
      patientName,
      conditionName,
      totalRisk,
      riskLevel,
      affectedAncestors
    });

    await logActivity(userId, 'CALCULATE_RISK', 'REPORT', personId, {
      patientName,
      condition: conditionName,
      totalRisk,
      riskLevel
    });

    res.status(200).json({
      success: true,
      data: {
        patientName,
        condition: conditionName,
        totalRisk: totalRisk,
        riskLevel: riskLevel,
        affectedAncestors: affectedAncestors,
        aiReport: aiReportResult.report,
        aiReportSuccess: aiReportResult.success,
        generatedAt: aiReportResult.generatedAt
      }
    });
  } catch (error) {
    console.error('Error calculating risk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate risk'
    });
  }
};

module.exports = {
  addPerson,
  addRelationship,
  addCondition,
  getAllPeople,
  getFamilyTree,
  calculateRisk
};
