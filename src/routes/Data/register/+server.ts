import { json } from '@sveltejs/kit';
import { userdb } from '../../../stores/data';

export async function POST({ request }) {
    const {name,key} = await request.json();
    
    const result= await userdb.put({
        _id:key,
        name:name
    })

    if(result.ok){
        return json({
            status:200
        })
    }else{
        return json({
            status:404
        })
    }
    
}