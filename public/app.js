console.log('in script js')

const socket=io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
      const {latitude,longitude} = position.coords
      //frontend se event emit kar raha hu
      socket.emit('send-location-from-frontend',{latitude,longitude})
   
    },(error)=>{
          console.error(error);
    },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    })
}
let map = L.map('map',
    
     {
    //center: [28.65195 ,77.23149], for delhi
    center:[0,0],
    zoom: 16
});
//puri duniya ka zero zero coordinate 
console.log("map is ",map.options.center)



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

const marker={};
socket.on('send-location-to-all-connected-user-to-frontend',(data)=>{
  const {id,latitude,longitude}=data;
  console.log(id,latitude,longitude)
  map.setView([latitude,longitude],10)
  console.log("map is  now ",map.options.center) 
   if(marker[id]){
    marker[id].setLatLng([latitude,longitude])
    //this is function for changing lat and lang
    console.log('existing user changes in  their location')
   }
   else{
    marker[id]=L.marker([latitude,longitude]).addTo(map)
    console.log("marker-chache is ",marker);
    console.log(
        'new marker added '
    )
   }

})
socket.on('user-disconnected',(data)=>{
    const {disconnectUserId}=data;
    if(marker[disconnectUserId]){
        map.removeLayer(marker[disconnectUserId])
        delete marker[disconnectUserId]
        console.log('user disconnected successfully',disconnectUserId)
    }

})