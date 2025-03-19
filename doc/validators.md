# Validators

The validators are used to validate the input data for the API endpoints. They are located in the `src/validators` folder.

## additionalPositionValidator.js

The `additionalPositionValidator.js` file contains a function `isAlphanumeric` that checks if a value is alphanumeric.

## index.js

The `index.js` file implements a `validate` function that takes validations as input and validates the input data.

## salaryValidator.js

The `salaryValidator.js` file implements a `validationErrorHandler` function that handles validation errors.

## validationUtils.js

The `validationUtils.js` file contains utility functions for handling validation errors, including:
- `handleValidationErrors`: A function that handles validation errors.
- `requiredField`: A function that generates a required field message.
- `invalidField`: A function that generates an invalid field message.
- `lengthMessage`: A function that generates a length message.
- `valueRangeMessage`: A function that generates a value range message.
- `emailValidation`: A function that validates email addresses.
- `dateValidation`: A function that validates date strings.
- `numericValidation`: A function that validates numeric values.
- `stringLengthValidation`: A function that validates string lengths.
- `sanitize`: A function that sanitizes input data.
