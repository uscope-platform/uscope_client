import {rest} from "msw";




export let auth_data = null;

export const auth_api = [

    rest.post('/test_server/auth/login', (req, res, ctx) => {
        auth_data = req.body;
        if(req.body.password === "success"){
            return res(
                ctx.text("ok"),
                ctx.status(200)
            )
        } else{
            return res(
                ctx.text("FAILED"),
                ctx.status(401)
            )
        }

    }),


]