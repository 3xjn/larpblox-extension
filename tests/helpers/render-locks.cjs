// Minimal lock adapter for VM-only request tests. Cross-tab behavior is tested
// separately with Chromium's real navigator.locks and separate documents.
module.exports = () => {
  const locks = new Map();
  return {crypto:require('node:crypto').webcrypto, TextEncoder,
    navigator:{locks:{request(name, options, work) {
      const next = (locks.get(name) || Promise.resolve()).catch(()=>{}).then(()=>{
        if (options.signal?.aborted) throw Object.assign(new Error('Aborted'),{name:'AbortError'});
        return work();
      });
      locks.set(name,next); return next;
    }}}};
};
