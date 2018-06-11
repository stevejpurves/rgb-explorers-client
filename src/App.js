import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UploadSection from './UploadSection';
import VisSection from './VisSection';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>RGB Explorers</h1>
        </header>
        <UploadSection>
        </UploadSection>
        <VisSection>}>

        </VisSection>
        <footer className="App-Footer">Best viewed in Chrome</footer>
      </div>
    );
  }
}

export default App;
