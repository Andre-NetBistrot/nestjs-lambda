var fs = require('fs');
var package = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete package.devDependencies
console.log(package)
let data = JSON.stringify(package);
fs.writeFileSync('dist-package.json', data);