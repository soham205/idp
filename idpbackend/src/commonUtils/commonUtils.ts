import slugify from "slugify";

export const makeSlug = (slugTitle: string) => {
    return slugify(slugTitle, { replacement: "-", lower: true })
}

export const deleteUndefinedFieldsInObject = (jsObj: any) => {
    // Delete null or undefined fields.
    for (var key in jsObj) {
        if (jsObj.hasOwnProperty(key)) {
            if (!jsObj[key]
                && typeof jsObj[key] !== 'boolean'
                && typeof jsObj[key] !== 'number') {
                delete jsObj[key];
            }
        }
    }
    return jsObj;
}