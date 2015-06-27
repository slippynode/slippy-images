var LoginForm = React.createClass({displayName: "LoginForm",
  render: function () {
    return (
      React.createElement("div", {className: "login"}, 
        React.createElement("form", {action: "/users/login/", method: "post", 
          className: "pure-form pure-form-stacked"}, 
          React.createElement("fieldset", null, 
            React.createElement("legend", null, "Login To Account"), 
            React.createElement("label", {htmlFor: "username"}, "Username"), 
            React.createElement("input", {id: "username", name: "username", type: "text", 
              placeholder: "Username"}), 
            React.createElement("label", {htmlFor: "password"}, "Password"), 
            React.createElement("input", {id: "password", name: "password", type: "password", 
              placeholder: "Password"}), 
            React.createElement("button", {type: "submit", className: "pure-button pure-button-primary"}, 
              "Login"
            )
          )
        )
      )
    );
  }
});

var Login = React.createClass({displayName: "Login",
  render: function () {
    return (
      React.createElement("div", {className: "content-container pure-g"}, 
        React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
          React.createElement("div", {className: "form-container"}, 
            React.createElement("div", {className: "login-form"}, 
              React.createElement(LoginForm, null)
            )
          )
        )
      )
    );
  }
});