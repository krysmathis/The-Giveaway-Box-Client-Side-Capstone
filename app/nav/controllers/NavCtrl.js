angular
.module("TheGiveawayBoxApp")
.controller("NavCtrl",
function ($scope, $location, $window, AuthFactory, $rootScope, ListingsFactory) {
    
    /*
    Just a pass-through method to the AuthFactory method of the
    same name.
    */
    $scope.isAuthenticated = () => {
        AuthFactory.isAuthenticated();
    }

    /**
     * Show the brand inside the nav bar when the view falls
     * below 58
     */
    $scope.showBrand = false 
    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

    var windowEl = angular.element($window);
    var handler = function() {
        $scope.st = window.pageYOffset;
        if ($scope.st > 58) {
            $scope.$apply(() => $scope.showBrand = true)
        } else {
            $scope.$apply(() => $scope.showBrand = false)
        }

    }

    windowEl.on('scroll', handler);

    $scope.toUserProfile = () => {
        const user = AuthFactory.getUser().uid;
        $location.url(`/users/${user}`)
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
        AuthFactory.logout();
        const navEl = angular.element(document.getElementById("nav"))
        navEl.addClass("nav-hidden")
    }

    $scope.email = ""

    $rootScope.$on("authenticationSuccess", function () {
        const navEl = angular.element(document.getElementById("nav"))
        navEl.removeClass("nav-hidden")
        $scope.logOut = "Logout"
        $scope.email = AuthFactory.getUser().email
        $scope.isAuthenticated = true
        $scope.uid = AuthFactory.getUser().uid
        
   })

}
)