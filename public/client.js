
class Client {

    sendMessage = () => console.log('Client not connected yet!')

    constructor(sendMessage) {
        this.sendMessage = sendMessage
    }

    onMessage(args) {
        if (args?.grid)
            DATA.grid = args.grid
        if (args?.players)
            DATA.players = args.players
        if (args?.player)
            DATA.player = args.player
        // window.DATA.setGrid(args.grid)
        // console.log(args.grid)
        // $('.content').append($(`<div style="color:hsl(${args.color}, 96%, 44%);">${args.sender}: ${args.message}</div>`))
    }
}

function send() {
    // if ($('.input').val())
    //     client.sendMessage({ message: $('.input').val() })
    // $('.input').val('')
}

const client = new Client((args) => socket.emit('messaged', JSON.stringify(args)))