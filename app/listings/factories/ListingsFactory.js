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
            value: [],
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
            value: function(item, database) {
                item.tags = database.tags.filter(t=> t.listingId === item.id)
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
                        this.listings = Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]    
                        })

                    return $http({
                        method: "GET",
                        url: `https://${firebasePath}/itemAttributes/.json`
                    
                    }).then(r=> {
                        const data = r.data
                            
                            //Make an array of objects so we can use filters
                            this.itemAttributes = Object.keys(data).map(key => {
                                data[key].id = key
                                return data[key]
                            })

                            // return the enriched item display
                            this.listings.forEach(item => {
                                
                                item.category = database.categories.find(c=> item.categoryExternalId === c.externalId)
                                item.subCategory = database.subCategories.find(s=> item.subCategoryExternalId === s.externalId)
                                // create the attributes
                                item.attributes = this.itemAttributes.filter(a=> a.itemListingId === item.id)
                                item = this.addAttributeLabels(item, database)
                                item = this.addTags(item, database)
                            })
                            return this.listings
                        })
                         
                    })
            },
            enumerable: true,
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
        }
    })

})