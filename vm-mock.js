// Mock implementation of Node's vm module
module.exports = {
  runInThisContext: function(code) {
    // Instead of using vm, we'll use Function constructor
    // This is a simplified version that should work for basic cases
    return new Function(code)();
  },
  createContext: function() {
    return {};
  },
  runInContext: function(code, context) {
    return new Function(code)();
  }
}; 