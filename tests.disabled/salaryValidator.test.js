const { expect, fail } = require('@jest/globals');
const sinon = require('sinon');
const {
  validateSalaryCheck,
  validateGetSalaryById,
  validateCreateSalary,
  validateUpdateSalary,
  validateListSalaries,
  validateDeleteSalary
} = require('../src/validators/salaryValidator');
const { ValidationError } = require('../src/errors/customErrors');

// Helper function to add a small delay to allow promises to resolve
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Salary Validators', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('validateSalaryCheck', () => {
    it('should pass validation with valid unique_id', async () => {
      req.body = {
        unique_id: 'B64QHVG3AT'
      };
      
      await validateSalaryCheck(req, res, next);
      await delay(10); // Small delay to allow promises to resolve
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should fail validation when unique_id is missing', async () => {
      req.body = {};
      
      await validateSalaryCheck(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when unique_id is not a string', async () => {
      req.body = {
        unique_id: 12345
      };
      
      await validateSalaryCheck(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when unique_id is empty', async () => {
      req.body = {
        unique_id: ''
      };
      
      await validateSalaryCheck(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });
  });

  describe('validateGetSalaryById', () => {
    it('should pass validation with valid unique_id in params', async () => {
      req.params = {
        unique_id: 'B64QHVG3AT'
      };
      
      await validateGetSalaryById(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should fail validation when unique_id in params is missing', async () => {
      req.params = {};
      
      await validateGetSalaryById(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when unique_id in params is not a string', async () => {
      req.params = {
        unique_id: 12345
      };
      
      await validateGetSalaryById(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });
  });

  describe('validateCreateSalary', () => {
    it('should pass validation with only required fields', async () => {
      req.body = {
        unique_id: 'B64QHVG3AT'
      };
      
      await validateCreateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should pass validation with all valid fields', async () => {
      req.body = {
        unique_id: 'B64QHVG3AT',
        submission_timestamp: {
          value: '2025-02-18T08:40:08.646Z'
        },
        salary_net: 2013,
        salary_gross: 840,
        salary_net_old: 1936,
        salary_gross_old: 2257,
        salary_net_for_avg: 2013,
        salary_gross_for_avg: 840,
        salary_net_old_for_avg: 1936,
        salary_gross_old_for_avg: 2257,
        salary_increase_index_net: '104',
        salary_increase_index_gross: null,
        inflation_index: '102',
        real_salary_increase_index_net: '2',
        real_salary_increase_index_gross: null
      };
      
      await validateCreateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should fail validation when unique_id is missing', async () => {
      req.body = {
        salary_net: 2013,
        salary_gross: 840
      };
      
      await validateCreateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when submission_timestamp is invalid', async () => {
      req.body = {
        unique_id: 'B64QHVG3AT',
        submission_timestamp: {
          value: 'not-a-date'
        }
      };
      
      await validateCreateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when salary_net is negative', async () => {
      req.body = {
        unique_id: 'B64QHVG3AT',
        salary_net: -100
      };
      
      await validateCreateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });
    it('should fail validation when salary_increase_index_net is not a numeric string', async () => {
      req.body = {
        unique_id: 'B64QHVG3AT',
        salary_increase_index_net: 'not-a-number'
      };
      
      await validateCreateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });
  });

  describe('validateUpdateSalary', () => {
    it('should pass validation with valid unique_id in params', async () => {
      req.params = {
        unique_id: 'B64QHVG3AT'
      };
      
      await validateUpdateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should pass validation with valid params and body fields', async () => {
      req.params = {
        unique_id: 'B64QHVG3AT'
      };
      req.body = {
        salary_net: 2500,
        salary_gross: 3500,
        salary_increase_index_net: '110'
      };
      
      await validateUpdateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should fail validation when unique_id in params is missing', async () => {
      req.params = {};
      
      await validateUpdateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when salary_gross is negative', async () => {
      req.params = {
        unique_id: 'B64QHVG3AT'
      };
      req.body = {
        salary_gross: -500
      };
      
      await validateUpdateSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });
  });

  describe('validateListSalaries', () => {
    it('should pass validation with empty query parameters', async () => {
      req.query = {};
      
      await validateListSalaries(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should pass validation with valid filter parameters', async () => {
      req.query = {
        unique_id: 'B64QHVG3AT',
        min_net: 1000,
        max_net: 5000,
        min_gross: 1500,
        max_gross: 7000,
        from_date: '2025-01-01T00:00:00Z',
        to_date: '2025-12-31T23:59:59Z',
        min_increase_net: 5,
        max_increase_net: 20,
        page: 1,
        limit: 50,
        sort_by: 'salary_net',
        sort_order: 'desc'
      };
      
      await validateListSalaries(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should fail validation when min_net is not a number', async () => {
      req.query = {
        min_net: 'not-a-number'
      };
      
      await validateListSalaries(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when max_net is negative', async () => {
      req.query = {
        max_net: -100
      };
      
      await validateListSalaries(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when from_date is invalid', async () => {
      req.query = {
        from_date: 'not-a-date'
      };
      
      await validateListSalaries(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when sort_order is invalid', async () => {
      req.query = {
        sort_order: 'invalid-order'
      };
      
      await validateListSalaries(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });
  });

  describe('validateDeleteSalary', () => {
    it('should pass validation with valid unique_id in params', async () => {
      req.params = {
        unique_id: 'B64QHVG3AT'
      };
      
      await validateDeleteSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.calledWithExactly()).toBe(true);
    });

    it('should fail validation when unique_id in params is missing', async () => {
      req.params = {};
      
      await validateDeleteSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });

    it('should fail validation when unique_id in params is empty', async () => {
      req.params = {
        unique_id: ''
      };
      
      await validateDeleteSalary(req, res, next);
      await delay(10);
      
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(ValidationError);
    });
  });
});
