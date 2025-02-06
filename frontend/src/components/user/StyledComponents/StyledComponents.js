import styled from 'styled-components';

export const Button = styled.button`
  background: transparent; /* Transparent background */
  color: ${(props) => props.textColor || 'black'}; /* Dynamic text color */
  border: 2px solid ${(props) => props.borderColor || 'gray'}; /* Dynamic border color */
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background: ${(props) => props.hoverColor || 'lightgray'}; /* Default hover background */
`;



// Styled Components
export const Input = styled.input`
  width: 100%;
  padding: 15px 15px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

export const TextArea = styled.textarea`
width: 96%;
padding: 15px 15px;
font-size: 18px;
border: 1px solid #ccc;
border-radius: 5px;
outline: none;
transition: all 0.3s ease;

&:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  `;
  
  
  export const CheckboxContainer = styled.div`
  display: grid; /* Uses grid layout */
  grid-template-columns: repeat(3, 1fr); /* Creates three equal columns */
  gap: 10px; /* Adds space between the grid items */
  margin-top: 10px;
  margin-left: -30px
`;

export const SizeOption = styled.div`
  display: flex; /* Flex layout for label and checkbox */
  align-items: center; /* Vertically center the items */
  justify-content: space-between; /* Spaces out the label and checkbox */
  border: 1px solid #ddd; /* Border around the size options */
  padding: 15px; /* Padding inside each size option */
  border-radius: 8px; /* Rounded corners */
  transition: box-shadow 0.3s ease; /* Smooth hover transition for shadow */

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Adds a shadow on hover */
  }

  /* Checkbox style */
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #4CAF50; /* Makes the checkbox color green */
  }
`;

export const Label = styled.label`
  font-size: 18px;
  color: black;
  margin-bottom: 5px;
  display: block;
  font-weight: 700;

  @media (prefers-color-scheme: dark) {
    color: white; /* Change to white in dark mode */
  }
`;

export const InputContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;