Redis => Remote Dictionary Server (It is a key value no-sql database like a Object)

*We dont say it is a database we will name it as a IN-MEMORY Database, bcz it stores inside of RAM, Thats why it is extremely first.(but you have option to write redis inside of disk as well)


#Syntax 1 - think we will make  ablacklist store type thing.
    
   so normal JS code=> 
              const blacklIP={}
              app.get('/some_API', ()=>{
                  if(blacklIP[req.ip]){
                    return error;
                  }
                  //your calculation
                  blalIP[req.id]=true;
              })
       Now here we can use redis except that object bcz this object is more reach than redis. 
        But why we should use redis-
                                  1. Redis is use in scenario where you want to make your code stateless
                                  2. It is kinda inhanment , Like contest API from react so we can share in different file
                                  
    So code in redis =>
                const blacklIP=redis.getStore();
              app.get('/some_API', ()=>{
                  if(blacklIP[req.ip]){
                    return error;
                  }
                  //your calculation
                  blalIP[req.id]=true;
              })


#Start with hello world -
  *There are two things redis server and redis cli, with the help of redis-cli we can connect with server
          redis-cli [enter]
            echo "Hello World" [enter]
#Commands in redis-
       redis-cli [enter] 
       SET november "22" //set keyword + key + value which is need to seperate using space [here we dont need to give court in value but it is good practice], it return ok
       GET november [enter] // it will return 22
       SETNX november "22" // it actually set when not existent that means here it will not set anything, it return integer 0
       SETNX january "11" // it will store and also return integer 1
       GETRANGE january 0 0// return 1 only bcz it is key then start index and end index
       SETRANGE january 0 "55" // start range of an existing key and then upgrade the value
       MGET january november // return datas in a form of array
       MSET march "33" april "11" //key value key value [for multi set]
       DEL january //delete your key
       DEL november march april // all delete togather
       Keys * // shhow you all avalable keys
       FLUSHALL //Remove all keys
       EXPIRE january 60 // it will expire in 60seconds
       TTL january // return us terminated time left (-1 means no key there, -2 means key deleted)
       SETEX december 10 "25" // set and expire it is in given time
       EXIT// exit from server cli
       
// implimentation with NODE
       const Redis=required('ioredis)
       console.log(Redis)// show everything
       
       const redis= new Redis({
         host :"127.0.0.1"
         port :"6379"
       }) // now if we do redis cli it will show our port
       *here actually NODE PROCESS <---> TCP CONNECTION <----> REDIS SERVER
       
       //now for listening
       redis.set("key1", "value1")
       redis.quite() // quit nodejs program
    
//But need that ok reply in redis for that we need to make program assynchronous bcz after all it will talk over TCP
             so,
                 const Redis=required('ioredis)
                 console.log(Redis)// show everything

                 const redis= new Redis({
                   host :"127.0.0.1"
                   port :"6379"
                 }) 
                 async function boot(){
                 const val=await redis.set("key2","value2")
                 console.log(val);
                   redis.quite();
                 }
                boot();
...............................................Similar for get............................................
                 const Redis=required('ioredis)
                 console.log(Redis)// show everything

                 const redis= new Redis({
                   host :"127.0.0.1"
                   port :"6379"
                 }) 
                 async function boot(){
                 const val=await redis.get("key2")
                 console.log(val);
                   redis.quite();
                 }
                boot();
