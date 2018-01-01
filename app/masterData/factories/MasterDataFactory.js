"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("MasterDataFactory", function ($http, $q) {


    return Object.create(null, {
        "categories": {
            value: [],
            enumerable: true,
            writable: true
        },
        "users": {
            value: [],
            enumerable: true,
            writable: true
        },
        "database": {
            get: function() {
                return { 
                    categories: this.categories,
                    subCategories: this.subCategories,
                    attributes: this.attributes,
                    users: this.users
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

                return $q.all([
                    this.getCategories(),
                    this.getSubCategories(),
                    this.getAttributes(),
                    this.getUsers()
                ])

                // return this.getCategories().then(cats => {
                //     this.categories = cats
                //     return this.getSubCategories().then(subs => {
                //         this.subCategories = subs
                //         return this.getAttributes().then(attrs =>{
                //             this.attributes = attrs
                //             return this.getUsers().then(users => {
                //                 this.users = users
                //             })
                //         })
                //     })
                // })
                                 
            },
            enumerable: true
        },
        "isReady": {
            value: function() {
                let ready = true
                for (let key in this.database) {
                    const currentObj = this.database[key]
                    if (currentObj.length === 0) {
                        ready = false
                    }
                }
                return ready
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
                        return this.categories
                    })
            },
        },
        "getUsers": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/users/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.users = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    return this.users
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
                    return this.attributeValues
                })
            },
        },
        "extractStreetFromUserAddress": {
            value: function(user) {
                try {
                    let re = /^\d+\w*\s*(?:[\-\/]?\s*)?\d*\s*\d+\/?\s*\d*\s*/;
                    let address = user.address
                    let number = address.match(re)
                    let street = address.split(number[0])[1]
                    return street
                } catch(err) {
                    return user.address.split(" ")[1]
                }
            },
            enumerable: true
        },
        
        
    })


})