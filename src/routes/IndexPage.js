import React from 'react';
import { connect } from 'dva';
import Header from '../components/Header';

function IndexPage() {
  return (
    <div>
      <Header/>  
      <h1>Yay! Welcome to dva!</h1>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
