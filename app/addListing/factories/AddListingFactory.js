"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("AddListingFactory", function ($http) {


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
                        value: "",
                        viewModel: attr.viewModel
                    }
                })
                this.addValuesToAttributeView();
                return this.attributeView
            }
        },
        "addValuesToAttributeView": {
            value: function() {
                //transition code once the attribute data model is up to date we can lose this  
                this.attributeView.forEach(attr => {
                    const hasAttributeValues = attr.viewModel ? true : false
                    if (attr.data_type === "select" && !hasAttributeValues) {
                        
                        // get the sorted values that match that attribute
                        let attrVal = this.attributeValues.filter(
                            a=> a.attributeExternalId === attr.externalId
                        ).sort((f,s)=> f.sequence - s.sequence)
                        
                        // now map those to the view model of the attribute
                        attr.viewModel = attrVal.map(a=> {
                            return {
                                value: a.value
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
        "addImage": {
            value: function(file) {
                //upload an image
                const stamp = Date.now()
                return firebase.storage().ref().child("images/"+ stamp + file.name).put(file).then(result => {
                    return firebase.storage().ref().child("images/"+ stamp + file.name).getDownloadURL()
                    //return the url of the image you uploaded
                })
            }
        },
        "addListing": {
            // get current userId
            value: function (item,attributes,tags) {
                let listingId = ""
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    // add the userId as a property
                    item.userId = firebase.auth().currentUser.uid
                    item.timestamp = Date.now()
                    item.available = true,
                    item.active = true,
                    item.categoryExternalId = parseInt(item.categoryExternalId)
                    item.subCategoryExternalId = parseInt(item.subCategoryExternalId)
                    item.buyer = ""
                    item.buyerEmail = ""
                    item.requestedDate = 0
                    item.purchaseCompletedOn = 0
                    item.attributes = attributes.map(a=>{
                        return {
                            label: a.label,
                            value_type: a.value_type,
                            value: a.value
                        }
                    })
                    item.tags = tags

                    // keep this as a backup until everything has been transitioned over
                    $http({
                        method: "POST",
                        url: `https://${firebasePath}/itemListings/.json?auth=${idToken}`,
                        data: item
                    }).then(r=> {
                        listingId = r.data.name
                        attributes.forEach(attr => {
                            const attrUp = {
                                itemListingId: listingId,
                                attributeId: attr.externalId, 
                                value: attr.value
                            }
                            $http({
                                 method: "POST",
                                url: `https://${firebasePath}/itemAttributes/.json?auth=${idToken}`,
                                data: attrUp
                            })

                        })
                    }).then(r=> {
                        tags.forEach(t=> {
                            const tag = {
                                listingId: listingId,
                                tag: t
                            }
                            $http({
                                method: "POST",
                                url: `https://${firebasePath}/tags/.json?auth=${idToken}`,
                                data: tag
                            })
                        })
                    })
                })
            },
            enumerable: true
            // add item and then retrieve data.name
            // then add the attribute values k
        }
        
    })


})