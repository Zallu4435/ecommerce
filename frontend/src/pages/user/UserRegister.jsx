import React from 'react';
import { Input, InputContainer, Label } from '../../components/StyledComponents';

const UserRegister = () => {
  return (
    <div className="dark:bg-black h-screen flex items-center justify-center">
      <div className="w-[1000px] dark:bg-gray-900 bg-orange-50 p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700 text-center">
          User Register
        </h1>
        <form>
          {/* Row 1 */}
          <div className="flex gap-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Username</Label>
              <Input type="text" placeholder="Enter username" />
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Nickname</Label>
              <Input type="text" placeholder="Enter email" />
            </InputContainer>
          </div>

          {/* Row 2 */}
          <div className="flex gap-4 mt-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Email</Label>
              <Input type="text" placeholder="Enter avatar URL" />
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Avatar</Label>
              <Input type="password" placeholder="Enter password" />
            </InputContainer>
          </div>


          <div className="flex gap-4 mt-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Phone</Label>
              <Input type="password" placeholder="Enter password" />
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Gender</Label>
              <Input type="text" placeholder="Enter avatar URL" />
            </InputContainer>
          </div>

          {/* Row 3 */}
          <div className="flex gap-4 mt-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Password</Label>
              <Input type="text" placeholder="Enter avatar URL" />
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Confirm Password</Label>
              <Input type="password" placeholder="Enter password" />
            </InputContainer>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 font-bold dark:bg-blue-600 bg-orange-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
