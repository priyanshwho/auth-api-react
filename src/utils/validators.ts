/**
 * Validates whether the given string is a valid email address format.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates a username based on typical premium SaaS system requirements:
 * - Must be at least 3 characters and at most 20 characters.
 * - Can only contain letters, numbers, and underscores.
 * - Cannot start or end with an underscore.
 */
export const validateUsername = (username: string): boolean => {
  if (username.length < 3 || username.length > 20) return false;
  const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9_]{0,18}[a-zA-Z0-9])?$/;
  return usernameRegex.test(username);
};

/**
 * Validates a password's strength:
 * - Minimum 6 characters.
 * - Can expand to check for digits, letters, special characters if desired, but 6 characters is the API minimum.
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
