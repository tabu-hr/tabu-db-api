const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { queryListTechByUniqueId } = require('../../models/list_tech');
const { responseListTechData } = require('../../dto/list_tech');
const { validateListTech } = require('../../validators');

/**
 * @swagger
 * /api/list_tech/check:
 *   post:
 *     summary: Check technology list data
 *     description: Retrieves technology list for the given unique ID
 *     tags: [Technology]
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
 *                 description: Unique identifier for the technology list
 *     responses:
 *       200:
 *         description: Technology list data
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
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
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
 *         description: Technology list not found
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
router.post('/check', validateListTech, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const rows = await queryListTechByUniqueId(unique_id);
    if (rows.length > 0) {
      res.json(responseListTechData(true, 'List tech data exists', true, 'queryListTechByUniqueId', null, rows));
    } else {
      throw new NotFoundError('List tech data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

