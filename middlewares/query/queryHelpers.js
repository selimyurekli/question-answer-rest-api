const searchHelper = (req,key,query)=>{
    if(req.query.search){
        const searchObject = {};
        const regex = new RegExp(req.query.search,"i");
        searchObject[key] = regex;
        
        query = query.where(searchObject);
    }
    return query;
};
const populateHelper = (query,population)=>{
    return  query.populate(population);
}
const paginateHelper = async(totalDoc,req,query)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    const startIndex = (page-1)*limit; // 5
    const endIndex = page*limit-1;
    const total = await model.countDocuments();
    const pagination = {};
    if(startIndex > 0 ){
        pagination.previous = {
            page : page-1,
            limit: limit
        }
    }
    if(endIndex < total-1){
        pagination.next = {
            page : page+1,
            limit: limit
        }
    }

    return {
        query : query===undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination: pagination,
        startIndex, 
        limit
    }
}
const sortHelper = (req,query)=>{
    const sortBy = req.query.sortBy;
    if(sortBy === "most-answered"){
        return query.sort("--answerCount ")

    }
    if(sortBy=== "most-liked"){
        return query.sort("most-liked")
    }
    return query.sort("-createdAt")
}
module.exports = {
    searchHelper,
    populateHelper,
    paginateHelper,
    sortHelper
}