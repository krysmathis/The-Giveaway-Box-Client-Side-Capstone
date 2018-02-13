angular.module("TheGiveawayBoxApp")
.controller("AuthCtrl", function($scope, $location, AuthFactory) {
    
    $scope.auth = {}

    $scope.logMeIn = function (credentials) {
        AuthFactory.authenticate(credentials).then(function (didLogin) {
            $scope.login = {}
            $scope.register = {}
            $location.url("/")
        })
    }

    $scope.registerUser = function(registerNewUser) {
      AuthFactory.registerWithEmail(registerNewUser).then(function (didRegister) {
       $scope.logMeIn(registerNewUser)
      })
    }

    $scope.logoutUser = function(){
      AuthFactory.logout()
      $location.url('/auth')
  }

})