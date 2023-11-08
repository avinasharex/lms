import app from "../app"

export const setHeader = app.use((_req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'https://cozy-syrniki-891a48.netlify.app');
    next();
})