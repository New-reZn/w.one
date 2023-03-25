import PouchDB from 'pouchdb';
import NodeWebSqlAdapter from 'pouchdb-adapter-node-websql';

PouchDB.plugin(NodeWebSqlAdapter);
const db = new PouchDB('w.one', { adapter: 'websql' });

export {}