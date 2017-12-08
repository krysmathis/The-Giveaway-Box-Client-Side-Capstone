angular
.module("TheGiveawayBoxApp")
.controller("NavCtrl",
function ($scope, $location, AuthFactory, ListingsFactory) {
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
            const employee = Listing.find($scope.searchString)
        }
    }

    /*
    Unauthenticate the client.
    */
    $scope.navLogout = () => {
        console.log("logging out")
        AuthFactory.logout();
    }

}
)