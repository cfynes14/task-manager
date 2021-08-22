require('../src/db/mongoose');
const { countDocuments } = require('../src/models/task');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('611cb67459a4382fd04ade1a').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count

}

deleteTaskAndCount('611baebcde04380594d77892').then((count) => {
    console.log(count)
}).catch((er) => {
    console.log(er)
})