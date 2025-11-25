
// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
exports.isValidPassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};
