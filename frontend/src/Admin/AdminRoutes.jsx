import React, { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Loading from './Components/Loading';

const AdminRoutes = () => {
  const Dashboard = lazy(() => import('./Pages/Dashboard'));
  const Media = lazy(() => import('./Pages/Media/Media'));
  const MediaSettings = lazy(() => import('./Pages/Media/MediaSettings'));
  const Posts = lazy(() => import('./Pages/Posts/Posts'));
  const PostsCategories = lazy(() => import('./Pages/Posts/PostsCategories'));
  const PostsTags = lazy(() => import('./Pages/Posts/PostsTags'));
  const PostsAdd = lazy(() => import('./Pages/Posts/PostsAdd'));
  const PostsEdit = lazy(() => import('./Pages/Posts/PostsEdit'));
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" index element={<Dashboard key="admin-dashboard" />} />
        <Route path="posts/*" element={<Outlet />}>
          <Route index element={<Posts key="admin-posts-dashboard" />} />
          <Route path="categories" element={<PostsCategories key="admin-post-categories" />} />
          <Route path="tags" element={<PostsTags key="admin-post-tags" />} />
          <Route path="new" element={<PostsAdd key="admin-post-new" />} />
          <Route path="edit/:id" element={<PostsEdit key="admin-post-edit" />} />
        </Route>
        <Route path="media/*" element={<Outlet />}>
          <Route index element={<Media key="admin-media-dashboard" />} />
          <Route path="settings" element={<MediaSettings key="admin-media-settings" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
