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
    const download:any=(await postdb.find({
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
    download.downloadby.some((userL:{name:string,key:string})=>{
        check=JSON.stringify(userL)===JSON.stringify(user)
        return;
    });
    if(download.ogUser===user.key||check){
        Post.downloads=download.downloadby.length;
        postdb.put(Post);
        return json({
            status:500
        })
    }else{
        download.downloadby.push(user);
        postdb.put(download);
        return json({
            status:200
        })   
    }
}