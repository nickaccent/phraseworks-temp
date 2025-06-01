import React, { useContext, useEffect, useState } from 'react';
import { get_post_by } from '../../../Utils/Posts';
import TitleBar from './Edit/TitleBar';
import Title from './Edit/Title';
import Content from './Edit/Content';
import Status from './Edit/Status';
import FeaturedImage from './Edit/FeaturedImage';
import Category from './Edit/Category';
import Tag from './Edit/Tag';
import { useNavigate } from 'react-router-dom';
import { APIGetFileById } from '../../../API/APIMedia';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetCategories, APIUpdatePost } from '../../../API/APIPosts';
import { notify } from '../../../Utils/Notification';

const PostsEditPageContent = ({ id }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [reloadPost, setReloadPost] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [featuredImageId, setFeaturedImageId] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [activeContentTab, setActiveContentTab] = useState('visual');
  const [content, setContent] = useState('');
  const [categoriesSelectedIds, setCategoriesSelectedIds] = useState([]);
  const [tagsSelectedIds, setTagsSelectedIds] = useState([]);

  const toggleCategoryCheckbox = (id) => {
    setCategoriesSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleTagCheckbox = (id) => {
    setTagsSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const updateTitle = (value) => {
    if (typeof value !== 'string') return '';
    setTitle(value);
  };

  const HandleContentEditorChange = (content) => {
    setContent(content);
  };

  const HandleContentChange = (e) => {
    const newValue = e.target.value.trim() === '' ? '' : e.target.value;
    setContent(newValue);
  };

  const fetchImageData = async () => {
    const data = await APIGetFileById(loginPassword, featuredImageId);
    if (data.status == 200) {
      setFeaturedImage(data.data.getMediaFileById);
    }
  };

  const updatePost = async () => {
    const data = await APIUpdatePost(loginPassword, title, content, featuredImageId, post?.id);
    if (data.status == 200) {
      notify('Successfully updated post.', 'success');
      return;
    }

    notify('Failed to update post.', 'error');
  };

  const fetchData = async () => {
    const categoriesData = await APIGetCategories(loginPassword, 'category');
    if (categoriesData.status == 200) {
      setCategories(categoriesData.data.getCategories.categories);
    }
    const tagsData = await APIGetCategories(loginPassword, 'post_tag');
    if (tagsData.status == 200) {
      setTags(tagsData.data.getCategories.categories);
    }
  };

  const fetchPostData = async () => {
    const data = await get_post_by('id', id);
    if (data != null) {
      setPost(data);
      setTitle(data.post_title);
      setContent(data.post_content);
      setFeaturedImageId(data.featured_image_id);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPostData();
  }, []);

  useEffect(() => {
    if (featuredImageId != null) {
      fetchImageData();
    }
  }, [featuredImageId]);

  useEffect(() => {
    if (reloadPost == true) {
      setReloadPost(false);
      fetchPostData();
    }
  }, [reloadPost]);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full md:w-3/4 md:mr-4">
        <TitleBar post={post} />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white w-full mt-8 p-4">
          <Title title={title} updateTitle={updateTitle} />
          <Content
            activeContentTab={activeContentTab}
            setActiveContentTab={setActiveContentTab}
            content={content}
            HandleContentEditorChange={HandleContentEditorChange}
            HandleContentChange={HandleContentChange}
          />
        </div>
      </div>
      <div className="w-full md:w-1/4 md:ml-4">
        <Status updatePost={updatePost} post={post} setReloadPost={setReloadPost} />

        <FeaturedImage featuredImage={featuredImage} setFeaturedImageId={setFeaturedImageId} />

        <Category
          categories={categories}
          categoriesSelectedIds={categoriesSelectedIds}
          toggleCategoryCheckbox={toggleCategoryCheckbox}
        />

        <Tag tags={tags} tagsSelectedIds={tagsSelectedIds} toggleTagCheckbox={toggleTagCheckbox} />
      </div>
    </div>
  );
};

export default PostsEditPageContent;
