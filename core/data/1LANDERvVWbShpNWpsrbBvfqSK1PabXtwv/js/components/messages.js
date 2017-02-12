import React from 'react';

// import ZeroFrame module
import ZeroFrame from '../zeroframe/zeroframe';


const Messages = React.createClass({
  getInitialState: function() {
    return {
      auth: false,
      messages: []
    }
  },

  componentDidMount: function() {
    var _this = this;
    ZeroFrame.cmd("siteInfo", {}, function(info) {
      console.log(info);
    });
  },

  render: function() {
    var form;
    if (this.state.auth) {
      form =  <form>
                <fieldset className="form-group">
                  <label htmlFor="message">Your message</label>
                  <textarea type="text" className="form-control" id="message">
                  </textarea>
                </fieldset>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
    } else {
      form = <p>Too bad you need to be auth to post a message.</p>
    }
    return (
      <article>
        <h1>Leave me a message</h1>
        <p>
          Tell me what you think of it !
        </p>
        { form }
      </article>
    );
  }
});

export default Messages;
