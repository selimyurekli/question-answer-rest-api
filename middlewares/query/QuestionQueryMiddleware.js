const AsyncHandler = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const questionModel = require("../../models/question");
const {searchHelper, populateHelper,paginateHelper, sortHelper} =  require("../query/queryHelpers");
const QuestionQueryMiddleware = (model,options)=>{
    
    
    return AsyncHandler(async function(req,res,next){
        var query = model.find();
        //Search
        query = searchHelper(req,"title",query);

        //Populate
        if(options && options.population){
            query = populateHelper(query,options.population);
        }
        query = sortHelper(req,query);
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
    QuestionQueryMiddleware
}