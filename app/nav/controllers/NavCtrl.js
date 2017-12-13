angular
.module("TheGiveawayBoxApp")
.controller("NavCtrl",
function ($scope, $location, AuthFactory, $rootScope, ListingsFactory) {
    /*
    Just a pass-through method to the AuthFactory method of the
    same name.
    */
    $scope.isAuthenticated = () => {
        //console.log("checking authentication")
        AuthFactory.isAuthenticated();
    }

    $scope.toUserProfile = () => {
        const user = AuthFactory.getUser().uid;
        $location.url(`/users/${user}`)
        //console.log(`users/${$scope.navUser}`)
    }

    $scope.finder = event => {
        if (event.key === "Enter") {
            const employee = ListingsFactory.find($scope.searchString)
        }
    }

    /*
    Unauthenticate the client.
    */
    $scope.navLogout = () => {
        console.log("logging out")
        AuthFactory.logout();
    }

    $scope.email = ""

    $rootScope.$on("authenticationSuccess", function () {
        $scope.logOut = "Logout"
        $scope.email = AuthFactory.getUser().email
        $scope.isAuthenticated = true
        $scope.uid = AuthFactory.getUser().uid
   })

}
)