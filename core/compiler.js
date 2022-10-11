/*
 * @Description: 
 * @FilePath: \Lwebpack\core\compiler.js
 * @Date: 2022-09-29 15:59:53
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:35:01
 * @author: Lin_kangjing
 */
const fs = require("fs");
const path = require("path");
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');
const { SyncHook } = require("tapable");
const { toUnixPath,tryExtensions } = require("./utils");
class Compiler {
  constructor(options) {
    this.options = options;
    // root path
    this.rootPath = this.options.context || toUnixPath(process.cwd());
    
    // create plugin hooks
    this.hooks = {
      // start the compilation hook
      run: new SyncHook(),
      //  executed before output asset to the output director (before writing to a file)
      emit: new SyncHook(),
      // executed on compilation completion
      // 在 compilation 完成时执行 全部完成编译执行
      done: new SyncHook(),
    };
    // save all module objects of entry
    this.entries = new Set();
    // save all dependent module objects
    this.modules = new Set();
    // all code block objects
    this.chunks = new Set();
    // all file objects of this output
    this.assets = new Set();
    // all file names of this compilation
    this.files = new Set();
    console.log('------------------')
    console.log('compiler init')
  }

  // matching loader processing
  handleLoader(modulePath) {
    const matchLoaders = [];
    //1.get all the incoming loader rules
    const rules = this.options.module.rules;
    rules.forEach((loader) => {
      const testRule = loader.test;
      if (testRule.test(modulePath)) {
        if (loader.loader) {
          matchLoaders.push(loader.loader);
        } else {
          matchLoaders.push(...loader.use);
        }
      }
    });
    // 2.executed the loader source code in reverse order
    for (let i = matchLoaders.length - 1; i >= 0; i--) {
      // 目前我们外部仅支持传入绝对路径的loader模式
      // require引入对应loader
      const loaderFn = require(matchLoaders[i]);
      // 通过loader同步处理我的每一次编译的moduleCode
      this.moduleCode = loaderFn(this.moduleCode)
    }
  }
  // call webpack for module compilation
  handleWebpackCompiler(moduleName, modulePath){
    // calculate the  relative path of the current module relative to the projet startup root directory as the module ID
    const moduleId = './'+path.posix.relative(this.rootPath,modulePath)
    // creating a module object
    const module = {
      id:moduleId,
      // the absolute path address of the module on which the module depends
      dependencies:new Set(),
      //the entry file to which the module belongs
      name:[moduleName]
    }
    // call babel to analyze the code
    const ast = parser.parse(this.moduleCode,{
      sourceType:'module'
    })
    // depth-first traversal of the syntax tree
    traverse(ast,{
      //when the require statement is encountered require('../path')
      CallExpression:(nodePath)=>{
        const node  = nodePath.node
        if(node.callee.name === 'require'){
          // gets the relative path of the introduced in the source code
          const requirePath = node.arguments[0].value
          // get the absolute path of module 当前模块路径+require()对应相对路径
          const moduleDirName = path.posix.dirname(modulePath)
          const absolutePath = tryExtensions(
            path.posix.join(moduleDirName, requirePath),
            this.options.resolve.extensions,
            requirePath,
            moduleDirName
          )
          // generate moduleId 
          const moduleId = './'+path.posix.relative(this.rootPath,absolutePath)
          // 'babel' changed 'require' in the source code to a '__webpack_require__'
          node.callee = t.identifier('__webpack_require__');
          // 修改源代码中require语句引入的模块 全部修改变为相对于跟路径来处理
          node.arguments = [t.stringLiteral(moduleId)]
          // add a depend for current module 
          module.dependencies.add(moduleId)
          
        }
      }
    })
    // generate new code
    const {code} = generator(ast)
    // mounts the new generate code for current module
    module._source = code
    return module


  }
  // compiler module
  buildModule(moduleName, modulePath) {
    // 1.read the source code
    const originSourceCode = (this.originSourceCode = fs.readFileSync(
      modulePath,
      "utf8"
    ));
    // the modified code
    this.moduleCode = originSourceCode;
    // 2.call loader for processing
    this.handleLoader(modulePath);
    // 3.call webpack for module compilation,get the final module object
    const module = this.handleWebpackCompiler(moduleName, modulePath)
    return module;
  }
  // compiler the entry file
  buildEntryModule(entry) {
    Object.keys(entry).forEach((entryName) => {
      const entryPath = entry[entryName];
      const entryObj = this.buildModule(entryName, entryPath);
      this.entries.add(entryObj);
    });
    console.log('entries',this.entries)
  }
  
  // get the entry object of configuration
  getEntry() {
    let entry = Object.create(null);
    const { entry: optionsEntry } = this.options;
    if (typeof optionsEntry === "string") {
      entry["main"] = optionsEntry;
    } else {
      entry = optionsEntry;
    }
    // change entry to an absolute path
    Object.keys(entry).forEach((key) => {
      const value = entry[key];
      if (!path.isAbsolute(value)) {
        entry[key] = toUnixPath(path.join(this.rootPath, value));
      }
    });
    return entry;
  }
  // start the compilation
  run(callback) {
    // triggering start compiler plugin
    this.hooks.run.call();
    // get the entry object of configuration
    const entry = this.getEntry();
    // compiler the entry file
    this.buildEntryModule(entry);
  }
}
module.exports = Compiler;
