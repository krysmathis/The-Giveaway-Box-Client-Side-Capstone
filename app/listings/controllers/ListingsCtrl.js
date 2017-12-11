"use strict"

angular.module("TheGiveawayBoxApp")
.controller("ListingsCtrl", function($scope, $http, $location, ListingsFactory, AuthFactory, MasterDataFactory) {
    
    $scope.listings = []

    const f = ListingsFactory
    const masterData = MasterDataFactory

    //$scope.currentUser = AuthFactory.getUser().email;
    // Construct the request
// Replace MyAppID with your Production AppID
    $scope.test = () => {
        //ListingsFactory.makeEbaySearch("strollers")
        ListingsFactory.makeAmazonSearch("stroller")    
    }

    $scope.init = () => {
            
            let database = {
                categories: [],
                subCategories: [],
                attributes: [],
            }

            if (masterData.categories.length > 0) {
                console.log("getting from cache")
                database = masterData.database
                f.getListings(database).then(r=>{
                    $scope.listings = r
                    document.querySelector(".progress-circle.indefinite").style.display="none"
                })
            } else {
                console.log("loading from database")
                masterData.init().then(d => {
                    database = masterData.database
                    f.getListings(database).then(r => {
                        console.log("where are the listings",r)
                        $scope.listings = r
                        document.querySelector(".progress-circle.indefinite").style.display="none"
                    })
                })                  
            }
    } // end of scope init

})