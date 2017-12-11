"use strict"

angular.module("TheGiveawayBoxApp")
.controller("ListingDetailCtrl", function($scope, $http, $timeout, $location, $routeParams, ListingsFactory, AuthFactory, MasterDataFactory) {

    $scope.listing = {}
    ListingsFactory.getSingleListing($routeParams.listingId).then(listing=> {
        $scope.listing = listing
    })

    $scope.deleteListing = (e) => {
        ListingsFactory.deleteListing(e.target.id).then(r=>{
            $timeout(function () {
                $location.url(`/users/${$scope.listing.userId}`)
            }, 1000);
        })
    }
})
   