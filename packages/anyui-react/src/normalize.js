import * as XmlReader from 'xml-reader';

const reader = XmlReader.create();

export function toJSON(xml) {
    var result = XmlReader.parseSync(xml, {parentNodes: false});
    return strip(result);
}

function strip(result) {
    // call recursivly
    return result;
}