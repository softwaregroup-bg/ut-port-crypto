# ut-port-crypto

## methods list

* crypto.index.add
* crypto.index.get
* crypto.index.getModes
* crypto.index.list
* crypto.index.update
* crypto.constraint.add
* crypto.constraint.get
* crypto.constraint.list
* crypto.constraint.update
* crypto.record.add
* crypto.record.get
* crypto.record.getByExternalId
* crypto.record.getBulk
* crypto.record.fetchByQuery
* crypto.record.fetchByConstraint
* crypto.record.fetch
* crypto.record.update
* crypto.record.remove
* crypto.record.removeBulk
* crypto.record.index
* crypto.health.check

When calling any of the methods
the port can be instructed to treat
certain status codes as non-errors.
For this purpose a property called
`allowedStatusCodes` must be set
in the message. It can be a number
or an array of numbers representing
the given http status codes.

examples:

```js
const record = await this.bus.importMethod('crypto.record.get')({
    allowedStatusCodes: 404,
    id: msg.id
});
```

or

```js
const record = await this.bus.importMethod('crypto.record.get')({
    allowedStatusCodes: [402, 404],
    id: msg.id
});
```

In case the crypto service returns
a response with a status code marked
as allowed, then the result will be
the error itself but it will not be
logged as such.
