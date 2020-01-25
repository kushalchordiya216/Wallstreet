const kafka = require("kafka-node")


const publish = (top,msg) => {

   

        try
        {

          
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
                  return 'Publish Failed';
                }
          
                else
                {
                  return 'Sucessful Publish';
                }
                
              })
          
            })
          }
          catch(e)
          {
            console.log(e);
          }


    
   


}

module.exports = publish;
