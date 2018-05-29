import * as XmlReader from 'xml-reader';

const reader = XmlReader.create();

export function toJSON(xml) {
    var result = XmlReader.parseSync(xml, {parentNodes: false});
    return strip(result);
}

function strip(result) {
    if (result) {
        if (result.attributes && Object.keys(result.attributes).length === 0) {
            delete result.attributes;
        }
    }

    if (result.children) {
        if (result.children.length === 0) {
            delete result.children;
        } else {
            result.children = result.children.map(strip);
        }
    }

    delete result.parent;
    if (!result.value) delete result.value;
    if (!result.name) delete result.name;

    if (result.value && result.type === 'text') result.value = result.value.trim();
    
    // call recursivly
    return result;
}