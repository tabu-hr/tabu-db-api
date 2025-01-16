const validateInput = (req, res, next) => {
  const { email } = req.body;
  if (req.path === '/user/check' && !email) {
    return res.status(400).json({
      success: false,
      message: 'Email parameter is required',
    });
  }
  next();
};

module.exports = validateInput;
