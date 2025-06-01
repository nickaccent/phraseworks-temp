import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsAddPageContent from '../../Components/Posts/PostsAddPageContent.jsx';

const PostsAdd = () => {
  document.title = 'Posts - Tags';
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PostsAddPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default PostsAdd;
