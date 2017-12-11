angular.module("TheGiveawayBoxApp")
.controller("UserListingsCtrl", function($scope, $routeParams, $timeout, $location, ListingsFactory, UserFactory, AuthFactory, InviteFactory, GroupsFactory) {
    
    $scope.listingsInit = () => {
        const user = AuthFactory.getUser()
        ListingsFactory.getCurrentUserListings(user).then(r=> {
            $scope.user.listings = r
        })
    }
    
   
})
 
