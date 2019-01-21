var path=require("path");
var fs=require("fs");
/**
 * fs recursive functions
 * @module fs-ext
 * @type {Object}
 */
module.exports={
  /**
   * `mkdir -p <dest>`
   * no error if existing, make parent directories as needed
   * @param {string} dest
   */
  mkdirsSync(dest) {
    mkdirsSync0(path.resolve(dest));
  },
  /**
   * `rm -r <dest>`
   * no error if not existing, remove directory and its contents recursively
   * @param {string} dest
   */
  removeDirSync(dest){
    removeDirSync0(path.resolve(dest));
  },
  /**
   * `cp -r [options] <src> <dest>`
   * copy directory and its contents recursively
   * @param {string} src
   * @param {string} dest
   * @param {copyDirSyncOptions} [options]
   */
  copyDirSync(src,dest,options){
    var srcPath=path.resolve(src);
    var destPath=path.resolve(dest);
    if(destPath==srcPath||destPath.startsWith(srcPath+path.sep))
      throw new Error("dest path must be out of src path");
    var settings=Object.assign(Object.create(copyDirSyncOptions),options);
    settings.stack=[];
    settings.tasks=[];
    mkdirsSync0(destPath);
    copyDirSync0(srcPath,destPath,settings);
    settings.tasks.forEach((args)=>{
      fs.utimesSync.apply(fs,args);
    });
  }
};

/**
 * @typedef {Object} copyDirSyncOptions
 * @property {boolean} [overwrite=true] overwrite regular file/symbolic link
 * @property {boolean} [preserveFileDate=true] preserve regular files' modification date
 * @property {boolean} [readSymbolicLink=false] `--dereference` `--symbolic-link`
 * @property {Function} [filter=(filepath,stats)=>true] given filepath and stats, tell whether to copy
 */
var copyDirSyncOptions={
  overwrite: true,
  preserveFileDate: true,
  readSymbolicLink: false,
  filter:(filepath,stats)=>true
};

function mkdirsSync0(destPath){
  var parentPath=path.dirname(destPath);
  if(parentPath==destPath)
    throw new Error(`cannot mkdir ${destPath}, invalid root`);
  if(!fs.existsSync(destPath)){
    mkdirsSync0(parentPath);
    fs.mkdirSync(destPath);
  }else if(!fs.lstatSync(destPath).isDirectory()){
    throw new Error(`cannot mkdir ${destPath}, target exists but is not a directory`);
  }
}

function removeDirSync0(destPath){
  var files;
  try{
    files=fs.readdirSync(destPath);
  }catch(e){
    if(e.code=="ENOENT")
      return;
    throw e;
  }
  files.forEach((filename)=>{
    var childDestPath=path.join(destPath,filename);
    var stats=fs.lstatSync(childDestPath);
    if(stats.isDirectory()){
      removeDirSync0(childDestPath);
    }else if(stats.isFile()||stats.isSymbolicLink()){
      fs.unlinkSync(childDestPath);
    }else{
      throw new Error("Cannot remove special files");
    }
  });
  fs.rmdirSync(destPath);
}

function copyDirSync0(srcPath,destPath,settings){
  if(!fs.existsSync(destPath)){
    fs.mkdirSync(destPath);
  }else if(!fs.lstatSync(destPath).isDirectory()){
    if(settings.overwrite){
      throw new Error(`cannot overwrite non-directory '${destPath}' with directory '${srcPath}'.`);
    }
    return;
  }
  var stack;
  if(settings.readSymbolicLink){
    stack=settings.stack;
    let ino=fs.lstatSync(srcPath).ino;
    if(stack.indexOf(ino)!=-1){
      return;
    }
    stack.push(ino);
  }
  fs.readdirSync(srcPath).forEach((filename)=>{
    var childSrcPath=path.join(srcPath,filename);
    var childDestPath=path.join(destPath,filename);
    var stats=fs.lstatSync(childSrcPath);
    if(!settings.filter(childSrcPath,stats))
      return;
    var destStats;
    try{
      destStats=fs.lstatSync(childDestPath);
    }catch(e){}
    var targetStats;
    var targetPath;
    if(stats.isSymbolicLink()){
      targetStats=stats;
      targetPath=childSrcPath;
      do{
        targetPath=path.resolve(path.dirname(targetPath),fs.readlinkSync(targetPath));
        try{
          targetStats=fs.lstatSync(targetPath);
        }catch(e){
          return;
        }
      }while(targetStats.isSymbolicLink());
      if(settings.readSymbolicLink){
        childSrcPath=targetPath;
        stats=targetStats;
      }
    }
    if(stats.isDirectory()){
      copyDirSync0(childSrcPath,childDestPath,settings);
    }else if(stats.isFile()){
      fs.copyFileSync(childSrcPath, childDestPath, settings.overwrite?0:fs.constants.COPYFILE_EXCL);
      if(!settings.preserveFileDate)
        settings.tasks.push([childDestPath,new Date(),new Date()]);
    }else if(stats.isSymbolicLink()){
      let targetType=targetStats.isDirectory()?"dir":"file";
      if(destStats==null){
        fs.symlinkSync(fs.readlinkSync(childSrcPath),childDestPath,targetType);
      }else if(settings.overwrite){
        let srcType="symlink";
        let destType=destStats.isDirectory()?"dir":destStats.isSymbolicLink()?"symlink":"file";
        if(destType!=srcType)
          throw new Error(`cannot copy a ${srcType} to a ${destType}`);
        fs.unlinkSync(childDestPath);
        fs.symlinkSync(fs.readlinkSync(childSrcPath),childDestPath,targetType);
      }
    }
  });
  if(settings.readSymbolicLink){
    stack.pop();
  }
}

function copySymbolicLink0(srcPath,destPath){
  var linkPath=fs.readlinkSync(srcPath);
  fs.link(destPath);
}
