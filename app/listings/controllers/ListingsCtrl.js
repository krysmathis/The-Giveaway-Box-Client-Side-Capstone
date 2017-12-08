"use strict"

angular.module("TheGiveawayBoxApp")
.controller("ListingsCtrl", function($scope, $http, $location, ListingsFactory, AuthFactory, MasterDataFactory) {
    
    $scope.listings = []

    const f = ListingsFactory
    const masterData = MasterDataFactory

    $scope.currentUser = AuthFactory.getUser().email;
    // Construct the request
// Replace MyAppID with your Production AppID
    $scope.test = () => {
        ListingsFactory.makeEbaySearch("strollers")
    }

    $scope.init = () => {
            
            const database = {
                categories: [],
                subCategories: [],
                attributes: [],
                tags: []
            }
            
            if (masterData.categories.length > 0) {
                console.log("getting from cache")
                database.categories = masterData.categories
                database.subCategories = masterData.subCategories
                database.attributes = masterData.attributes
                database.tags = masterData.tags
                
                f.getListings(database).then(r=>{
                    $scope.listings = r
                    document.querySelector(".progress-circle.indefinite").style.display="none"
                })
            } else {
                console.log("loading from database")
                masterData.getCategories().then(cats => {
                    database.categories = cats
                    masterData.getSubCategories().then(subs => {
                        database.subCategories = subs
                        masterData.getAttributes().then(attrs =>{
                            database.attributes = attrs
                            masterData.getTags().then(tags =>{
                                database.tags = tags
                                f.getListings(database).then(r => {
                                    console.log("listings",r)
                                    $scope.listings = r
                                    document.querySelector(".progress-circle.indefinite").style.display="none"
                                })
                            })
                        })
                    })
                })

            }
    } // end of scope init

})