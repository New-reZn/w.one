import PouchDB from 'pouchdb';
import NodeWebSqlAdapter from 'pouchdb-adapter-node-websql';

PouchDB.plugin(NodeWebSqlAdapter);
//for user,comment,c_likes,c_dislike
export const userdb = new PouchDB('w.one-user', { adapter: 'websql' });
//for post,likes,downloads,tags
export const postdb = new PouchDB('w.one-post', { adapter: 'websql' });