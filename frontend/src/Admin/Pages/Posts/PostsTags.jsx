import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsTagsPageContent from '../../Components/Posts/PostsTagsPageContent.jsx';

const PostTags = () => {
  document.title = 'Posts - Tags';
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PostsTagsPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default PostTags;
