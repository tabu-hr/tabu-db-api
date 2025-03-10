const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { queryAdditionalPositionByUniqueId } = require('../../models/additional_position');
const { responseAdditionalPositionData } = require('../../dto/additional_position');
const { validateAdditionalPosition } = require('../../validators');

/**
 * @swagger
 * /api/additional_position/check:
 *   post:
 *     summary: Check additional position data
 *     description: Retrieves additional position data for the given unique ID
 *     tags: [Additional Positions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *             properties:
 *               unique_id:
 *                 type: string
 *                 description: Unique identifier for the additional position
 *     responses:
 *       200:
 *         description: Additional position data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exists:
 *                       type: boolean
 *                     additional_position_group:
 *                       type: string
 *                     additional_position:
 *                       type: string
 *                 type:
 *                   type: string
 *                 action:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Additional position not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/check', validateAdditionalPosition, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const row = await queryAdditionalPositionByUniqueId(unique_id);
    if (row) {
      res.json(responseAdditionalPositionData(true, 'Additional position data exists', true, 'queryAdditionalPositionByUniqueId', null, row.additional_position_group, row.additional_position));
    } else {
      throw new NotFoundError('Additional position data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

