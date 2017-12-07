"use strict"

angular.module("TheGiveawayBoxApp")
.controller("AddListingCtrl", function($scope, $location, AddListingFactory) {
    
    $scope.categories = []

    $scope.item = {
        desc: "",
        price: "",
        image: "",
        categoryId: "",
        subCategoryId: ""
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
                $scope.subCategories = AddListingFactory.getSubCategoryViewModel($scope.item.categoryId);
            })
        } else {
                $scope.subCategories = AddListingFactory.getSubCategoryViewModel($scope.item.categoryId);
        }
    }

    $scope.getAttributes = () => {
        if (AddListingFactory.attributes.length === 0) {
            AddListingFactory.getAttributes().then(r=> {
                $scope.attributeModel = AddListingFactory.getAttributeView($scope.item.subCategoryId)
                console.log("view", AddListingFactory.attributeView)
            });
        } else {
            console.log("pulling from cache")
            $scope.attributeModel =AddListingFactory.getAttributeView($scope.item.subCategoryId)
        }
        
    }

    $scope.attributeModel = [];
        
    $scope.submitListing = () => AddListingFactory.addListing($scope.item, $scope.attributeModel)
    // $scope.listingModel = [
    //     {
    //         label: "Item Description",
    //         data_type: "text",
    //         model: "",
    //         name: "description"
    //     },
    //     {
    //         label: "Retail Price",
    //         data_type: "text",
    //         model: "",
    //         name: "price"
    //     },
    //     {
    //         label: "Image",
    //         data_type: "file",
    //         model: "",
    //         name: "image"
    //     },
    //     {
    //         label: "Category",
    //         data_type: "select",
    //         model: "",
    //         name: "subCategory",
    //         viewModel: AddListingFactory.getCategoryViewModel()
    //     },
    //     {
    //         label: "SubCategory",
    //         data_type: "select",
    //         model: "",
    //         name: "subCategory",
    //         viewModel: AddListingFactory.getSubCategories()
    //     },
        
    // ]
})