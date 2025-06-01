import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsPageContent from '../../Components/Posts/PostsPageContent.jsx';

const Dashboard = () => {
  document.title = 'Posts';
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PostsPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default Dashboard;
