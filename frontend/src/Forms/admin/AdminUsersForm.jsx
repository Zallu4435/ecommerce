import { InputContainer, Label, Input } from '../../components/user/StyledComponents/StyledComponents';

const AdminUsersForm = ({ initialValues }) => {
  return (
    <div className="flex h-screen items-center justify-center dark:bg-gray-800">
      <div className="w-[700px] dark:bg-gray-900 bg-orange-50 p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700 text-center">
          User Update Form
        </h1>

        <form>
          {/* Full Name */}
          <InputContainer>
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="Enter the Full Name"
              defaultValue={initialValues?.fullName}  // This uses the initial value
            />
          </InputContainer>

          {/* Email */}
          <InputContainer>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="Enter the Email Address"
              defaultValue={initialValues?.email}  // This uses the initial value
            />
          </InputContainer>

          {/* Phone Number */}
          <InputContainer>
            <Label>Phone Number</Label>
            <Input
              type="text"
              placeholder="Enter the Phone Number"
              defaultValue={initialValues?.phone}  // This uses the initial value
            />
          </InputContainer>

          {/* Role */}
          <InputContainer>
            <Label>Role</Label>
            <select
              defaultValue={initialValues?.role}  // This uses the initial value for the role
              className="w-full p-3 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
            >
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
          </InputContainer>

          {/* Account Active */}
          <InputContainer>
            <Label>Account Active</Label>
            <input
              type="checkbox"
              checked={initialValues?.isActive}  // This uses the initial value to determine if the checkbox is checked
              className="h-5 w-5 text-blue-500"
            />
          </InputContainer>

          {/* Lock Account */}
          <InputContainer>
            <Label>Lock Account</Label>
            <input
              type="checkbox"
              checked={initialValues?.isLocked}  // This uses the initial value to determine if the checkbox is checked
              className="h-5 w-5 text-red-500"
            />
          </InputContainer>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 font-bold dark:bg-blue-600 bg-orange-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};


export default AdminUsersForm;
