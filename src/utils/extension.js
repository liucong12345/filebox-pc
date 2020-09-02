// 获取文件扩展名
export function getFileExtension(type) {
    switch (type) {
        case 'jpg':
            return require('../assets/icons/img.png');
        case 'png':
            return require('../assets/icons/img.png');
        case 'bmp':
            return require('../assets/icons/img.png');
        case 'jpeg':
            return require('../assets/icons/img.png');
        case 'gif':
            return require('../assets/icons/img.png');
        case 'svg':
            return require('../assets/icons/img.png');
        case 'psd':
            return require('../assets/icons/img.png');
        case 'webp':
            return require('../assets/icons/img.png');
        case 'tif':
            return require('../assets/icons/img.png');
        case 'exif':
            return require('../assets/icons/img.png');
        case 'cdr':
            return require('../assets/icons/img.png');
        case 'ai':
            return require('../assets/icons/img.png');

        case 'pdf':
            return require('../assets/icons/pdf.png');
        case 'xlsx':
            return require('../assets/icons/excel.png');
        case 'xls':
            return require('../assets/icons/excel.png');
        case 'docx':
            return require('../assets/icons/word.png');
        case 'doc':
            return require('../assets/icons/word.png');
        case 'pptx':
            return require('../assets/icons/ppt.png');
        case 'ppt':
            return require('../assets/icons/ppt.png');

        case 'txt':
            return require('../assets/icons/file.png');
        case 'mp4':
            return require('../assets/icons/video.png');
        case 'avi':
            return require('../assets/icons/video.png');
        case 'flv':
            return require('../assets/icons/video.png');
        case 'mp3':
            return require('../assets/icons/music.png');
        case 'WAV':
            return require('../assets/icons/music.png');

        case 'zip':
            return require('../assets/icons/package.png');
        case 'rar':
            return require('../assets/icons/package.png');
        case 'jar':
            return require('../assets/icons/package.png');

        case 'folder':
            return require('../assets/icons/folder.png');
    }
}