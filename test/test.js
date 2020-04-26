describe('ConsistentHashRing', function () {
  'use strict';

  const assert = require('assert').strict;
  const ConsistentHashRing = require('../lib/consistent-hashring');

  describe('distribution', function () {
    it('distributes evenly', function () {
      let hashring = new ConsistentHashRing();
      for (let i = 0; i < 1000; i++) {
        hashring.addNode('node_' + i);
      }

      let keyToNode = {};
      let nodeToKeys = {};

      for (let i = 0; i < 100000; i++) {
        let key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if (!keyToNode.hasOwnProperty(key)) {
          let node = hashring.getNode(key);
          keyToNode[key] = node;
          if (nodeToKeys.hasOwnProperty(node)) {
            nodeToKeys[node].push(key);
          } else {
            nodeToKeys[node] = [key];
          }
        }
      }

      const average = data => data.reduce((sum, value) => sum + value) / data.length;
      const standardDeviation = values => Math.sqrt(average(values.map(value => (value - average(values)) ** 2)));
      const nodeLengths = Object.values(nodeToKeys).map(keys => keys.length);

      assert.ok(standardDeviation(nodeLengths) < 20);
    });

    it('only removed node keys re-distribute', function () {
      let hashring = new ConsistentHashRing();
      for (let i = 0; i < 1000; i++) {
        hashring.addNode('node_' + i);
      }

      let keyToNode = {};
      let nodeToKeys = {};

      for (let i = 0; i < 100000; i++) {
        let key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if (!keyToNode.hasOwnProperty(key)) {
          let node = hashring.getNode(key);
          keyToNode[key] = node;
          if (nodeToKeys.hasOwnProperty(node)) {
            nodeToKeys[node].push(key);
          } else {
            nodeToKeys[node] = [key];
          }
        }
      }
      let nodeToRemove = 'node_50';
      hashring.removeNode(nodeToRemove);

      let keyToNodeAfter = {};
      Object.keys(keyToNode).forEach(function (key) {
        keyToNodeAfter[key] = hashring.getNode(key);
      });

      Object.keys(keyToNode).forEach(function (key) {
        let nodeBefore = keyToNode[key];
        let nodeAfter = keyToNodeAfter[key];
        if (nodeBefore !== nodeToRemove) {
          assert.equal(nodeBefore, nodeAfter);
        }
      });
    });
  });
});
