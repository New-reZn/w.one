import { postdb } from "../../../stores/data";
import { json } from "@sveltejs/kit";
import multer from 'multer';

const upload = multer({ dest: '/static/media/' });
export async function POST({request}){
    const Request=await request;
    console.log(Request);
    return json({});
}