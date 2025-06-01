import React, { lazy, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('./Pages/HomePage'));
const Page404 = lazy(() => import('./Pages/Page404'));
const Login = lazy(() => import('./Pages/Login'));
const Post = lazy(() => import('./Pages/Post'));
const Page = lazy(() => import('./Pages/Page'));

const MainRoutes = ({ posts }) => {
  return (
    <Routes>
      {/* Public routes (accessible to all, including unauthenticated users) */}
      <Route exact path="/" element={<HomePage key="homepage" />} />
      {posts.map((post, idx) => {
        if (post.post_type == 'page') {
          return (
            <Route
              key={idx}
              exact
              path={`/${post.post_name}`}
              element={<Page key={post.post_name} />}
            />
          );
        } else {
          return (
            <Route
              key={idx}
              exact
              path={`/${post.post_name}`}
              element={<Post key={post.post_name} />}
            />
          );
        }
      })}

      {/* Login route (accessible when not authenticated) */}
      <Route path="/login" element={<Login key="login" />} />

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default MainRoutes;
