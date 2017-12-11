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
        "database": {
            get: function() {
                return { 
                    categories: this.categories,
                    subCategories: this.subCategories,
                    attributes: this.attributes
                }
            }
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
        "init": {
            value: function() {
                return this.getCategories().then(cats => {
                    this.categories = cats
                    return this.getSubCategories().then(subs => {
                        this.subCategories = subs
                        return this.getAttributes().then(attrs =>{
                            this.attributes = attrs
                        }) 
                    })
                })
                                 
            },
            enumerable: true
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