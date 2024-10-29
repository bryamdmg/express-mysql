const connection = require('../models/database');

const usuariosGet = (req, res) => {
    const query = 'SELECT * FROM usuarios';
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};

const usuariosPost = (req, res) => {
    const { nombre, email, pass } = req.body;
    const hashedPassword = `SHA2('${pass}', 256)`;
    const query = `INSERT INTO usuarios (nombre, email, pass) VALUES (?, ?, ${hashedPassword})`;
    connection.query(query, [nombre, email, pass], (error, results) => {
        if (error) throw error;
        res.status(201).json({ id: results.insertId, nombre, email});
    });
};

const usuariosPut = (req, res) => {
    const { id } = req.params;
    const { nombre, email, pass } = req.body;

    let query = 'UPDATE usuarios SET nombre = ?, email = ?';

    if (pass) {
        const hashedPassword = `SHA2('${pass}', 256)`;
        query += `, pass = ${hashedPassword}`;
    }

    query += ' WHERE id = ?';
    const values = [nombre, email, id];

    if (pass) {
        connection.query(query, values, (error, results) => {
            if (error) throw error;
            res.json({ msg: 'Usuario actualizado correctamente', id });
        });
    } else {
        connection.query(query, [nombre, email, id], (error, results) => {
            if (error) throw error;
            res.json({ msg: 'Usuario actualizado correctamente', id });
        });
    }
};

const usuariosDelete = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        res.json({ msg: 'Usuario eliminado' });
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
};
