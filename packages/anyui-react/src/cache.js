// TODO 

let example = {
    "->": "DONT EVER MANUELLEY CHANGE ANY OF THESE STRINGS!",
    checksum: 1,
    code: {
        
    },
    text: {
        "in_code": {
            variables: ["a", "b"],
            transpiled: "out_code"
        }
    }
    
}

function checksum(s)
{
  var chk = 0x12345678;
  var len = s.length;
  for (var i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1));
  }

  return (chk & 0xffffffff).toString(16);
}
