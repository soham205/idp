import fs from "fs";
import path from "path";

/**
 * Get file base 64 contents. If file location is invalid function will return ''
 * @param  {string} fileLocation
 * @returns :- base64 string
 */
export const getFileBase64String = (fileLocation: string) => {
  let base64String: string  = "";
  try {
    const imgData = fs.readFileSync(fileLocation);
    base64String = imgData.toString('base64');
  } catch (readFileError) {
    console.error('vcard :: utilFunctions :: getFileBase64String :: readFileError :: ',readFileError)
  }
  return base64String;
};

/**
 * Returns file mime type.
 * @param  {string} fileLocation
 * @returns :- File mime type.
 */
export const getFileMimetype = (fileLocation:string)=>{
  return path.extname(fileLocation).toUpperCase().replace(/\./g, "");
}