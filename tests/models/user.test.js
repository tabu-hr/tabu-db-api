const { queryUserTable, queryUserByEmail } = require('../../src/models/user');
const { DatabaseError } = require('../../src/errors/customErrors');

describe.skip('User Model Tests', () => {
  describe('queryUserTable', () => {
    it('should return user data when email is valid', async () => {
      const rows = await queryUserTable();

      expect(rows).toBeDefined();
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0]).toHaveProperty('email', 'mileusnic.vatroslav@gmail.com');
    });

    it('should throw DatabaseError when query fails', async () => {
      await expect(queryUserTable('invalid-email')).rejects.toThrow(DatabaseError);
    });
  });

  describe('queryUserByEmail', () => {
    it('should return user data when email is valid', async () => {
      const email = 'mileusnic.vatroslav@gmail.com';
      const rows = await queryUserByEmail(email);

      expect(rows).toBeDefined();
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0]).toHaveProperty('email', email);
    });

    it('should throw DatabaseError when query fails', async () => {
      const email = 'invalid-email';
      await expect(queryUserByEmail(email)).rejects.toThrow(DatabaseError);
    });
  });
});
