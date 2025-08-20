export const executePolicies = (policies) =>{
    return (req,res,next)=>{
        if(policies.includes("PUBLIC")) return next();
        if(policies.includes("AUTHORIZED")&& !req.user) return res.sendUnauthorized();
        if((policies=="AUTHORIZED")&&(req.user.role=="admin")) return next();
        return res.sendUnauthorized();
    }
}