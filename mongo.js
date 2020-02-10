const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]



const url =
    `mongodb+srv://saku123:${password}@cluster0-pvp2r.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,    
    //id: 132446376,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    const newName = process.argv[3]
    const newNumber = process.argv[4]

   



    const person = new Person({
        name: newName,
        number: newNumber,
        //id: 1924124,
    })

    person.save().then(response => {
        console.log(`added ${newName} number ${newNumber} to phonebook`);
        mongoose.connection.close();
    })
}


