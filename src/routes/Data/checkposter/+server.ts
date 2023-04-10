import { json } from '@sveltejs/kit';
import { postdb } from '../../../stores/data.js';

export async function POST({request}:any): Promise<Response> {
    let req=await request.json();  
    let data:any=await postdb.find({
        selector:{_id:req.post,user:req.user.key}
    })
    if(data.docs[0]!=undefined){
        return json({
            status:true
        })
    }
    
    return json({
        status:false
    });
}