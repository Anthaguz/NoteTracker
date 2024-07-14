const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC));
let contadorDeNotas = 0;

let items = [
//     {
//         id: 1,
//         title: 'First Item',
//         content: 'This is the content of the first item.',
//         creationDate: '2024-07-01',
//         lastModification: '2024-07-02',
//         tags: ['tag1', 'tag2']
//     },
//     {
//         id: 2,
//         title: 'Second Item',
//         content: 'This is the content of the second item.',
//         creationDate: '2024-07-03',
//         lastModification: '2024-07-04',
//         tags: ['tag3', 'tag4']
//     },
];

//Listar todas las notas
app.get('/', (req, res) => {
    console.log('GET /');
    res.render('index', { items });
});

//Listar todas las notas
app.get('/notas', (req, res) => {
    console.log('GET /');
    res.render('index', { items });
});

//Cargar la pagina para editar una nota
app.get('/notas/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === itemId);
    if (item) {
        console.log(`GET /notas/${itemId} - Editing existing item`);
        res.render('edit', { item });
    } else if (itemId == 0) {
        console.log(`GET /notas/${itemId} - Creating new item item`);
        res.render('add');
    } else {
        console.log(`GET /notas/${itemId} - Item not found`);
        res.status(404).send('Item not found');
    }
});

//Aqui me di cuenta que no puedo enviar un PUT o DELETE desde un formulario, por lo que tuve que cambiarlo a POST
// Agregar una nueva nota
app.post('/add', (req, res) => {
    contadorDeNotas++;
    const newItem = {
        id: contadorDeNotas,
        title: req.body.title,
        content: req.body.content,
        creationDate: new Date().toISOString().split('T')[0],
        lastModification: new Date().toISOString().split('T')[0],
        tags: req.body.tags.split(',').map(tag => tag.trim())
    };
    items.push(newItem);
    console.log(`POST /add - New item id= ${newItem.id} - ${newItem.title}`);
    res.redirect('/');
});

// Eliminar una nota
app.post('/delete/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    items = items.filter(item => item.id !== itemId);
    console.log(`POST /delete/${itemId} - Deleting item id= ${itemId}`);    
    res.redirect('/');
});

// Actualizar una nota
app.post('/update/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.title = req.body.title;
        item.content = req.body.content;
        item.tags = req.body.tags.split(',').map(tag => tag.trim());
        item.lastModification = new Date().toISOString().split('T')[0];
        console.log(`POST /update/${itemId} - Updated item id = ${itemId} - ${item.title}`);
        res.redirect('/');
    } else {
        console.log(`POST /update/${itemId} - Item not found`);
        res.status(404).send('Item not found');
    }
});


app.listen(PORT, () => {
    console.log(`👌 Server listening on http://localhost:${PORT}`);
});