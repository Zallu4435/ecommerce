import { InputContainer, Label, Input } from '../../components/user/StyledComponents/StyledComponents';

const AdminCoupensForm = ({ mode, initialValues }) => {
  const isUpdateMode = mode === 'update';

  return (
    <div className="w-[700px] my-12 mx-auto dark:bg-gray-900 bg-orange-50 p-8 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">
        {isUpdateMode ? 'Update Coupon' : 'Create Coupon'}
      </h1>

      <form>
        <InputContainer>
          <Label>{isUpdateMode ? 'Edit Coupon Code' : 'Coupon Code'}</Label>
          <Input
            type="text"
            placeholder={isUpdateMode ? 'Enter new coupon code' : 'Coupon Code'}
            defaultValue={initialValues?.couponCode || ''}
          />
        </InputContainer>

        <InputContainer>
          <Label>{isUpdateMode ? 'Edit Discount Value' : 'Discount Value'}</Label>
          <Input
            type="text"
            placeholder={isUpdateMode ? 'Enter new discount value' : 'Discount Value'}
            defaultValue={initialValues?.discountValue || ''}
          />
        </InputContainer>

        <InputContainer>
          <Label>{isUpdateMode ? 'Edit Valid From Date' : 'Valid From'}</Label>
          <Input
            type="text"
            placeholder={isUpdateMode ? 'dd-mm-yyyy' : 'dd-mm-yyyy'}
            defaultValue={initialValues?.validFrom || ''}
          />
        </InputContainer>

        <InputContainer>
          <Label>{isUpdateMode ? 'Edit Valid Until Date' : 'Valid Until'}</Label>
          <Input
            type="text"
            placeholder={isUpdateMode ? 'dd-mm-yyyy' : 'dd-mm-yyyy'}
            defaultValue={initialValues?.validUntil || ''}
          />
        </InputContainer>

        <InputContainer>
          <Label>{isUpdateMode ? 'Edit Usage Limit' : 'Usage Limit'}</Label>
          <Input
            type="text"
            placeholder={isUpdateMode ? 'Enter new usage limit' : 'Usage Limit'}
            defaultValue={initialValues?.usageLimit || ''}
          />
        </InputContainer>

        <button
          type="submit"
          className="w-full py-3 font-bold dark:bg-blue-600 bg-orange-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isUpdateMode ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default AdminCoupensForm;
