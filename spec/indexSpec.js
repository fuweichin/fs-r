var fs=require("fs");
var fse=require("../index.js");

describe("fs-ext",function(){
  describe("mkdirsSync",function(){
    beforeEach(function(){
      fse.removeDirSync("temp");
    });
    it("no error if existing, make parent directories as needed",function(){
      fse.mkdirsSync("temp/newdir");
      expect(fs.existsSync("temp/newdir")).toBe(true);
    });
  });
  describe("copyDirSync",function(){
    it("copy directory ",function(){
      fse.copyDirSync("spec","temp/copy-of-spec");
      expect(fs.existsSync("temp/copy-of-spec/support/jasmine.json")).toBe(true);
    });
    it("copy directories(readSymbolicLink)",function(){
      fs.symlinkSync("indexSpec.js","temp/copy-of-spec/indexTest.js","file");
      fs.symlinkSync("copy-of-spec","temp/test","dir");
      fse.copyDirSync("temp/test","temp/copy-of-test",{
        overwrite: true,
        preserveFileDate: false,
        readSymbolicLink: true,
        filter:(filename,stats)=>!filename.endsWith("Spec.js")
      });
      expect(fs.existsSync("temp/copy-of-test/indexTest.js")).toBe(true);
      expect(fs.lstatSync("temp/copy-of-test/indexTest.js").isFile()).toBe(true);
    });
  });
  describe("removeDirSync",function(){
    it("remove directories and their contents recursively",function(){
      fse.removeDirSync("temp");
      expect(fs.existsSync("temp")).toBe(false);
    });
  });
});
