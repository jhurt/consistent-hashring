/**
 * @author Jason Hurt
 * A simple implementation of consistent hashing.
 */
const bisect = require('./bisect.js');
const murmurhash = require('./murmurhash/murmurhash3_gc.js');

const defaultHashFunction = function (seed) {
  return function (str) {
    return murmurhash.murmurhash3_32_gc(str, seed);
  }
};

class ConsistentHashring {
  constructor(hashFunction) {
    this.hashFunction = hashFunction || defaultHashFunction('consistent-hashring');
    this.keys = [];
    this.nodeHashToNode = {};
    this.nodeToHashes = {};
  }

  *replicaHashes(node, replicaCount = 100) {
    if (this.nodeToHashes.hasOwnProperty(node) && this.nodeToHashes[node].length > 0) {
      for (let i = 0; i < this.nodeToHashes[node].length; i++) {
        yield this.nodeToHashes[node][i];
      }
    } else {
      for (let i = 0; i < replicaCount; i++) {
        yield this.hashFunction(node + '_' + i);
      }
    }
  }

  addNode(node) {
    if (this.nodeToHashes.hasOwnProperty(node)) {
      throw 'Node: ' + node + ' is already present';
    }

    this.nodeToHashes[node] = [];
    for (const nodeHash of this.replicaHashes(node)) {
      if (this.nodeHashToNode.hasOwnProperty(nodeHash)) {
        console.log('Skipping replica, node: ' + node + ' collided with: ' + this.nodeHashToNode[nodeHash]);
      } else {
        this.nodeHashToNode[nodeHash] = node;
        bisect.insortRight(this.keys, nodeHash);
        this.nodeToHashes[node].push(nodeHash);
      }
    }
  }

  removeNode(node) {
    if (!this.nodeToHashes.hasOwnProperty(node)) {
      throw 'Node: ' + node + ' is not present';
    }

    for (const nodeHash of this.replicaHashes(node)) {
      delete this.nodeHashToNode[nodeHash];
      const index = bisect.bisectLeft(this.keys, nodeHash);
      this.keys.splice(index, 1);
    }
    delete this.nodeToHashes[node];
  }

  getNode(key) {
    const keyHash = this.hashFunction(key);
    let start = bisect.bisectRight(this.keys, keyHash);
    if (start === this.keys.length) {
      start = 0;
    }
    return this.nodeHashToNode[this.keys[start]];
  }

}

module.exports = ConsistentHashring;
