import { json } from "@sveltejs/kit";
import { postdb } from "../../../stores/data";
import { Result } from "postcss";

interface Like {
    _id: string;
    post: string;
    ogUser: string;
    likeby: string[];
}

export async function POST({request}:any) {
    const data=await request.json();
    const user=JSON.parse(data.user);
    const id=data.id;
    const like:any=(await postdb.find({
        selector:{
            _id:id
        }
    })).docs[0];
    
    let check=false;
    like.likeby.some((userL:{name:string,key:string})=>{
        check=JSON.stringify(userL)===JSON.stringify(user)
    });

    if(like.ogUser===user.key||check){
        return json({
            status:500
        })
    }
    return json({
        status:200
    })
}