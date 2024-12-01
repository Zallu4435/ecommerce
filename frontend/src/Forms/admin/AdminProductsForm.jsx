import { Input, InputContainer, TextArea, Label, CheckboxContainer, SizeOption } from '../../components/StyledComponents';

// Form Component
const AddProductForm = () => {
  return (
    <div className="dark:bg-black h-screen flex items-center justify-center">

      <div className="w-[1300px] dark:bg-gray-900 bg-orange-50 p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">Add Product</h1>

        <form>
          {/* Name, Image, and Category (Three inputs in one row) */}
          <div className="flex gap-6 mb-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Product Name</Label>
              <Input
                type="text"
                placeholder="Enter product name"
              />
            </InputContainer>

            <InputContainer className="flex-1">
              <Label className="dark:text-white">Image URL</Label>
              <Input
                type="text"
                placeholder="Enter image URL"
              />
            </InputContainer>

            <InputContainer className="flex-1">
              <Label className="dark:text-white">Category</Label>
              <select
                name="category"
                className="w-full p-3 border rounded-md"
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home Appliances">Home Appliances</option>
              </select>
            </InputContainer>
          </div>

          {/* Description and Available Sizes */}
          <div className="flex gap-6 mb-4">
            {/* Description (takes 70% of the width) */}
            <InputContainer className="flex-[7]">
              <Label className="dark:text-white">Description</Label>
              <TextArea
                name="description"
                placeholder="Enter product description"
                rows="4"
              />
            </InputContainer>

            {/* Available Sizes (takes 30% of the width) */}
            <div className="flex-[3]">
              <Label className='ml-[-30px] dark:text-white'>Available Sizes</Label>
              <CheckboxContainer>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <SizeOption key={size}>
                    <Label className="dark:text-white">{size}</Label>
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                    />
                  </SizeOption>
                ))}
              </CheckboxContainer>
            </div>
          </div>

          {/* Price, Stock, and Tags (Three inputs in one row) */}
          <div className="flex gap-6 mb-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Brand Name</Label>
              <Input
                type="number"
                placeholder="Enter Brand Name"
              />
            </InputContainer>

            <InputContainer className="flex-1">
              <Label className="dark:text-white">Original Price</Label>
              <Input
                type="number"
                placeholder="Enter original Price"
              />
            </InputContainer>

            <InputContainer className="flex-1">
              <Label className="dark:text-white">Offer Pricw</Label>
              <Input
                type="text"
                placeholder="Enter Offer Price"
              />
            </InputContainer>
          </div>

          <div className="flex gap-6 mb-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-white">Stock Quantity</Label>
              <Input
                type="number"
                placeholder="Enter Stock Quantity"
              />
            </InputContainer>

            <InputContainer className="flex-1">
              <Label className="dark:text-white">Warrenty Time</Label>
              <Input
                type="number"
                placeholder="Enter Warrenty Time"
              />
            </InputContainer>

            <InputContainer className="flex-1">
              <Label className="dark:text-white">Return Policy</Label>
              <Input
                type="text"
                placeholder="Enter Return Policy"
              />
            </InputContainer>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="w-full dark:bg-blue-600 bg-orange-500 text-white px-6 py-3 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
