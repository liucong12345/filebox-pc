import request from '@/utils/request'

const myFileApi = {
  shareHavePass: '/checklock',
  shareList: '/sharelist',
  file: '/box/file',
  // deleteFile: '/box/file/delete',
  deleteFile: '/box/deletefile',
  hashSearch: '/box/file/hash',
  myfile: '/box/myfile',
  newFiles: '/box/createdir',
  rename: '/box/renamefileordir',
  shareFiles: '/share',
  unshare: '/unshare',
  tree: '/box/dirList',
  copyOrMoveFile: '/box/copyormovefile',
  saveshare: '/saveshare',
  verifyklock: '/verifyklock',
  getvinfo: '/getvinfo',
}

// 分享是否带有密码
export function shareIsPassFn(parameter) {
  return request({
    url: myFileApi.shareHavePass,
    method: 'get',
    params: parameter
  })
}
//分享我的列表
export function shareMyListFn(parameter) {
  return request({
    url: myFileApi.shareList,
    method: 'get',
    params: parameter
  })
}

// 获取文件列表
export function getMyFileList(parameter) {
  // console.log(parameter)
  return request({
    url: myFileApi.myfile,
    method: 'post',
    data: parameter
  })
}

// export function getFileList(parameter) {
//   // console.log(parameter)
//   return request({
//     url: myFileApi.file,
//     method: 'get',
//     params: parameter
//   })
// }

// 哈希搜索
export function getFileForHash(parameter) {
  return request({
    url: myFileApi.hashSearch,
    method: 'get',
    params: parameter
  })
}

// 删除文件
export function deleteFiles(parameter) {
  return request({
    url: myFileApi.deleteFile,
    method: 'DELETE', //
    data: parameter
  })
}
// 新建文件夹
export function createFiles(parameter) {
  return request({
    url: myFileApi.newFiles,
    method: 'post',
    data: parameter
  })
}

// 重命名
export function renameFiles(parameter) {
  return request({
    url: myFileApi.rename,
    method: 'PUT',
    data: parameter
  })
}
// 分享文件
export function shareFilesFn(parameter) {
  return request({
    url: myFileApi.shareFiles,
    method: 'post',
    data: parameter
  })
}

// 取消分享
export function cancelShare(parameter) {
  return request({
    url: myFileApi.unshare,
    method: 'get',
    params: parameter
  })
}
// 获取树目录
export function treeListFn(parameter) {
  return request({
    url: myFileApi.tree,
    method: 'POST',
    data: parameter
  })
}
// 复制或者移动文件
export function copyMoveFiles(parameter) {
  return request({
    url: myFileApi.copyOrMoveFile,
    method: 'PUT',
    data: parameter
  })
}
// 保存分享
export function shareInPage(parameter) {
  return request({
    url: myFileApi.saveshare,
    method: 'POST',
    data: parameter
  })
}
export function verifyklock(parameter) {
  return request({
    url: myFileApi.verifyklock,
    method: 'get',
    params: parameter
  })
}
export function getvinfo(parameter) {
  return request({
    url: myFileApi.getvinfo,
    method: 'get',
    params: parameter
  })
}