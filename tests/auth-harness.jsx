import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

const pause = () => new Promise(resolve => setTimeout(resolve, 30));
const deferred = () => { let resolve, reject; const promise = new Promise((yes,no) => {resolve=yes;reject=no;}); return {promise,resolve,reject}; };
const user = {id:'reader',email:'reader@example.com'};
const session = {user};
const results = [];
window.addEventListener('unhandledrejection', event => event.preventDefault());
function Probe() { window.authState = useAuth(); return null; }
async function mount(backend) {
  window.backend = backend;
  const root = createRoot(document.getElementById('root'));
  root.render(<AuthProvider><Probe /></AuthProvider>);
  await pause();
  return async () => {root.unmount();await pause();};
}
function check(name, passed) {results.push({name,passed});}
async function run() {
  let unmount = await mount({getSession:async()=>{throw Error('offline');},profile:async()=>({data:null,error:null})});
  check('session failure releases loading state', window.authState.loading === false && window.authState.user === null);
  await unmount();

  unmount = await mount({getSession:async()=>({data:{session},error:null}),profile:async()=>({data:null,error:{message:'Database unavailable'}})});
  check('profile failure releases loading state', window.authState.loading === false && window.authState.user?.id === 'reader');
  window.authCallback('TOKEN_REFRESHED', session);
  await pause();
  check('repeated session events do not leave loading active', window.authState.loading === false);
  await unmount();

  const profile = deferred();
  unmount = await mount({getSession:async()=>({data:{session:null},error:null}),profile:()=>profile.promise});
  const callback = window.authCallback('SIGNED_IN', session);
  check('auth event returns without waiting for the database', callback === undefined);
  await pause();
  window.authCallback('SIGNED_OUT', null);
  await pause();
  profile.resolve({data:{id:'reader',role:'admin'},error:null});
  await pause();
  check('late profile cannot restore admin after sign-out', window.authState.user === null && window.authState.profile === null && !window.authState.isAdmin);
  await unmount();

  const initial = deferred();
  unmount = await mount({getSession:()=>initial.promise,profile:async()=>({data:{id:'reader',role:'admin'},error:null})});
  window.authCallback('SIGNED_OUT',null);
  await pause();
  initial.resolve({data:{session},error:null});
  await pause();
  check('late initial session cannot replace a newer auth event', window.authState.user === null && !window.authState.isAdmin);
  await unmount();
  document.getElementById('result').textContent = JSON.stringify(results);
}
run().catch(error => {document.getElementById('result').textContent=JSON.stringify([{name:error.message,passed:false}]);});
