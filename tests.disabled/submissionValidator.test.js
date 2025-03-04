const request = require('supertest');
const app = require('../src/index');
const { ValidationError } = require('../../src/errors/customErrors');
const { validateCheckSubmission, validateFilterSubmissions } = require('../../../src/validators/submissionValidator');

describe.skip('Submission Validators', () => {
  describe('validateCheckSubmission', () => {
    it('should fail validation with missing unique_id', async () => {
      const req = { body: {} };
      const res = {};
      const next = jest.fn();

      await validateCheckSubmission(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should fail validation with invalid unique_id format', async () => {
      const req = { body: { unique_id: 'invalid-id' } };
      const res = {};
      const next = jest.fn();

      await validateCheckSubmission(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });
  });

  describe('validateFilterSubmissions', () => {
    it('should fail validation with invalid date format', async () => {
      const req = { body: { date: 'invalid-date' } };
      const res = {};
      const next = jest.fn();

      await validateFilterSubmissions(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should fail validation with invalid company_id format', async () => {
      const req = { body: { company_id: 'invalid-id' } };
      const res = {};
      const next = jest.fn();

      await validateFilterSubmissions(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should fail validation with invalid position_id format', async () => {
      const req = { body: { position_id: 'invalid-id' } };
      const res = {};
      const next = jest.fn();

      await validateFilterSubmissions(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should pass validation with a combination of filter parameters', async () => {
      const req = { body: { date: '2023-10-01', company_id: '123', position_id: '456' } };
      const res = {};
      const next = jest.fn();

      await validateFilterSubmissions(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeUndefined();
    });
  });
});

function delay() {
  return new Promise(resolve => setTimeout(resolve, 0));
}
