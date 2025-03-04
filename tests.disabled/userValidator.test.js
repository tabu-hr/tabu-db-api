const request = require('supertest');
const app = require('../src/index');
const { ValidationError } = require('../src/errors/customErrors');
const { validateUserCheck, validateUserGet } = require('../src/validators/userValidator');

describe.skip('User Validators', () => {
  describe('validateUserCheck', () => {
    it('should pass validation with valid email, isGoogleLogin, and name', async () => {
      const req = { body: { email: 'test@example.com', isGoogleLogin: true, name: 'Test User' } };
      const res = {};
      const next = jest.fn();

      await validateUserCheck(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeUndefined();
    });

    it('should fail validation when email is invalid', async () => {
      const req = { body: { email: 'invalid-email', isGoogleLogin: true, name: 'Test User' } };
      const res = {};
      const next = jest.fn();

      await validateUserCheck(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should fail validation when isGoogleLogin is missing', async () => {
      const req = { body: { email: 'test@example.com', name: 'Test User' } };
      const res = {};
      const next = jest.fn();

      await validateUserCheck(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should fail validation when isGoogleLogin is not a boolean', async () => {
      const req = { body: { email: 'test@example.com', isGoogleLogin: 'true', name: 'Test User' } };
      const res = {};
      const next = jest.fn();

      await validateUserCheck(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });
  });

  describe('validateUserGet', () => {
    it('should pass validation with valid unique_id', async () => {
      const req = { body: { unique_id: '1234567890' } };
      const res = {};
      const next = jest.fn();

      await validateUserGet(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeUndefined();
    });

    it('should fail validation when unique_id is missing', async () => {
      const req = { body: {} };
      const res = {};
      const next = jest.fn();

      await validateUserGet(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should fail validation when unique_id is invalid', async () => {
      const req = { body: { unique_id: 'invalid-id' } };
      const res = {};
      const next = jest.fn();

      await validateUserGet(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });

    it('should fail validation when unique_id is too long', async () => {
      const req = { body: { unique_id: '12345678901234567890' } };
      const res = {};
      const next = jest.fn();

      await validateUserGet(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      await delay();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
      expect(next.mock.calls[0][0].message).toBe('Validation failed');
    });
  });
});

function delay() {
  return new Promise(resolve => setTimeout(resolve, 0));
}
