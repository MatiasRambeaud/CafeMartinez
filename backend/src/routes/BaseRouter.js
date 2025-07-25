import { Router } from "express";

export default class BaseRouter {

    constructor(){
        this.router = Router();
        this.init();
    }
    init(){

    }

    getRouter(){
        return this.router;
    }

    get(path,...callbacks){
        this.router.get(path,this.sendResponses,this.applyCallbacks(callbacks));
    }
    post(path,...callbacks){
        this.router.post(path,this.sendResponses,this.applyCallbacks(callbacks));
    }
    put(path,...callbacks){
        this.router.put(path,this.sendResponses,this.applyCallbacks(callbacks));
    }
    delete(path,...callbacks){
        this.router.delete(path,this.sendResponses,this.applyCallbacks(callbacks));
    }

    sendResponses(req,res,next){
        res.sendSuccess = (message) => res.status(200).send({status:"success",message});
        res.sendBadRequest = (message) => res.status(400).send({status:"success",error:message||"Solicitud incorrecta"});
        res.sendUnauthorized = (message) => res.status(401).send({status:"error",error:message||"No autorizado"});
        res.sendServerError = (message) => res.status(500).send({status:"error", error:message||"Error interno del servidor"})
        res.sendPayload = (message, payload) => res.status(200).send({status:"success",message, payload});
        next();
    }

    applyCallbacks(callbacks){
        return callbacks.map((callback)=>async(...params)=>{
            try{
                await callback.apply(this,params);
            }catch(error){
                console.log(error);
                params[1].status(500).send({status:"error",error:`${error.name} ${error.message}`});
            }
        })
    }
}