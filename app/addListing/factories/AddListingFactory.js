"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("AddListingFactory", function ($http) {

    //const categories = []

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

        "filteredSubCategories": {
            value: [],
            enumerable: true,
            writable: true
        },
        "categoryViewModel": {
            value: [],
            enumerable: true,
            writable: true
        },

        "subCategoryViewModel": {
            value: [],
            enumerable: true,
            writable: true
        },

        "attributeView": {
            value: [],
            enumerable: true,
            writable: true
        },

        "getCategoryViewModel": {
            value: function() {
                
                return this.categories.map(cat => {
                    return {
                        value: cat.externalId,
                        label: cat.label,
                        isSelected: false,
                    }
                })
            }
        },

        "getSubCategoryViewModel": {
            value: function(category) {
                
                const filteredSubCategories = this.subCategories.filter(s=> s.categoryExtId === parseInt(category))
                
                return filteredSubCategories.map(cat => {
                    return {
                        value: cat.externalId,
                        label: cat.label,
                        isSelected: false,
                    }
                })
            }
        },
        "getAttributeView": {
            value: function(subCat) {
                
                const filteredSubAttributes = this.subCategoryAttributes.filter(s=> s.subCategoryExternalId === parseInt(subCat))
                const filteredAttributes = this.attributes.filter(a=> {
                    return filteredSubAttributes.find(fa => fa.attributeExternalId === a.externalId)
                })
                //arr.filter(f => brr.includes(f));
                this.attributeView = filteredAttributes.map(attr => {
                    return {
                        data_type: attr.inputType,
                        label: attr.label,
                        value_type: attr.valueType,
                        inclusive: attr.inclusive,
                        externalId: attr.externalId,
                        desc: attr.desc,
                        model: "",
                        viewModel: []
                    }
                })
                this.addValuesToAttributeView();
                return this.attributeView
            }
        },
        "addValuesToAttributeView": {
            value: function() {

                this.attributeView.forEach(attr => {
                    if (attr.data_type === "select") {
                        // get the sorted values that match that attribute
                        let attrVal = this.attributeValues.filter(
                            a=> a.attributeExternalId === attr.externalId
                        ).sort((f,s)=> f.sequence - s.sequence)
                        
                        // now map those to the view model of the attribute
                        attr.viewModel = attrVal.map(a=> {
                            console.log(a)
                            return {
                                value: a.value,
                                label: a.value,
                                isSelected: false,
                            }
                        })
                    }
                })
                
            },
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