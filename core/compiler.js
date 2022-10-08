/*
 * @Description:
 * @FilePath: \Lwebpack\core\compiler.js
 * @Date: 2022-09-29 15:59:53
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-08 16:31:30
 * @author: Lin_kangjing
 */
const fs = require("fs");
const path = require("path");
const { SyncHook } = require("tapable");
const { toUnixPath } = require("./utils");
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
      通过loader同步处理我的每一次编译的moduleCode
      this.moduleCode = loaderFn(this.moduleCode)
    }
  }
  // compiler module
  buildModule(moduleName, modulePath) {
    // 1.read the origin code
    const originSourceCode = (this.originSourceCode = fs.readFileSync(
      modulePath,
      "utf8"
    ));
    // the modified code
    this.moduleCode = originSourceCode;
    // 2.call loader for processing
    this.handleLoader(modulePath);
    return {};
  }
  // compiler the entry file
  buildEntryModule() {
    Object.keys(entry).forEach((entryName) => {
      const entryPath = entry[entryName];
      const entryObj = this.buildModule(entryName, entryPath);
      this.entries.add(entryObj);
    });
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
