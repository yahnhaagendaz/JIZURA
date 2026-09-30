'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
global.window = {devicePixelRatio:1,location:{hash:''},localStorage:{getItem:()=>null,setItem:()=>{}}};
global.localStorage = window.localStorage;
global.document = {body:{getPropertyValue:()=> 'monospace'},getElementById:()=>null,querySelectorAll:()=>[],addEventListener:()=>{},createElement:()=>({style:{},getContext:()=>({measureText:t=>({width:t.length*10})})})};
const dir = path.join(__dirname,'../src');
vm.runInThisContext(fs.readdirSync(dir).filter(n=>n.endsWith('.js')).sort().map(n=>fs.readFileSync(path.join(dir,n),'utf8')).join('\n'));
module.exports = window.J;
