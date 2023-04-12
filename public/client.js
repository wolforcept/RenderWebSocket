
class Client {

    sendMessage = () => console.log('Client not connected yet!')

    constructor(sendMessage) {
        this.sendMessage = sendMessage
    }

    onMessage(args) {
        console.log({ clientOnMessage: args })
        $('.content').append($(`<div style="color:hsl(${args.color}, 96%, 44%);">${args.sender}: ${args.message}</div>`))
        // console.log('message received: ' + args)
        // this.sendMessage(args + "a")
    }
}

function send() {
    if ($('.input').val())
        client.sendMessage({ message: $('.input').val() })
    $('.input').val('')
}

var client = new Client((args) => socket.emit('messaged', JSON.stringify(args)))