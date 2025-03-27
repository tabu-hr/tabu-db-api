const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { queryAdditionalPositionByUniqueId } = require('../../models/additional_position');
const { responseAdditionalPositionData } = require('../../dto/additional_position');
const { validateAdditionalPosition } = require('../../validators');
const { extractToken, authenticateToken } = require('../../middleware/auth');

router.post('/check', extractToken, authenticateToken, async (req, res, next) => {
  try {
    const { unique_id } = req.body;
    const row = await queryAdditionalPositionByUniqueId(unique_id);
    if (row) {
      res.json(responseAdditionalPositionData(true, 'Additional position data exists', true, 'queryAdditionalPositionByUniqueId', null, row.additional_position_group, row.additional_position));
    } else {
      throw new NotFoundError('Additional position data not found for the provided unique_id');
    }
  } catch (err) {
    console.error(`[Development] Error processing request: ${err.message}`);
    next(err);
  }
});

module.exports = router;
