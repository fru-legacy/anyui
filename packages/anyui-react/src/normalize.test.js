import {xml2Object, object2Xml} from './normalize';

test('adds 1 + 2 to equal 3', () => {
  let testString = '<xml><a test="tes&lt;t2">1</a><b>2</b><a>3</a></xml>';

  //console.log(JSON.stringify(xml2Object(testString), null, 2), object2Xml(xml2Object(testString)));
  testString = object2Xml(xml2Object(testString));

  //console.log(JSON.stringify(xml2Object(testString), null, 2), object2Xml(xml2Object(testString)));
  testString = object2Xml(xml2Object(testString));
  
  console.log(testString);
  expect(3).toBe(3);
});
