var Hapi=require('hapi');
var Vision=require('vision');
var Path=require('path');
var Request=require('request');


var server=new Hapi.Server();


server.connection({
    host:'localhost',
    port:Number(process.arg[2] || 8080)
});
server.register(Vision,function(err){
    if(err)
    {
        console.log("Existe error:",err);
    }
});

server.views({
    engines:{
        html:require('handlebars')
    },
    path:Path.join(__dirname,'templates')
});

server.route({
    method:'GET',
    path:'/',
    handler:function(req,res){
        res.view('index')
    }
});

server.route({
    method: 'GET',
    path:'/{username}',
    handler: function(req,res){
        var api_url="http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=E33A9B303907C743C626F4E7C895A8D2&&vanityurl="+
        req.params.name;
        var username=req.params.name;
        Request(api_url, function(error,response, body){
            if(!error && response.statusCode==200){
                body=JSON.parse(body);
                var id=body.response.steaamid;
                res.view('result',{
                    username:username,
                    id:id
                });
            }
        });
    }
});

server.start(()=>{
    console.log('Servidor corriendo en:', server.info.uri);
});