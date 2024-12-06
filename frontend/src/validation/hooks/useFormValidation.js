import { useState } from 'react';
import { z } from 'zod';

const useFormValidation = (schema) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate function
  const validate = (data) => {
    try {
      schema.parse(data);  // If validation passes, no errors
      setErrors({});  // Reset any previous errors
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        // Extract the error messages and update the state
        const validationErrors = e.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(validationErrors);  // Set the error state
      }
      return false;
    }
  };

  // Submit handler
  const handleSubmit = (onsubmit) => {
    return (data) => {

      setIsSubmitting(true);  // Start submitting
      const isValid = validate(data);
      
      // Only submit if the form is valid (no errors)
      if (isValid) {
        onsubmit(data);  // If form is valid, execute onsubmit
      }
      
      setIsSubmitting(false);  // End submitting
    };
  };

  return { errors, handleSubmit, isSubmitting };
};

export default useFormValidation;
