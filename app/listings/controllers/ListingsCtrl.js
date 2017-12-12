"use strict"

angular.module("TheGiveawayBoxApp")
.controller("ListingsCtrl", function($scope, $http, $location, FilterFactory, ListingsFactory, AuthFactory, AddListingFactory, MasterDataFactory) {
    
    $scope.listings = []

    const f = ListingsFactory
    const masterData = MasterDataFactory

    // $scope.test = () => {
    //     //ListingsFactory.makeEbaySearch("strollers")
    //     //ListingsFactory.makeAmazonSearch("stroller")  
    // }

    //purchase button
    $scope.purchase = (e) => {
        console.log("making purchase")
        const user = AuthFactory.getUser()
        ListingsFactory.purchase(e.target.id, user)
    }
    
    // go ahead and store the master data once it's been updated
    let database = {
        categories: [],
        subCategories: [],
        attributes: [],
    }

    // check if user has a profile set up already or not
    // if not redirect them to the profile set-up
    $scope.init = () => {
            
            if (masterData.categories.length > 0) {
                database = masterData.database
                $scope.getListings(database)
            } else {
                masterData.init().then(d => {
                    database = masterData.database
                    $scope.getListings(database)
                    $scope.categories = database.categories
                })                  
            }
    } 

    /**
     * Get the listings
     * DECISION: Might be better to let this process get the full list
     * And use the filter parameters to drive if it limits to just the 
     * listings from users in the selected groups
     * @param {*} database 
     */
    $scope.getListings = (database) => {
        const user = AuthFactory.getUser()
        if (user) {
            ListingsFactory.getApprovedUsers(user).then(users=> {
                f.getListings(database).then(r=>{
                    $scope.listings = r
                    document.querySelector(".progress-circle.indefinite").style.display="none"
                })
            })
        } else {
            f.getListings(database).then(r=>{
                $scope.listings = r
                document.querySelector(".progress-circle.indefinite").style.display="none"
            })
        }
        
    }

    /**
     * FILTER
     */
    $scope.filter = {}
    $scope.filterSearchString = ""

    $scope.finder = (e) => {
        if (e.key === "Enter"){
            if ($scope.filterSearchString.length > 0){
                $scope.filter.keywords = $scope.filterSearchString.split(" ")
                $scope.listings = FilterFactory.getfilteredListings($scope.listings,$scope.filter)
            }
        }
    }

    /**
     * View Model for Categories
     */
    $scope.categories = database.categories.map(cat => {
        return {
            value: cat.externalId,
            label: cat.label,
            isSelected: false,
        }
    })

    $scope.selectedCategory = {}
    $scope.selectedSubCategory = {}
    $scope.subCategories = []

    $scope.getSubCategories = function() {
        $scope.filter.categoryExternalId = parseInt($scope.selectedCategory)
        const category = $scope.filter.categoryExternalId
        const filteredSubCategories = database.subCategories.filter(s=> s.categoryExtId === parseInt(category))
        $scope.subCategories = filteredSubCategories.map(cat => {
            return {
                value: cat.externalId,
                label: cat.label,
                isSelected: false,
            }
        })
    }

})