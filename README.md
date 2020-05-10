# consistent-hashring

A simple, pure JS implementation of [consistent hashing.](https://en.wikipedia.org/wiki/Consistent_hashing)

### Build status

[![BuildStatus](https://secure.travis-ci.org/jhurt/consistent-hashring.png?branch=master)](http://travis-ci.org/jhurt/consistent-hashring)

## Install
```bash
npm install consistent-hashring
```

## Basic Usage

#### Create a new hashring
```js
const ConsistentHashRing = require('consistent-hashring');
let hashring = new ConsistentHashRing();
```

#### Add some nodes
```js
for (let i = 0; i < 10; i++) {
  hashring.addNode('node_' + i);
}
```

#### Distribute some keys among the nodes
```js
const nodeForKeyA = hashring.getNode('A');
const nodeForKeyB = hashring.getNode('B');
```
	
#### Remove some nodes, only keys associated with the removed nodes need to be re-hashed:
```js
hashring.removeNode('node_50');
hashring.removeNode('node_90');
```

## Advanced Usage

#### Weight the nodes
By default, 100 replicas of each node are distributed around the ring.
You can change this by passing a `replicaCount` as the second parameter of `addNode`:
```js
hashring.addNode('nodeA', 50); //half the default weight
hashring.addNode('nodeB', 200); //twice the default weight
```

#### Specify the hashing algorithm
By default, a `ConsistentHashRing` uses 
Gary Court's [murmurhash3_32_gc implementation](http://github.com/garycourt/murmurhash-js)
for hashing.
You can modify `test/test.js` and run `npm run test` to see how
well your hash function distributes.
You can inject your own hashing algorithm when instantiating a `ConsistentHashRing`

```js
const myGreatHashFunction = function(str) {
  //return some hash of str
};

let hashring = new ConsistentHashRing(myGreatHashFunction);
```

## License

[MIT](LICENSE)
