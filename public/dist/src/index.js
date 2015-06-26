var NavBarLink = React.createClass({displayName: "NavBarLink",
  render: function () {
    return (
      React.createElement("a", {href: this.props.url, className: "pure-menu-link"}, this.props.text)
    );
  }
});

var NavBarItem = React.createClass({displayName: "NavBarItem",
  generateLink: function () {
    return React.createElement(NavBarLink, {url: this.props.url, text: this.props.text});
  },
  render: function () {
    var content = this.generateLink();
    return (React.createElement("li", {className: "pure-menu-item"}, content));
  }
});

var NavBar = React.createClass({displayName: "NavBar",
  getInitialState: function () {
    return {};
  },
  toggleHorizontal: function () {
    [].forEach.call(
      React.findDOMNode(this.refs.headerNav)
        .querySelectorAll('.custom-can-transform'),
      function (element) {
        element.classList.toggle('pure-menu-horizontal');
      }
    );
  },
  toggleMenu: function () {
    var element = React.findDOMNode(this.refs.headerNav);
    if (element.classList.contains('open')) {
      setTimeout(this.toggleHorizontal, 500);
    }
    else {
      this.toggleHorizontal();
    }
    element.classList.toggle('open');
    React.findDOMNode(this.refs.toggle).classList.toggle('x');
  },
  closeMenu: function () {
    var element = React.findDOMNode(this.refs.headerNav);
    if (element.classList.contains('open')) {
      this.toggleMenu();
    }
  },
  componentDidMount: function() {
    var self = this
      , toggle = React.findDOMNode(this.refs.toggle)
    ;

    toggle.addEventListener('click', function (e) {
      self.toggleMenu();
    });

    window.addEventListener('resize', this.closeMenu);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.closeMenu);
  },
  generateItem: function (item) {
    return React.createElement(NavBarItem, {text: item.text, url: item.url})
  },
  render: function () {
    var items = [
      {"text": "Login", "url": "/login"},
      {"text": "Register", "url": "/register"},
    ].map(this.generateItem);
    return (
      React.createElement("div", {className: "custom-wrapper", ref: "headerNav"}, 
        React.createElement("div", {className: "content-container pure-g"}, 
          React.createElement("div", {className: "pure-u-1 pure-u-md-1-2"}, 
            React.createElement("div", {className: "pure-menu"}, 
              React.createElement("a", {href: "#", className: "pure-menu-heading custom-brand"}, 
                "ImageSlip"
              ), 
              React.createElement("a", {href: "#", className: "custom-toggle", ref: "toggle"}, 
                React.createElement("s", {className: "bar"}), 
                React.createElement("s", {className: "bar"})
              )
            )
          ), 
          React.createElement("div", {className: "pure-u-1 pure-u-md-1-2"}, 
            React.createElement("div", {className: "pure-menu pure-menu-horizontal custom-menu-3" + ' ' +
              "custom-can-transform"}, 
              React.createElement("ul", {className: "pure-menu-list"}, 
                items
              )
            )
          )
        )
      )
    );
  }
});

var App = React.createClass({displayName: "App",
  render () {
    var Child;
    switch (this.props.route) {
      case '':
        Child = Home;
        break;
      case 'home':
        Child = Home;
        break;
      case 'login':
        Child = Login;
        break;
      case 'register':
        Child = Register;
        break;
      default:
        Child = Home;
    }

    return (
      React.createElement("div", null, 
          React.createElement("nav", null, 
            React.createElement(NavBar, null)
          ), 
          React.createElement(Child, null)
      )
    )
  }
});

function render () {
  var route = window.location.hash.substr(1);
  React.render(React.createElement(App, {route: route}), document.body);
}

window.addEventListener('hashchange', render);
render();