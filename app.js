const fs = require('fs')
const yargs = require("yargs")
const chalk = require("chalk")
const { number } = require('yargs')

function loadData() {
    const buffer = fs.readFileSync("data.json")
    const data = buffer.toString()
    const dataObj = JSON.parse(data)
    return dataObj
}

function saveData(data) {
    fs.writeFileSync("data.json",JSON.stringify(data))
}

function addToDo(id, todo, status) {
    console.log("tt",todo)
    const data = loadData()
    const newToDo = {id, todo, status}
    data.push(newToDo)
    saveData(data)
}

yargs.command({
    command: "list",
    describe: "Listing all todos",
    handler: function() {
        console.log(chalk.green.bold("Listing todos"))
        const data = loadData()
        data.forEach(({id, todo, status}) => console.log(`
        id: ${id}
        todo: ${todo}
        status: ${status}`))
    }
})

yargs.command({
    command: "add",
    describe: "add a new todo",
    builder: {
        todo: {
            describe: "todo content",
            demandOption: true,
            type: "string",
            alias: "t"
        },
        status: {
            describe: "status of your todo",
            demandOption: false,
            type: "boolean",
            default:false,
            alias: "s"
        }
    },
    handler: function(props){
        let idData = loadData()
        let id = 0
        if (idData.length != 0) {
            id = idData[idData.length-1].id
        }
        addToDo(id + 1, props.todo,props.status)
        console.log(chalk.green.bold("Your todo has been added."))
       // console.log(todo, status)
    }
})

yargs.command ({
    command: "delete",
    describe: "deletes one todo item",
    builder: {
        id: {
            describe: "id number",
            demandOption: true,
            type: "number",
        }
    },
    handler: function(builder) {
        console.log(chalk.red.bold("One todo has been deleted."))
        let data = loadData()
        data.splice(builder.id,1)
        saveData(data)
    }
})

yargs.command ({
    command: "delete_all",
    describe: "deletes all todo items",
    handler: function() {
        console.log(chalk.red.bold("All todos have been deleted."))
        let data = loadData()
        data.splice(0,data.length)
        saveData(data)
    }
})

yargs.command ({
    command: "toggle",
    describe: "toggles todos from complete to incomplete and vice versa",
    builder: {
        id: {
            describe: "id number",
            demandOption: true,
            type: "number",
        }
    },
    handler: function(builder) {
        console.log(chalk.green.bold("Your todo has been toggled."))
        let data = loadData()
        data[builder.id].status = !data[builder.id].status
        saveData(data)
    }
})

yargs.command ({
    command: "list_complete",
    describe: "listing completed todos",
    handler: function() {
        console.log(chalk.green.bold("Here are all the completed todos."))
        const data = loadData();
        data.forEach(({id, todo, status}) => {if (status === true) {console.log(`
        id: ${id}
        todo: ${todo}
        status: ${status}`)}})
    }

})

yargs.command ({
    command: "list_incomplete",
    describe: "listing completed todos",
    handler: function() {
        console.log(chalk.magenta.bold("Here are all the incompleted todos."))
        const data = loadData();
        data.forEach(({id, todo, status}) => {if (status === false) {console.log(`
        id: ${id}
        todo: ${todo}
        status: ${status}`)}})
    }

})

yargs.parse()