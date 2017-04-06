# ndoc
a simple client for the ndoc api


CLI Usage
----

```
npm run link

# until we actually host it on npm
```

```
# set up your api key!
ndoc key

ndoc --data "{\"var1\": \"Test\"}" --template "<p>{{var1}}</p>"

# DEV env var
DEV=true ndoc ...
```


NodeJS Usage:
---

```JSX
const ndoc = require('ndoc');

ndoc.email(process.env.NDOC_EMAIL);
ndoc.key(process.env.NDOC_KEY);

ndoc.generate({
  "document_content": "<div>{{myVar}} from ndoc</div>",
  "document_filename": "ndoc-test.pdf",
  "data": {
    "myVar": "Hello World"
  }
}).then(function(res) {
  console.log(res.id, res.result_url);
}).catch(function(err) {
  console.error(err);
})
```
