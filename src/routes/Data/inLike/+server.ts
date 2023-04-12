import { json } from "@sveltejs/kit";
import { postdb } from "../../../stores/data";

interface Like {
    _id: string;
    post: string;
    ogUser: string;
    likeby: string[];
}

export async function POST({request}:any) {
    const data=await request.json();
    const user=JSON.parse(data.user)
    const id=data.id;
    const post=data.stat;
    const like:any=(await postdb.find({
        selector:{
            _id:id
        }
    })).docs[0];
    
    const Post:any=(await postdb.find({
        selector:{
            title:post.title
        }
    })).docs[0];

    let check=false;
    like.likeby.some((userL:{name:string,key:string})=>{
        check=JSON.stringify(userL)===JSON.stringify(user)
    });
    
    if(like.ogUser===user.key||check){
        Post.likes=like.likeby.length;
        postdb.put(Post);
        return json({
            status:500
        })
    }else{
        like.likeby.push(user);
        postdb.put(like);
        return json({
            status:200
        })   
    }
}