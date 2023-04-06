import { json } from '@sveltejs/kit';
import { userdb } from '../../../stores/data';
interface User {
    _id: string;
    _rev: string;
    name: string;
  }
  

export async function POST({ request }) {
    const {name,key} = await request.json();
    try {
        const result = await userdb.get<User>(key);
        
        if (result.name === name) {
            return json({
                status:200
            })
        }
      } catch (error:any) {
        if (error.status === 404) {
            return json({
                status:404
            })
        }
    }
}