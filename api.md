<a name="module_fs-r"></a>

 fs-r : <code>Object</code>
fs recursive functions

**Version**: 0.1  

* [fs-r](#module_fs-r) : <code>Object</code>
    * _static_
        * [.mkdirsSync(dest)](#module_fs-r.mkdirsSync)
        * [.removeDirSync(dest)](#module_fs-r.removeDirSync)
        * [.copyDirSync(src, dest, [options])](#module_fs-r.copyDirSync)
    * _inner_
        * [~copyDirSyncOptions](#module_fs-r..copyDirSyncOptions) : <code>Object</code>

<a name="module_fs-r.mkdirsSync"></a>

 fs-r.mkdirsSync(dest)
`mkdir -p <dest>`
no error if existing, make parent directories as needed

**Kind**: static method of [<code>fs-r</code>](#module_fs-r)  

| Param | Type |
| --- | --- |
| dest | <code>string</code> | 

<a name="module_fs-r.removeDirSync"></a>

 fs-r.removeDirSync(dest)
`rm -r <dest>`
no error if not existing, remove directory and its contents recursively

**Kind**: static method of [<code>fs-r</code>](#module_fs-r)  

| Param | Type |
| --- | --- |
| dest | <code>string</code> | 

<a name="module_fs-r.copyDirSync"></a>

 fs-r.copyDirSync(src, dest, [options])
`cp -r [options] <src> <dest>`
copy directory and its contents recursively

**Kind**: static method of [<code>fs-r</code>](#module_fs-r)  

| Param | Type |
| --- | --- |
| src | <code>string</code> | 
| dest | <code>string</code> | 
| [options] | <code>copyDirSyncOptions</code> | 

<a name="module_fs-r..copyDirSyncOptions"></a>

 fs-r~copyDirSyncOptions : <code>Object</code>
**Kind**: inner typedef of [<code>fs-r</code>](#module_fs-r)  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| [overwrite] | <code>boolean</code> | <code>true</code> | 
| [preserveFileDate] | <code>boolean</code> | <code>true</code> | 
| [readSymbolicLink] | <code>boolean</code> | <code>false</code> | 
| [filter] | <code>function</code> | <code>(filepath,stats)&#x3D;&gt;true</code> | 

