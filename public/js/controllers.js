var slippyImagesControllers = angular.module('slippyImagesControllers', []);

slippyImagesControllers.controller('MainCtrl', function ($scope) {

})
.directive('navigationMenu', function () {
  console.log('here');
  return {
    template: 'Name: {{customer.name}} Address: {{customer.address}}'
  };
});