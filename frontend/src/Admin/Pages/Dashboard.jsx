import React from 'react';
import VerifyLogin from '../../VerifyLogin';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import DashboardPageContent from '../Components/DashboardPageContent.jsx';

const Dashboard = () => {
  console.log('hello?');
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <DashboardPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default Dashboard;
