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
# will automatically point to your local api instead
DEV=true ndoc ...

# make a document (long form of ndoc [-options])
ndoc generate [-options]

# see a document
ndoc get [id]

# list by page DESC
ndoc list [-page=1]

```


NodeJS Usage:
---

```JSX
const ndoc = require('ndoc');

ndoc({
  email: process.env.NDOC_EMAIL,
  key: process.env.NDOC_KEY,
  template: "<div>{{myVar}} from ndoc</div>",
  filename: "ndoc-test.pdf",
  data: {
    myVar: "Hello World"
  }
}).then(function(res) {
  console.log(res.id, res.result_url);
}).catch(function(err) {
  console.error(err);
})
```
