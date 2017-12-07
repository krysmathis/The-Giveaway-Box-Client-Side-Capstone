"use strict"

angular.module("TheGiveawayBoxApp")
.controller("AddListingCtrl", function($scope, $location, AddListingFactory) {
    
    /**
     * tag objects
     */

    $scope.tags = ["test"]
    $scope.getMaxTagId = () => Math.max.apply(Math,array.map(function(o){return o.y;}))
    $scope.newTag = "";
    
    $scope.addTags = (tag) => {
        //TODO: check for duplicates in this
            if ($scope.tags.find(f=> f===tag)) {
                console.log("already here")
            } else {
                $scope.tags.push(tag)
            }
    }

    $scope.updateTags = (e) => {
        if (e.key === "Enter") {
            $scope.addTags($scope.newTag)
            $scope.newTag = ""
        } else if (e.keyCode === 8 && $scope.newTag.length === 0) {
            $scope.tags.pop()
        }
    }
    
    $scope.removeTag = (e) => {
        const tags = $scope.tags
        const i = tags.indexOf(e.target.innerHTML)
        tags.splice(i,1)
    }

    /**
     * category objects
     */
    $scope.categories = []

    $scope.item = {
        desc: "",
        price: "",
        image: "",
        categoryExternalId: "",
        subCategoryExternalId: ""
    }

    // use the cached view model otherwise pull a new one
    if (AddListingFactory.catgoryViewModel === undefined) {
        AddListingFactory.getCategories().then(r=> {
            $scope.categories = AddListingFactory.getCategoryViewModel()
        })
    } else {
        console.log("pulling from cache")
        $scope.categories = AddListingFactory.categoryViewModel()
    }
    
    
    // only load the subcategories once the category is selected
    $scope.subCategories = [];

    $scope.getSubCategories = function() {
        if (AddListingFactory.subCategories.length === 0) {
            AddListingFactory.getSubCategories().then(r=>{
                $scope.subCategories = AddListingFactory.getSubCategoryViewModel($scope.item.categoryExternalId);
            })
        } else {
                $scope.subCategories = AddListingFactory.getSubCategoryViewModel($scope.item.categoryExternalId);
        }
    }

    /**
     * attribute objects
     * 
     */
    $scope.getAttributes = () => {
        if (AddListingFactory.attributes.length === 0) {
            AddListingFactory.getAttributes().then(r=> {
                $scope.attributeModel = AddListingFactory.getAttributeView($scope.item.subCategoryExternalId)
                console.log("view", AddListingFactory.attributeView)
            });
        } else {    
            console.log("pulling from cache")
            $scope.attributeModel =AddListingFactory.getAttributeView($scope.item.subCategoryExternalId)
        }
        
    }

    $scope.attributeModel = [];
        
    $scope.submitListing = () => 
        AddListingFactory.addListing($scope.item, $scope.attributeModel, $scope.tags)

// end of module
})