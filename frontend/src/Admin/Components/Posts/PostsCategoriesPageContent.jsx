import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Categories/TitleBar';
import AddCategoryPanel from './Categories/AddCategoryPanel';
import EditCategoryPanel from './Categories/EditCategoryPanel';
import { APIGetCategories } from '../../../API/APIPosts';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import ListView from './Categories/ListView';

const PostsCategoriesPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [categories, setCategories] = useState([]);
  const [addCategorySliderOpen, setAddCategorySliderOpen] = useState(false);
  const [editCategorySliderOpen, setEditCategorySliderOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const HandleClose = () => {};

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((post) => post.id));
    }
  };

  const fetchData = async () => {
    const categoriesData = await APIGetCategories(loginPassword, 'category');
    if (categoriesData.status == 200) {
      setCategories(categoriesData.data.getCategories.categories);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <TitleBar setAddCategorySliderOpen={setAddCategorySliderOpen} />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full mt-8">
        <ListView
          categories={categories}
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          toggleAllCheckboxes={toggleAllCheckboxes}
          setCategoryToEdit={setCategoryToEdit}
          setEditCategorySliderOpen={setEditCategorySliderOpen}
        />
        {/* <Pagination totalPosts={totalPosts} page={page} perPage={perPage} setPage={setPage} /> */}
      </div>
      <AddCategoryPanel
        addCategorySliderOpen={addCategorySliderOpen}
        setAddCategorySliderOpen={setAddCategorySliderOpen}
        HandleClose={HandleClose}
      />
      <EditCategoryPanel
        editCategorySliderOpen={editCategorySliderOpen}
        setEditCategorySliderOpen={setEditCategorySliderOpen}
        HandleClose={HandleClose}
        categoryToEdit={categoryToEdit}
        setCategoryToEdit={setCategoryToEdit}
      />
    </div>
  );
};

export default PostsCategoriesPageContent;
