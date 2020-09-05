const AsyncHandler = require("express-async-handler");
const {searchHelper,paginateHelper, sortHelper} =  require("../query/queryHelpers");
const UserQueryMiddleware = (model,options)=>{
    
    
    return AsyncHandler(async function(req,res,next){
        var query = model.find();
        //Search
        query = searchHelper(req,"name",query);
        const total = await model.countDocuments();

        const paginationResults = await paginateHelper(total,req,query).query;
        query = paginationResults.query;
        const pagination = paginationResults.pagination;


        const queryResults = await query;
        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination: pagination,
            data: queryResults
        };
        next();

    });

};



module.exports  = {
    UserQueryMiddleware
}