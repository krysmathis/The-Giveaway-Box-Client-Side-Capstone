"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("ListingsFactory", function ($http,$sce) {
    
    return Object.create(null,{
        
        "listings": {
            value: [],
            enumerable: true,
            writable: true
        },
        "itemAttributes": {
            value: [],
            enumerable: true,
            writable: true
        },

        "displayListing": {
            value: "",
            enumerable: true,
            writable: true
        },
        "attributes": {
            value: [],
            enumerable: true,
            writable: true
        },
        "find": {
            value: () => console.log("you found me!"),
            enumerable: true
        },
        "tags": {
            value: [],
            enumerable: true,
            writable: true
        },
        "userGroups":{
            value: [],
            enumerable: true,
            writable: true
        },
        "approvedUsers": {
            value: [],
            enumerable: true,
            writable: true
        },
        "updateApprovedUsers": {
            value: function(groups) {
                this.approvedUsers = []
                groups.forEach(g=> {
                    this.userGroups.filter(ug=> ug.groupId === g.groupId)
                    .forEach(ug => {
                        if (this.approvedUsers.indexOf(ug.userId) == -1) {
                            this.approvedUsers.push(ug.userId);
                        }
                    })
                })
            },
            enumerable: true
        },
        "getApprovedUsers": {
            value: function(user) {
                
                return $http({
                    url: `https://${firebasePath}/userGroups/.json`,
                    method: "GET"
                }).then(r => {
                    const data = r.data
                    
                        // Make an array of objects so we can use filters
                        this.userGroups = Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]    
                        })

                        const activeGroups = this.userGroups.filter(g=> user.uid === g.userId)
                        this.updateApprovedUsers(activeGroups)
                    
                    return this.approvedUsers
                })
            },
            enumerable: true
        },
        "purchase": {
            value: function(listingId, user) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/itemListings/${listingId}.json`
                }).then(response => {
                    const item = response.data

                    // update item values based on what we're modifying
                    item.buyer = user.uid
                    item.buyerEmail = user.email
                    item.requestedDate = Date.now()

                    // update the cached listings
                    const cachedItem = this.listings.find(l=> l.id === listingId)
                    cachedItem.buyer = user.uid
                    cachedItem.requestedDate = Date.now()
                    cachedItem.buyerEmail = user.email
                    

                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PUT",
                                url: `https://${firebasePath}/itemListings/${listingId}.json?auth=${idToken}`,
                                data: item
                            })
                        })

                })
            },
            enumerable: true
        },
        "closeListing":{
            value: function(listingId) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/itemListings/${listingId}.json`
                }).then(response => {
                    const item = response.data
                    // update item values based on what we're modifying
                    item.purchaseCompletedOn = Date.now()

                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PUT",
                                url: `https://${firebasePath}/itemListings/${listingId}.json?auth=${idToken}`,
                                data: item
                            })
                        })
                })
            },
            enumerable: true
        },
        "addAttributeLabels": {
            value: function(item,database) {
                if (item.hasOwnProperty("attributes")){
                    item.attributes.forEach(a=> {
                        const matchingAttribute = database.attributes.find(attr=> attr.externalId === a.attributeId)
                        if (matchingAttribute !== undefined) {
                            a.attributeName = matchingAttribute.label
                        }
                    })
                }
                return item
            },
            enumerable: true
        },
        "addTags": {
            value: function(item) {
                item.tags = this.tags.filter(t=> t.listingId === item.id)
                return item
            }, 
            enumerable: true
        },
        "getListings": {
            value: function(database) {
            
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/itemListings/.json`
                    
                }).then(response => {
                    
                    const data = response.data
                    // Make an array of objects so we can use filters
                    const _listings =  Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]    
                        })
                    
                    if (this.approvedUsers.length > 0) {
                        this.listings = _listings.filter(l=> {
                            return this.approvedUsers.findIndex(x=> x === l.userId) > -1
                        })
                    } else {
                        this.listings = _listings
                    }

                    this.listings.map(l=> {
                        if (!l.price > 0) { l.price = "FREE"}
                        l.user = database.users.find(u=> u.userId === l.userId)
                        l.category = database.categories.find(c=> l.categoryExternalId === c.externalId)
                        l.subCategory = database.subCategories.find(s=> l.subCategoryExternalId === s.externalId)
                        return l
                    })

                    return this.listings
                    // return $http({
                    //     method: "GET",
                    //     url: `https://${firebasePath}/itemAttributes/.json`
                    
                    // }).then(r=> {
                    //     const data = r.data
                            
                    //         //Make an array of objects so we can use filters
                    //         this.itemAttributes = Object.keys(data).map(key => {
                    //             data[key].id = key
                    //             return data[key]
                    //         })

                    //         return this.getTags().then(result => {
                    //             console.log("got tags")
                    //             // return the enriched item display
                    //             this.listings.forEach(item => {
                                    
                    //                 
                    //                 // create the attributes
                    //                 item.attributes = this.itemAttributes.filter(a=> a.itemListingId === item.id)
                    //                 item = this.addAttributeLabels(item, database)
                    //                 item = this.addTags(item, database)
                    //             })
                    //         return this.listings
                    //         })
                    //     })
                         
                    })
            },
            enumerable: true,
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
                })
            },
        },
        "getCurrentUserListings":{
            value: function(user) {
                    return $http({
                        method: "GET",
                        url: `https://${firebasePath}/itemListings/.json?orderBy="userId"&equalTo="${user.uid}"`
                    }).then(response => {
                        const data = response.data
                            // Make an array of objects so we can use filters
                            return Object.keys(data).map(key => {
                                data[key].id = key
                                return data[key]    
                            })
                    })
            }, enumerable: true
        },
        "getSingleListing":{
            value: function(listingId) {
                    return $http({
                        method: "GET",
                        url: `https://${firebasePath}/itemListings/${listingId}/.json`
                    }).then(response => {
                        const data = response.data
                        data.id = listingId
                            // Make an array of objects so we can use filters
                            return data
                    })
            }, enumerable: true
        },
        "deleteListing": {
            value: function(listingId) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    return $http({
                        method: "DELETE",
                        url: `https://${firebasePath}/itemListings/${listingId}/.json?auth=${idToken}`,
                    })
                })
            },
            enumerable: true
        },
        "makeEbaySearch": {
            value: function (userSearch) {
                let url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=${EBAY_APP_ID}&RESPONSE-DATA-FORMAT=XML&categoryId(0)=33034&categoryId(1)=33021&categoryId(2)=4713&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value(0)=true&itemFilter(1).name=Condition&itemFilter(1).value(0)=Used&itemFilter(1).value(1)=2500&itemFilter(1).value(2)=3000&itemFilter(1).value(3)=4000&itemFilter(1).value(4)=5000&itemFilter(1).value(5)=6000&itemFilter(2).name=ExcludeCategory&itemFilter(2).value(0)=181223&itemFilter(2).value(1)=47067&REST-PAYLOAD&keywords=${userSearch}`
                let trustedUrl = $sce.trustAsResourceUrl(url)
                return $http.jsonp(trustedUrl, 
                    {jsonpCallbackParam: 'callback'})
                    .then(response => {
                        console.log(response)
                    })
            }
        },
        "makeAmazonSearch": {
            value: function (userSearch) {
                const Crypto = CryptoJS
                function getSignatureKey(Crypto, key, dateStamp, regionName, serviceName) {
                    var kDate = Crypto.HmacSHA256(dateStamp, "AWS4" + key);
                    var kRegion = Crypto.HmacSHA256(regionName, kDate);
                    var kService = Crypto.HmacSHA256(serviceName, kRegion);
                    var kSigning = Crypto.HmacSHA256("aws4_request", kService);
                    return kSigning;
                }
            }
        }
    })

})