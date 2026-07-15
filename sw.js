const CACHE='ryanfit-v1-1-appfeel';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./treadmill.jpg", "./stairmill.jpg", "./leg_press.jpg", "./plate_leg_press.jpg", "./leg_extension.jpg", "./leg_curl.jpg", "./hip_abductor.jpg", "./glute_machine.jpg", "./calf_raise.jpg", "./functional_trainer.jpg", "./lat_pulldown.jpg", "./pec_deck.jpg", "./multi_press.jpg", "./arm_machine.jpg", "./assisted_chin.jpg", "./smith.jpg", "./bench.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request,{cache:'no-store'}).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return r;
    }).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html')))
  );
});
