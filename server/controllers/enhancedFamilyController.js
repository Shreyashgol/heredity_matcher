const pool = require('../config/db');

// Helper function to log activity
const logActivity = async (userId, actionType, entityType, entityId, details) => {
  try {
    await pool.query(
      'INSERT INTO activity_history (user_id, action_type, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [userId, actionType, entityType, entityId, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Get people with pagination, sorting, and filtering
const getPeopleWithFilters = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Sorting parameters
    const sortBy = req.query.sortBy || 'name'; // name, birth_date, gender, created_at
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    // Filtering parameters
    const searchName = req.query.search || '';
    const gender = req.query.gender || '';
    const hasConditions = req.query.hasConditions; // 'true', 'false', or undefined

    // Build WHERE clause
    let whereConditions = ['p.user_id = $1', 'p.deleted_at IS NULL'];
    let queryParams = [userId];
    let paramIndex = 2;

    if (searchName) {
      whereConditions.push(`p.name ILIKE $${paramIndex}`);
      queryParams.push(`%${searchName}%`);
      paramIndex++;
    }

    if (gender) {
      whereConditions.push(`p.gender = $${paramIndex}`);
      queryParams.push(gender);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Build main query
    let mainQuery = `
      SELECT 
        p.id,
        p.name,
        p.birth_date,
        p.gender,
        p.created_at,
        p.updated_at,
        COUNT(DISTINCT c.id) as condition_count,
        COUNT(DISTINCT r_parent.id) as parent_count,
        COUNT(DISTINCT r_child.id) as child_count,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'condition_name', c.condition_name,
              'diagnosed_date', c.diagnosed_date
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) as conditions
      FROM people p
      LEFT JOIN conditions c ON p.id = c.person_id AND c.deleted_at IS NULL
      LEFT JOIN relationships r_parent ON p.id = r_parent.child_id AND r_parent.deleted_at IS NULL
      LEFT JOIN relationships r_child ON p.id = r_child.parent_id AND r_child.deleted_at IS NULL
      WHERE ${whereClause}
      GROUP BY p.id, p.name, p.birth_date, p.gender, p.created_at, p.updated_at
    `;

    // Apply hasConditions filter after grouping
    if (hasConditions === 'true') {
      mainQuery = `SELECT * FROM (${mainQuery}) AS filtered WHERE condition_count > 0`;
    } else if (hasConditions === 'false') {
      mainQuery = `SELECT * FROM (${mainQuery}) AS filtered WHERE condition_count = 0`;
    }

    // Add sorting and pagination
    const validSortColumns = ['name', 'birth_date', 'gender', 'created_at', 'condition_count'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    
    mainQuery += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM people p
      LEFT JOIN conditions c ON p.id = c.person_id AND c.deleted_at IS NULL
      WHERE ${whereClause}
    `;

    if (hasConditions === 'true') {
      countQuery = `
        SELECT COUNT(*) as total FROM (
          SELECT p.id, COUNT(c.id) as condition_count
          FROM people p
          LEFT JOIN conditions c ON p.id = c.person_id AND c.deleted_at IS NULL
          WHERE ${whereClause}
          GROUP BY p.id
          HAVING COUNT(c.id) > 0
        ) AS filtered
      `;
    } else if (hasConditions === 'false') {
      countQuery = `
        SELECT COUNT(*) as total FROM (
          SELECT p.id, COUNT(c.id) as condition_count
          FROM people p
          LEFT JOIN conditions c ON p.id = c.person_id AND c.deleted_at IS NULL
          WHERE ${whereClause}
          GROUP BY p.id
          HAVING COUNT(c.id) = 0
        ) AS filtered
      `;
    }

    const [dataResult, countResult] = await Promise.all([
      pool.query(mainQuery, queryParams),
      pool.query(countQuery, queryParams.slice(0, paramIndex - 2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching people with filters:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch people' });
  }
};

// Soft delete a person
const deletePerson = async (req, res) => {
  try {
    const { personId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Verify person belongs to user
    const personCheck = await pool.query(
      'SELECT * FROM people WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [personId, userId]
    );

    if (personCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Person not found' });
    }

    const person = personCheck.rows[0];

    // Soft delete person
    await pool.query(
      'UPDATE people SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [personId]
    );

    // Log activity
    await logActivity(userId, 'DELETE', 'PERSON', personId, {
      name: person.name,
      birth_date: person.birth_date,
      gender: person.gender
    });

    res.status(200).json({
      success: true,
      message: 'Person deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ success: false, error: 'Failed to delete person' });
  }
};

// Delete a relationship
const deleteRelationship = async (req, res) => {
  try {
    const { relationshipId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Verify relationship belongs to user's people
    const relationshipCheck = await pool.query(
      `SELECT r.* FROM relationships r
       INNER JOIN people p ON r.parent_id = p.id
       WHERE r.id = $1 AND p.user_id = $2 AND r.deleted_at IS NULL`,
      [relationshipId, userId]
    );

    if (relationshipCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Relationship not found' });
    }

    const relationship = relationshipCheck.rows[0];

    // Soft delete relationship
    await pool.query(
      'UPDATE relationships SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [relationshipId]
    );

    // Log activity
    await logActivity(userId, 'DELETE', 'RELATIONSHIP', relationshipId, {
      parent_id: relationship.parent_id,
      child_id: relationship.child_id,
      type: relationship.type
    });

    res.status(200).json({
      success: true,
      message: 'Relationship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting relationship:', error);
    res.status(500).json({ success: false, error: 'Failed to delete relationship' });
  }
};

// Delete a condition
const deleteCondition = async (req, res) => {
  try {
    const { conditionId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Verify condition belongs to user's people
    const conditionCheck = await pool.query(
      `SELECT c.* FROM conditions c
       INNER JOIN people p ON c.person_id = p.id
       WHERE c.id = $1 AND p.user_id = $2 AND c.deleted_at IS NULL`,
      [conditionId, userId]
    );

    if (conditionCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Condition not found' });
    }

    const condition = conditionCheck.rows[0];

    // Soft delete condition
    await pool.query(
      'UPDATE conditions SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conditionId]
    );

    // Log activity
    await logActivity(userId, 'DELETE', 'CONDITION', conditionId, {
      person_id: condition.person_id,
      condition_name: condition.condition_name,
      diagnosed_date: condition.diagnosed_date
    });

    res.status(200).json({
      success: true,
      message: 'Condition deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting condition:', error);
    res.status(500).json({ success: false, error: 'Failed to delete condition' });
  }
};

// Get activity history
const getActivityHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const actionType = req.query.actionType || ''; // CREATE, UPDATE, DELETE, CALCULATE_RISK
    const entityType = req.query.entityType || ''; // PERSON, RELATIONSHIP, CONDITION, REPORT

    let whereConditions = ['user_id = $1'];
    let queryParams = [userId];
    let paramIndex = 2;

    if (actionType) {
      whereConditions.push(`action_type = $${paramIndex}`);
      queryParams.push(actionType);
      paramIndex++;
    }

    if (entityType) {
      whereConditions.push(`entity_type = $${paramIndex}`);
      queryParams.push(entityType);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT * FROM activity_history
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const countQuery = `SELECT COUNT(*) as total FROM activity_history WHERE ${whereClause}`;

    const [dataResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, queryParams.slice(0, paramIndex - 2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching activity history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch activity history' });
  }
};

// Get conditions with pagination and filtering
const getConditionsWithFilters = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const personId = req.query.personId || '';
    const conditionName = req.query.conditionName || '';

    let whereConditions = ['p.user_id = $1', 'c.deleted_at IS NULL'];
    let queryParams = [userId];
    let paramIndex = 2;

    if (personId) {
      whereConditions.push(`c.person_id = $${paramIndex}`);
      queryParams.push(personId);
      paramIndex++;
    }

    if (conditionName) {
      whereConditions.push(`c.condition_name ILIKE $${paramIndex}`);
      queryParams.push(`%${conditionName}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT 
        c.id,
        c.person_id,
        c.condition_name,
        c.diagnosed_date,
        c.created_at,
        p.name as person_name,
        p.birth_date as person_birth_date
      FROM conditions c
      INNER JOIN people p ON c.person_id = p.id
      WHERE ${whereClause}
      ORDER BY c.diagnosed_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM conditions c
      INNER JOIN people p ON c.person_id = p.id
      WHERE ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, queryParams.slice(0, paramIndex - 2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching conditions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch conditions' });
  }
};

// Update person
const updatePerson = async (req, res) => {
  try {
    const { personId } = req.params;
    const { name, birth_date, gender } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Verify person belongs to user
    const personCheck = await pool.query(
      'SELECT * FROM people WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [personId, userId]
    );

    if (personCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Person not found' });
    }

    const oldPerson = personCheck.rows[0];

    // Update person
    const result = await pool.query(
      'UPDATE people SET name = $1, birth_date = $2, gender = $3 WHERE id = $4 RETURNING *',
      [name, birth_date, gender, personId]
    );

    // Log activity
    await logActivity(userId, 'UPDATE', 'PERSON', personId, {
      old: { name: oldPerson.name, birth_date: oldPerson.birth_date, gender: oldPerson.gender },
      new: { name, birth_date, gender }
    });

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating person:', error);
    res.status(500).json({ success: false, error: 'Failed to update person' });
  }
};

module.exports = {
  getPeopleWithFilters,
  deletePerson,
  deleteRelationship,
  deleteCondition,
  getActivityHistory,
  getConditionsWithFilters,
  updatePerson,
  logActivity
};
