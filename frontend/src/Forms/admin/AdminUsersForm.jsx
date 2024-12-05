import { InputContainer, Label, Input } from '../../components/StyledComponents';

const AdminUsersForm = ({ initialValues }) => {
  return (
    <div className="flex h-screen items-center justify-center dark:bg-gray-800">
      <div className="w-[700px] dark:bg-gray-900 bg-orange-50 p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700 text-center">
          User Update Form
        </h1>

        <form>
          <InputContainer>
            <Label>Username</Label>
            <Input
              type="text"
              placeholder="Enter the Username"
              defaultValue={initialValues?.name}
            />
          </InputContainer>

          <InputContainer>
            <Label>Nickname</Label>
            <Input
              type="text"
              placeholder="Enter the Nickname"
              defaultValue={initialValues?.nickname}
            />
          </InputContainer>

          <InputContainer>
            <Label>Gender</Label>
            <Input
              type="text"
              placeholder="Enter the Gender"
              defaultValue={initialValues?.gender}
            />
          </InputContainer>

          <InputContainer>
            <Label>Avatar</Label>
            <Input
              type="text"
              placeholder="Enter Avatar URL"
              defaultValue={initialValues?.avatar}
            />
          </InputContainer>

          <InputContainer>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="Enter the Email Address"
              defaultValue={initialValues?.email}
            />
          </InputContainer>

          <InputContainer>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter the Password"
              defaultValue={initialValues?.password}
            />
          </InputContainer>

          <button
            type="submit"
            className="w-full py-3 font-bold dark:bg-blue-600 bg-orange-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersForm;
