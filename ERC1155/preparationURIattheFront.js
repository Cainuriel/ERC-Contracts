const makeUri = (uri, id) => uri.replace('{id}', id.toString(16).padStart(64, '0'));

> makeUri('ipfs://uri/{id}.json', 250)
// result: 'ipfs://uri/00000000000000000000000000000000000000000000000000000000000000fa.json'