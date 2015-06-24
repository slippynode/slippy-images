var SlippyImagesApp = angular.module('slippyimages', [
  'ngRoute',
  'slippyImagesControllers'
]);

SlippyImagesApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
    ;
  }])
;