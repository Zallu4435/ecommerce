import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const ComparisonTable = ({ compareItem }) => {
  return (
    <div className="mt-16 overflow-x-auto hidden lg:block md:block">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Comparison Table
      </h2>
      <table className="table-auto w-full border-collapse border dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm sm:text-base">
        <thead className="bg-gray-200 dark:bg-gray-600">
          <tr>
            <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-100">
              Feature
            </th>
            {compareItem.map((product) => (
              <th
                key={product.productId}
                className="py-3 px-4 text-center text-gray-800 dark:text-gray-100"
              >
                {product.productName.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["Price", "Rating", "Description", "Reviews"].map((feature) => (
            <tr key={feature}>
              <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                {feature}
              </td>
              {compareItem.map((product) => (
                <td
                  key={product.productId}
                  className="py-3 px-4 text-center font-bold text-gray-600 dark:text-gray-200"
                >
                  {feature === "Price" ? (
                    `₹ ${product.originalPrice.toFixed(2)}`
                  ) : feature === "Rating" ? (
                    <div className="flex items-center justify-center">
                      {[...Array(5)].map((_, index) => {
                        const rating = product?.averageRating || 0;
                        if (index < Math.floor(rating)) {
                          return (
                            <FaStar
                              key={index}
                              className="text-yellow-500 text-sm"
                            />
                          );
                        } else if (
                          index < Math.ceil(rating) &&
                          rating % 1 !== 0
                        ) {
                          return (
                            <FaStarHalfAlt
                              key={index}
                              className="text-yellow-500 text-sm"
                            />
                          );
                        } else {
                          return (
                            <FaRegStar
                              key={index}
                              className="text-gray-300 text-sm"
                            />
                          );
                        }
                      })}
                    </div>
                  ) : feature === "Reviews" ? (
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500">
                        ({product?.reviewCount || 0} reviews)
                      </span>
                    </div>
                  ) : (
                    product.description
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
