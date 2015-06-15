/**
 * Created by matjames007 on 4/29/15.
 */
var services = angular.module('jasmic.services', ['ngResource', "$window"]);

/**
 * Factory to be used to retrieve the farmers listing.
 */
services.factory('FarmersFactory', function ($resource) {
    return $resource('/farmers', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Factory to be used to show a specific farmer by id,
 * to create a new farmer and to update a new farmer
 * based on id submitted as a request parameter.
 */
services.factory('FarmerFactory', function ($resource) {
    return $resource('/farmer/:id', {}, {
        show: { method: 'GET', params: {id: '@id'} },
        update: { method: 'PUT', params: {id: '@id'} },
        create: { method: 'POST' }
    })
});

/**
 * Factory to be used to retrieve array of comments for specific
 * farmer based on id submitted as a request parameter
 */
services.factory('FarmerCommentsFactory', function($resource) {
    return $resource('/farmer/:id/comments', {}, {
        query: { method: 'GET', params: {id: '@id'}, isArray: true}
    });
});

/**
 * Factory to be used to create a new Comment on a particular
 * Farmer. To do the association we submit an id in the request
 * parameter.
 */
services.factory('FarmerCommentFactory', function($resource) {
    return $resource('/farmer/:id/comment', {}, {
        create: { method: 'POST', params: {id: '@id'}}
    });
});

/**
 * Use this factory to get all the farms of a particular farmer
 * given by the id submitted in the request parameter.
 */
services.factory('FarmerFarmsFactory', function($resource) {
    return $resource('/farmer/:id/farms', {}, {
        query: { method: 'GET', params: {id: '@id'}}
    });
});

/**
 * This factory is to be used to create and update a particular
 * farm based on the farmer's id.
 */
services.factory('FarmerFarmFactory', function($resource) {
    return $resource('/farmer/:id/farm', {}, {
        create: {method: 'POST', params: {id: '@id'}},
        update: {method: 'PUT', params: {id: '@id'}}
    });
});

/**
 * This factory allows us to do a search across multiple entities
 * including, Farmer, transactions, Buyers and Calls (limited to
 * 10 per entity)
 */
services.factory('SearchAllFactory', function($resource) {
    return $resource('/common/search', {}, {
        query: { method: 'GET'}
    });
});

/**
 * Factory to be used to retrieve the Parishes.
 */
services.factory('ParishesFactory', function ($resource) {
    return $resource('/common/parishes', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Factory to be used to retrieve the Transactions.
 */
services.factory('TransactionsFactory', function ($resource) {
    return $resource('/transactions', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Factory to be used to create and modify a transaction
 */
services.factory('TransactionFactory', function($resource) {
    return $resource('/transaction/:id', {}, {
        create: { method: 'POST'},
        update: { method: 'PUT', params: {id: '@id'}}
    });
});

/**
 * Allows for retrieval of multiple buyers to populate listing
 * screens.
 */
services.factory('BuyersListingFactory', function($resource) {
    return $resource('/buyers', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
});

/**
 * Factory to be used to create and modify a transaction
 */
services.factory('BuyerFactory', function($resource) {
    return $resource('/buyer/:id', {}, {
        show: { method: 'GET'},
        create: { method: 'POST'},
        update: { method: 'PUT', params: {id: '@id'}}
    });
});

/**
 * Allows for retrieval of multiple buyer types to populate pickers.
 */
services.factory('BuyerTypesListingFactory', function($resource) {
    return $resource('/buyertypes', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

/**
 * This is the factory used to create a representative based on a given
 * Buyer.
 */
services.factory('RepFactory', function($resource) {
    return $resource('/buyer/:id/rep', {}, {
        create: { method: 'POST', params: {id: '@id'}}
    });
});

/**
 * The plural form of crop.  Use this factory to get access to all crop
 * information on the system and their varieties.
 */
services.factory('CropsFactory', function($resource) {
    return $resource('/crops', {}, {
        query: { method: 'GET', isArray: true}
    });
});

services.factory('DistrictsFactory', function($resource) {
    return $resource('/common/districts', {}, {
        query: { method: 'GET', isArray: true}
    });
});

/**
 * Search/query for all the units in the system.
 */
services.factory('UnitsFactory', function($resource) {
    return $resource('/common/units', {}, {
        query: {method: 'GET', isArray: true}
    });
});

/**
 * Adds new Commodity and associates it with a farmer.
 */
services.factory('CommodityFactory', function($resource) {
    return $resource('/farmer/:id/commodity', {}, {
        create: {method: 'POST', params: {id: '@id'}}
    })
});

/**
 * Adds a new Demand and associates it with a buyer
 */
services.factory('BuyerDemandFactory', function($resource) {
    return $resource('/buyer/:id/demand', {}, {
        create: {method: 'POST', params: {id: '@id'}}
    })
});

/**
 * Factory to be used to retrieve the demands listing.
 */
services.factory('CurrentDemandsFactory', function ($resource) {
    return $resource('/buyers/current_demands', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Factory to be used to retrieve the commodities listing.
 */
services.factory('CurrentCommoditiesFactory', function ($resource) {
    return $resource('/farmers/current_commodities', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Retrieve a buyer's demands based on id
 */
services.factory('DemandsFactory', function($resource) {
    return $resource('/buyer/:id/demands', {}, {
        query: {method: 'GET', isArray: true, params: {id: '@id'}}
    });
});

/**
 * Retrieve a farmer's commdoties based on his id.
 */
services.factory('CommoditiesFactory', function($resource) {
    return $resource('/farmer/:id/commodities', {}, {
        query: {method: 'GET', isArray: true, params: {id: '@id'}}
    });
});

/**
 * Use this service to match a demand based on its ID to a
 * number of active commodities.  Returns a list.
 */
services.factory('DemandMatchFactory', function($resource) {
    return $resource('/demand/:id/match', {}, {
        query: {method: 'GET', isArray: true, params: {id: '@id'}}
    });
});

/**
 * Use this service to match a commodity based on its ID to a
 * number of active demands.  Returns a list.
 */
services.factory('CommodityMatchFactory', function($resource) {
    return $resource('/commodity/:id/match', {}, {
        query: {method: 'GET', isArray: true, params: {id: '@id'}}
    });
});

/**
 * Use this service to take action on a demand.
 */
services.factory('DemandFactory', function($resource) {
    return $resource('/demand/:id', {}, {
        show: {method: 'GET', params: {id: '@id'}}
    });
});

/**
 * Service used to query for all suppliers.
 */
services.factory('SuppliersFactory', function ($resource) {
    return $resource('/suppliers', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Service to get, create and update a specific factory.
 */
services.factory('SupplierFactory', function ($resource) {
    return $resource('/supplier/:id', {}, {
        show: { method: 'GET', params: {id: '@id'} },
        update: { method: 'PUT', params: {id: '@id'} },
        create: { method: 'POST' }
    })
});

/**
 * Service to retrieve all inputs from a particular supplier
 */
services.factory('SupplierInputsFactory', function ($resource) {
    return $resource('/supplier/:id/inputs', {}, {
        query: { method: 'GET', params: {id: '@id'}, isArray: true }
    })
});

/**
 * Intended to create and update an input for a particular supplier.
 */
services.factory('SupplierInputFactory', function ($resource) {
    return $resource('/supplier/:id/input', {}, {
        create: { method: 'POST', params: {id: '@id'} },
        update: {method: 'PUT', params:{id: '@id'}} //TODO: This is unimplemented by the server
    })
});

/**
 * Search for Inputs.  This can be used to do a standard query or
 * by supplying a searchTerms key that can be used to do a keyword
 * search on the inputs table for the DB.
 */
services.factory('SearchInputsFactory', function ($resource) {
    return $resource('/inputs', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Retrieves a list of inputtypes.  Can be queried using standard
 * query submissions.
 */
services.factory('InputTypesFactory', function ($resource) {
    return $resource('/inputtypes', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Add New Input Type to the application.
 */
services.factory('InputTypeFactory', function ($resource) {
    return $resource('/inputtypes', {}, {
        create: { method: 'POST'}
    })
});

/**
 * End point for retrieving the membership records of a particular
 * farmer.
 */
services.factory('FarmerMembershipsFactory', function ($resource) {
    return $resource('/farmer/:id/memberships', {}, {
        show: { method: 'GET', params: {id: '@id'}, isArray: true}
    });
});

/**
 * Use this factory to lookup profile of user or create a user.  Requires
 * administrative privileges.
 */
services.factory('UserProfileFactory', function($resource) {
    return $resource('/user', {}, {
        show: { method: 'GET'},
        create: { method: 'POST'}
    });
});
