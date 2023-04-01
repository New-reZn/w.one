import PouchDB from 'pouchdb';
import NodeWebSqlAdapter from 'pouchdb-adapter-node-websql';

PouchDB.plugin(NodeWebSqlAdapter);
const db = new PouchDB('w.one', { adapter: 'websql' });

// const a={
//     _id:'1',
//     name:"kqsbkq"
// }

// const user = {
//     _id: 'user_2',
//     name: 'John Doe',
//     email: 'johndoe@example.com'
//   };
  
//   db.put(user).then(result => {
//     console.log(result);
//   }).catch(error => {
//     console.log(error);
//   });
  
//   // Add a new post record
//   const post = {
//     _id: 'post_2',
//     title: 'My first post',
//     body: 'This is my first post on this website.',
//     author: 'user_2'
//   };
  
//   db.put(post).then(result => {
//     console.log(result);
//   }).catch(error => {
//     console.log(error);
//   });
  

// db.allDocs({ include_docs: true }).then(result => {
//     console.log(result.rows)
//   }).catch(error => {
//     console.log(error);
//   });
  