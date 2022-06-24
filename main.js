let fs = require("fs");
let path = require("path");

let inputArr = process.argv.slice(2);

let command = inputArr[0];

let types = {
    video: ["mp4", "mkv","3gp","avi","mov","m4v"],
    images: ["png", "img", "jpeg", "jpg","gif","svg"],
    audio:["mp3","mpa","wav","wma"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc","ppt","pptx","csv", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "tex"],
    app: ["exe", "dmg", "pkg", "deb","sh"],
    program_files: ["cpp","c", "py", "ipynb", "js", "jsx","json","r", "html", "css","md"]
}
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1],inputArr[2]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log(`Please input a command from the given menu :
                node main.js tree "directoryPath"
                node main.js organize Duplicate "directoryPath"
                node main.js organize Original "directoryPath"
                node main.js help
        `);
        break;
}


function helpFn() {
    console.log(`
    List of All the commands:
    node main.js tree "directoryPath"
    node main.js organize Duplicate "directoryPath"
    node main.js organize Original "directoryPath"
    node main.js help
                `);
}


function organizeFn(dup,dirPath) {

    let destPath;
    if(dup==undefined)
    {
        console.log("Enter Duplicate or Orginal");
        return;
    }
    if (dirPath == undefined) {
      
        return;
    } else {

        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {

            destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }

        } else {

            console.log("Incorrect Directory path");
            return;
        }
    }
    organizeHelper(dup, dirPath, destPath);
    console.log("The Given Directory Has Been Organized")
}


function organizeHelper(dup, src, dest) {

    let childNames = fs.readdirSync(src);
    let cnt=0;
    for (let i = 0; i < childNames.length; i++) {

        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            cnt++;
            let category = getCategory(childNames[i]);
            sendFiles(dup, childAddress, dest, category);

        }
    }
    console.log("Successfully Moved ",cnt," files to respective folders")
}


function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}



function sendFiles(dup, srcFilePath, dest, category) {
    // 
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    if(dup=="Original")
    {fs.unlinkSync(srcFilePath);}
    // console.log(fileName, "copied to ", category);

}

function treeFn(dirPath) {
    // let destPath;
    if (dirPath == undefined) {

        treeHelper(process.cwd(), "");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath, "");
        } else {

            console.log("Kindly enter the correct path");
            return;
        }
    }
}

function treeHelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    let isDirectory = fs.lstatSync(dirPath).isDirectory();
    if (isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    } 
    if(isDirectory) {
        let dirName = path.basename(dirPath)
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }


}























