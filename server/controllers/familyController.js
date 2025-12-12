const pool = require('../config/db');

// Add a new person
const addPerson = async (req, res) => {
  try {
    const { name, birth_date, gender } = req.body;
    
    const result = await pool.query(
      'INSERT INTO people (name, birth_date, gender) VALUES ($1, $2, $3) RETURNING *',
      [name, birth_date, gender]
    );
    
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

// Add a relationship (parent-child)
const addRelationship = async (req, res) => {
  try {
    const { parent_id, child_id, type } = req.body;
    
    // Validate type
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

// Add a condition to a person
const addCondition = async (req, res) => {
  try {
    const { person_id, condition_name, diagnosed_date } = req.body;
    
    const result = await pool.query(
      'INSERT INTO conditions (person_id, condition_name, diagnosed_date) VALUES ($1, $2, $3) RETURNING *',
      [person_id, condition_name, diagnosed_date]
    );
    
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

// Get all people
const getAllPeople = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM people ORDER BY id');
    
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

// Get family tree with ancestors using Recursive CTE
const getFamilyTree = async (req, res) => {
  try {
    const { personId } = req.params;
    
    // Recursive CTE to get all ancestors
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
        WHERE p.id = $1
        
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
        WHERE NOT p.id = ANY(a.path) -- Prevent cycles
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
    
    const result = await pool.query(query, [personId]);
    
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

// Calculate risk for a specific condition
const calculateRisk = async (req, res) => {
  try {
    const { personId, conditionName } = req.params;
    
    // Get ancestors with the specific condition
    const query = `
      WITH RECURSIVE ancestors AS (
        SELECT 
          p.id,
          p.name,
          0 as generation_level,
          ARRAY[p.id] as path
        FROM people p
        WHERE p.id = $1
        
        UNION ALL
        
        SELECT 
          p.id,
          p.name,
          a.generation_level + 1 as generation_level,
          a.path || p.id as path
        FROM people p
        INNER JOIN relationships r ON p.id = r.parent_id
        INNER JOIN ancestors a ON r.child_id = a.id
        WHERE NOT p.id = ANY(a.path)
      )
      SELECT DISTINCT
        a.id,
        a.name,
        a.generation_level,
        c.condition_name
      FROM ancestors a
      INNER JOIN conditions c ON a.id = c.person_id
      WHERE c.condition_name = $2 AND a.generation_level > 0
      ORDER BY a.generation_level;
    `;
    
    const result = await pool.query(query, [personId, conditionName]);
    
    // Calculate risk based on generation
    const riskMap = {
      1: 50,  // Parents
      2: 25,  // Grandparents
      3: 12.5 // Great-grandparents
    };
    
    let totalRisk = 0;
    const affectedAncestors = [];
    
    result.rows.forEach(ancestor => {
      const risk = riskMap[ancestor.generation_level] || 6.25; // Default for further generations
      totalRisk += risk;
      affectedAncestors.push({
        name: ancestor.name,
        generation: ancestor.generation_level,
        risk: risk
      });
    });
    
    // Cap at 100%
    totalRisk = Math.min(totalRisk, 100);
    
    res.status(200).json({
      success: true,
      data: {
        condition: conditionName,
        totalRisk: totalRisk,
        riskLevel: totalRisk > 50 ? 'High' : totalRisk > 25 ? 'Medium' : totalRisk > 0 ? 'Low' : 'None',
        affectedAncestors: affectedAncestors
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
