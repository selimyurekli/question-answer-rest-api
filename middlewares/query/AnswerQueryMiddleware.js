const AsyncHandler = require("express-async-handler");
const { populateHelper,paginateHelper} =  require("../query/queryHelpers");
const AnswerQueryMiddleware = (model,options)=>{
    
    
    return AsyncHandler(async function(req,res,next){
        const id = req.params.id;
        
        const arrayName = "answers";
        const total = (await model.findById(id)).answers.length ;
        const paginationResults = await paginateHelper(total, req, undefined);
        const startIndex = paginationResults.startIndex;
        const limit = paginationResults.limit;
        let queryObject = {};


        queryObject[arrayName] = {$slice: [startIndex,limit]};
        

        let query = model.find({_id: id},queryObject);

        query = populateHelper(query,options.population);

        const queryResults = await query;


        res.queryResults = {
            success: true,
            pagination: queryResults.pagination,
            data: queryResults
        }




    });

};



module.exports  = {
    AnswerQueryMiddleware
}