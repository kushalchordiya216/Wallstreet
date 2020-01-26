const kafka = require("kafka-node")

//Promise is eesential as one of The publishes fails when they both are executed together
//DOnt knw why

const publish =  (top,msg) => {


return new Promise( (resolve,reject) => {

  const client = new kafka.KafkaClient('localhost:2181');
  const bidProducer = new kafka.Producer(client);
  

payloads = [
    {
      topic:top,
      messages:JSON.stringify(msg),
      partition:0
    }
    ];
  
    bidProducer.on('ready', function(){
  
      bidProducer.send(payloads,function(err,data){
        if(err)
        {
          console.log(err);
          return reject("Failed Publish")
        }
  
        else
        {
          console.log(msg);
          return resolve("Publish Success");

        }
        
      })
  
    })
})
}

module.exports = publish;
