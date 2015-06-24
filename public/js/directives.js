var slippyImagesDirectives = angular.module('slippyImagesDirectives', []);

slippyImagesDirectives.directive('navigationMenu', function () {
  return {
    template: 'Name: {{customer.name}} Address: {{customer.address}}'
  };
});