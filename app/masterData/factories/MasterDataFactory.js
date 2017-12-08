"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("MasterDataFactory", function ($http) {


    return Object.create(null, {
        "categories": {
            value: [],
            enumerable: true,
            writable: true
        },

        "subCategories": {
            value: [],
            enumerable: true,
            writable: true
        },
        "attributes": {
            value: [],
            enumerable: true,
            writable: true
        },
        "tags": {
            value: [],
            enumerable: true,
            writable: true
        },

        "subCategoryAttributes": {
            value: [],
            enumerable: true,
            writable: true
        },

        "attributeValues": {
            value: [],
            enumerable: true,
            writable: true
        },

        "getCategories": {
                value: function () {
                    return $http({
                        method: "GET",
                        url: `https://${firebasePath}/categories/.json`
                    }).then(response => {
                        const data = response.data
    
                        // Make an array of objects so we can use filters
                        this.categories = Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]
                        })
                        console.log("categories", this.categories);
                        return this.categories
                    })
            },
        },

        "getSubCategories": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/subCategories/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.subCategories = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    console.log("subcategories", this.subCategories);
                    return this.subCategories
                })
            },
        },
        "getAttributes": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/attributes/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.attributes = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    console.log("attributes", this.attributes);
                    return this.attributes
                })
            },
        },
        "getTags": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/tags/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.tags = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    console.log("tags", this.tags);
                    return this.tags
                }).then(() => 
                    this.getSubCategoryAttributes().then(() => 
                        this.getAttributeValues()
                    )
                )
            },
        },
        "getSubCategoryAttributes": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/subCategoryAttributes/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.subCategoryAttributes = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    console.log("subCategoryAttributes", this.subCategoryAttributes);
                    return this.subCategoryAttributes
                })
            },
        },
        "getAttributeValues": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/attributeValues/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.attributeValues = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    console.log("attributeValues", this.attributeValues);
                    return this.attributeValues
                })
            },
        },
        
        
    })


})