const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../errors/customErrors');
const { queryListContractTypeByUniqueId } = require('../../models/list_contract_type');
const { responseListContractTypeData } = require('../../dto/list_contract_type');
const { validateListContractType } = require('../../validators');

/**
 * @swagger
 * /api/list_contract_type/check:
 *   post:
 *     summary: Check contract type data
 *     description: Retrieves contract type information for the given unique ID
 *     tags: [Contract]
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
 *                 description: Unique identifier for the contract type data
 *     responses:
 *       200:
 *         description: Contract type data
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
 *                         properties:
 *                           contract_type:
 *                             type: string
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
 *         description: Contract type data not found
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
router.post('/check', validateListContractType, async (req, res, next) => {
  const { unique_id } = req.body;
  try {
    const rows = await queryListContractTypeByUniqueId(unique_id);
    if (rows.length > 0) {
      res.json(responseListContractTypeData(true, 'List Contract type data exists', true, 'queryListContractTypeByUniqueId', null, rows));
    } else {
      throw new NotFoundError('List Contract type data not found for the provided unique_id');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

