var React = require('react');

var Layout = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },

  render: function() {
    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>SlippyNode</title>
          <link rel="stylesheet" href="/assets/pure/pure-min.css" />
          <link rel="stylesheet" href="/assets/pure/grids-responsive-min.css" />
          <link rel="stylesheet" href="/css/base.css" />
        </head>
        <body>
          {this.props.children}
        </body>
      </html>
    );
  }
});

module.exports = Layout;