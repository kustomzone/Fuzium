import React from 'react';
import { Link } from 'react-router';

const MainLayout = React.createClass({
  render: function() {
    return (
      <div className="app">
        <nav className="navbar navbar-light bg-faded" id="CollapsingNavbar">
          <button className="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#CollapsingNavbar">
            &#9776;
          </button>
          <div className="collapse navbar-toggleable-xs">
            <Link to="1JfWHNDQeR71Uf8EtyRqCNJ1Ked5t1pukk/" className="navbar-brand" >Zereact</Link>
            <ul className="nav navbar-nav">
              <li className="nav-item active">
                <Link to="1JfWHNDQeR71Uf8EtyRqCNJ1Ked5t1pukk/" className="nav-link" >Home <span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item">
                <Link to="tutorial" className="nav-link">Tutorial</Link>
              </li>
              <li className="nav-item">
                <Link to="about-me" className="nav-link">About me</Link>
              </li>
              <li className="nav-item">
                <Link to="messages" className="nav-link">Leave a message</Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="container">
          {this.props.children}
        </main>
      </div>
    );
  }
});

export default MainLayout;
