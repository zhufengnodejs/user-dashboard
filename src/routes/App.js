import React from 'react';
import { connect } from 'dva';
import styles from './App.css';
import Header from '../components/Header';

function App(props) {
  return (
    <div className={styles.normal}>
      <Header/>
      <div className={styles.content}>
        <div className={styles.main}>
            {props.children}
        </div>
      </div>
    </div>
  );
}

export default connect()(App);
