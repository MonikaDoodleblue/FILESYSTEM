const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

require("dotenv").config();
const port = process.env.PORT;

let todoList = [];

fs.readFile('./todolist.json', (err, data) => {
    if (err) throw err;
    todoList = JSON.parse(data); 
});

app.get('/todos', (req, res) => {
    res.json(todoList);
});

app.get('/todos/:id', (req, res) => {
    const todo = todoList.find(t => t.id === parseInt(req.params.id));
    if (!todo) res.status(404).json('The to-do item was not found');
    res.json(todo);
});

app.post('/todos', (req, res) => {
    const newTodo = {
        id: todoList.length + 1,
        task: req.body.task
    };
    todoList.push(newTodo);
    fs.writeFile('./todolist.json', JSON.stringify(todoList), err => {
        if (err) throw err;
        res.json(newTodo);
    });
});

app.put('/todos/:id', (req, res) => {
    const todo = todoList.find(t => t.id === parseInt(req.params.id));
    if (!todo) res.status(404).send('The to-do item was not found');
    todo.task = req.body.task;
    fs.writeFile('./todolist.json', JSON.stringify(todoList), 'utf-8', err => {
        if (err) throw err;
        res.json(todo);
    });
});

app.delete('/todos/:id', (req, res) => {
    const todoIndex = todoList.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) res.status(404).send('The to-do item was not found');
    todoList.splice(todoIndex, 1);
    fs.writeFile('./todolist.json', JSON.stringify(todoList), err => {
        if (err) throw err;
        res.send('The to-do item was deleted');
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
