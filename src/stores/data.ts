import PouchDB from 'pouchdb';
import NodeWebSqlAdapter from 'pouchdb-adapter-node-websql';
import findPlugin from 'pouchdb-find';

PouchDB.plugin(findPlugin);
PouchDB.plugin(NodeWebSqlAdapter);

//for user,comment,c_likes,c_dislike
export const userdb = new PouchDB('w.one-user', { adapter: 'websql' });
//for post,likes,downloads,tags
export const postdb = new PouchDB('w.one-post', { adapter: 'websql' });

postdb.createIndex({
    index: {fields: ['title','user','_id']}
}).then(function () {
    console.log()
});