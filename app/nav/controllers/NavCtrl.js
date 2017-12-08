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

    $scope.finder = event => {
        if (event.key === "Enter") {
            const employee = Listing.find($scope.searchString)
            $location.url(`/employees/detail/${employee.id}`)
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