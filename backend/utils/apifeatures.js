class ApiFeatures {
    constructor(query,queryStr) {
        this.query = query;
        this.queryStr = queryStr; 
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        }:{

        }
        console.log("ApiFeatures:: Search keyword to search:", keyword);
        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        /*
        everything in js passed as refference 
        
        const queryCopy = this.queryStr;
        if we use like this then this.queryStr value also get modified hence used spread operator

        */
        
        const queryCopy = {...this.queryStr};
        console.log("logging out the queryCopy before removing fields: ", queryCopy);
        
        // remove some fields for category

        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key => delete queryCopy[key]);
        console.log("logging out the queryCopy after removing fields: ", queryCopy);


        // making filter for price as it has range
        // we can directly use it without adding this filter but for mongoDB operator needs $ before it so aaded this code

        console.log("for price range before adding $ queryCopy: ", queryCopy)
        let queryStr = JSON.stringify(queryCopy);                               // converted obj into string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);  // replacing with $key as in mongoDB operator
        console.log("for price range after adding $ queryStr: ", queryStr);
        
        // here this.query means product.find() -> method
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        
        const currentPage = Number(this.queryStr.page) || 1;
        
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}

module.exports = ApiFeatures;