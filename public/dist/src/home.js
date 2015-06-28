var HomeImageItem = React.createClass({displayName: "HomeImageItem",
  render: function () {
    return (
      React.createElement("div", {className: "normalize-image pure-1-1 pure-u-md-1-1"}, 
        React.createElement("img", {className: "pure-img", src: this.props.path})
      )
    );
  }
});

var Home = React.createClass({displayName: "Home",
  loadImagesFromServer: function () {
    $.ajax({
      url: this.props.source,
      type: 'GET',
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.source, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    this.props.source = "/submissions/all/files/all/";
    return {data: []};
  },
  componentDidMount: function () {
    this.loadImagesFromServer();
  },
  generateImageItem: function (image) {
    return React.createElement(HomeImageItem, {path: "/thumbnails/" +
        image.submissionThumbnail.name})
  },
  render: function () {
    var images = this.state.data.map(this.generateImageItem);
    return (
      React.createElement("div", {className: "content-container pure-g"}, 
        "/*", 
        React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
          React.createElement("div", {className: "header"}
          )
        ), 
        "*/", 
        React.createElement("div", {className: "pure-u-1 pure-u-md-2-6"}, 
          images
        )
      )
    );
  }
});