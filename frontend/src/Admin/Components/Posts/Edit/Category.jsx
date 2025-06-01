import React from 'react';

const Category = ({ categories, categoriesSelectedIds, toggleCategoryCheckbox }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full mt-8 p-4">
      <h3 className="font-bold text-lg">Categories</h3>
      <hr className="my-4" />
      <div className="flex flex-col gap-2 items-start mt-4 rounded  border border-gray-300">
        <ul className="py-4">
          {categories.map((category, idx) => (
            <li key={idx} className="ml-2 flex flex-row items-center gap-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value={category.term_id}
                checked={categoriesSelectedIds.includes(category.term_id)}
                onChange={() => toggleCategoryCheckbox(category.term_id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
              <p>{category.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row justify-start">
        <button
          type="button"
          className="flex items-center justify-center  py-2 text-sm font-medium text-blue-700 hover:text-blue-800 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add Category
        </button>
      </div>
    </div>
  );
};

export default Category;
