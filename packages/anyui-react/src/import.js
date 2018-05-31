
export function retrieveNpm(name, version) {
    var request = new XMLHttpRequest();
//request.open('GET', 'https://unpkg.com/react@latest/dist/react.min.js', false);
//request.open('GET', 'https://www.npmjs.com/search/suggestions?q=node', false);

request.open('GET', 'https://unpkg.com/react@15.4.1/dist/react.min.js', false);

try {
	request.send(null);
  if (request.status === 200) {
    console.log(request.responseText);
  }
} catch(err) {
	console.log(err);
}
}

export function dynamicImport(code) {
    return ''
}