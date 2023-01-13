export default function(handler){
    return async(req, res, next)=>{
        try{
            await handler(req, res);
        }
        catch(ex){
            res.render("error",{
                message: "Internal error"
            });
            next(ex);
        }
    }
}