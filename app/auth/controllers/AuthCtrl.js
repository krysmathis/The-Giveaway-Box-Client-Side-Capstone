angular.module("TheGiveawayBoxApp")
.controller("AuthCtrl", function($scope, $location, AuthFactory) {
    $scope.auth = {}

    $scope.logMeIn = function (credentials) {
        AuthFactory.authenticate(credentials).then(function (didLogin) {
            $scope.login = {}
            $scope.register = {}
            $location.url("/")
            updateNavBar(AuthFactory.getUser())

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
      updateNavBar({user:{email: "Join Us!"}})
  }


  const updateNavBar = (user) => {
    const navBar = document.querySelector(".nav__list")
    if (navBar.hasChildNodes()){
        // clear out the existing element
        const nodes = Array.from(navBar.childNodes)
        nodes.forEach(el => {
            if (el.className === "nav__user-email"){   
                navBar.removeChild(el)
            }
        })
        // add the new one
        const li = document.createElement("li")
        li.className = "nav__user-email"
        li.innerHTML = user.email
            navBar.appendChild(li)
        }
    }
})