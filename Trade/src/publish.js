
const publish = (top,msg) => {

    return new Promise((resolve,reject) => {

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
                  return reject('Publish Failed');
                }
          
                else
                {
                  return resolve('Sucessful Publish');
                }
                
              })
          
            })


    })
   


}

module.exports = publish;
