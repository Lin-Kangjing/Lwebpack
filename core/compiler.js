/*
 * @Description:
 * @FilePath: \Lwebpack\core\compiler.js
 * @Date: 2022-09-29 15:59:53
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-13 15:47:04
 * @author: Lin_kangjing
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
const { SyncHook } = require("tapable");
const { toUnixPath, tryExtensions } = require("./utils");
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
    console.log("compiler init ------------------");
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
      this.moduleCode = loaderFn(this.moduleCode);
    }
  }
  // call webpack for module compilation
  handleWebpackCompiler(moduleName, modulePath) {
    // calculate the  relative path of the current module relative to the projet startup root directory as the module ID
    const moduleId = "./" + path.relative(this.rootPath, modulePath);
    // creating a module object
    const module = {
      id: moduleId,
      // the absolute path address of the module on which the module depends
      dependencies: new Set(),
      //the entry file to which the module belongs
      name: [moduleName],
    };
    // call babel to analyze the code
    const ast = parser.parse(this.moduleCode, {
      sourceType: "module",
    });
    // depth-first traversal of the syntax tree
    traverse(ast, {
      //when the require statement is encountered require('../path')
      CallExpression: (nodePath) => {
        const node = nodePath.node;
        if (node.callee.name === "require") {
          // gets the relative path of the introduced in the source code
          const requirePath = node.arguments[0].value;
          // get the absolute path of module 当前模块路径+require()对应相对路径
          const moduleDirName = path.dirname(modulePath);
          const absolutePath = tryExtensions(
            path.join(moduleDirName, requirePath),
            this.options.resolve.extensions,
            requirePath,
            moduleDirName
          );
          // generate moduleId
          const moduleId = "./" + path.relative(this.rootPath, absolutePath);
          // 'babel' changed 'require' in the source code to a '__webpack_require__'
          node.callee = t.identifier("__webpack_require__");
          // 修改源代码中require语句引入的模块 全部修改变为相对于跟路径来处理
          node.arguments = [t.stringLiteral(moduleId)];
          // get module ids
          const alreadyModuleIds = Array.from(this.modules).map(
            (module) => module.id
          );
          if (!alreadyModuleIds.includes(moduleId)) {
            // add a depend for current module
            module.dependencies.add(moduleId);
          } else {
            // update the entry for this module dependency
            // 为它的name属性添加当前所属的chunk名称。
            this.modules.forEach((module) => {
              if (module.id === moduleId) {
                module.name.push(moduleName);
              }
            });
          }
        }
      },
    });
    // generate new code
    const { code } = generator(ast);
    // mounts the new generate code for current module
    module._source = code;
    // recursive deep traversal
    module.dependencies.forEach((dependency) => {
      const depModule = this.buildModule(moduleName, dependency);
      this.modules.add(depModule);
    });

    return module;
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
    const module = this.handleWebpackCompiler(moduleName, modulePath);
    return module;
  }
  // assemble the chunks by entries file and dependencies
  buildUpChunk(entryName, entryObj) {
    const chunk = {
      // each entry file as a chunk
      name: entryName,
      // The object from which the entry file is compiled
      entryModule: entryObj,
      // all modules relative to the current entry
      modules: Array.from(this.modules).filter((module) =>
        module.name.includes(entryName)
      ),
    };
    this.chunks.add(chunk);
  }
  // compiler the entry file
  buildEntryModule(entry) {
    Object.keys(entry).forEach((entryName) => {
      const entryPath = entry[entryName];
      const entryObj = this.buildModule(entryName, entryPath);
      this.entries.add(entryObj);
      // 根据当前入口文件和模块的相互依赖关系，组装成为一个个包含当前入口所有依赖模块的chunkame,entryObj);
      this.buildUpChunk(entryName, entryObj);
    });
    // console.log('entries',this.entries)
    // console.log('modules',this.modules)
    console.log("chunks", this.chunks);
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
  // 导出chunk问文件
  exportFile(){
    const output = this.options.output
    // generate assets by chunks
    this.chunks.forEach(chink=>{
      const parseFileName = output.filename.replace('[name]',chunk.name)
      // assets中 { 'main.js': '生成的字符串代码...' }
      this.assets[parseFileName] = getSourceCode(chunk)
    })
    this.hooks.emit.call()
    // create output directory
    if(!fs.existsSync(output.path)){ 
      fs.mkdirSync(output.path)
    }
    // save all generated file names in 'files' 
    this.files = Object.keys(this.assets)
    // 将'assets'中的内容生成打包文件 写入文件系统中
  }
  // start the compilation
  run(callback) {
    // triggering start compiler plugin
    this.hooks.run.call();
    // get the entry object of configuration
    const entry = this.getEntry();
    // compiler the entry file
    this.buildEntryModule(entry);
    // 导出列表;之后将每个chunk转化称为单独的文件加入到输出列表assets中
    this.exportFile(callback)
  }
}
module.exports = Compiler;
