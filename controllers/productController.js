const db = require('../config/db');

exports.getAllProductsAdmin = (req, res) => {

    db.query('SELECT * FROM products ORDER BY id DESC')
        .then(([result]) => {
            // return res.status(200).json(result)
            res.render('dashboard/productsAdmin', { products: result });
        }).catch((err) => {
            console.log('Error fetching data')
        });

    // db.query('SELECT * FROM products', (err, results) => {
    //     if (err) throw err;
    //     res.render('products', { products: results });
    // });
};

exports.getAllProducts = (req, res) => {

    db.query('SELECT * FROM products ORDER BY id DESC')
        .then(([result]) => {
            // return res.status(200).json(result)
            res.render('products', { products: result });
        }).catch((err) => {
            console.log('Error fetching data')
        });

    // db.query('SELECT * FROM products', (err, results) => {
    //     if (err) throw err;
    //     res.render('products', { products: results });
    // });
};

exports.getAddProduct = (req, res) => {
    res.render('addProduct');
};

exports.postAddProduct = (req, res) => {
    const { title, name, department, position } = req.body;
    db.query('INSERT INTO products (title, name, department, position) VALUES (?, ?, ?, ?)', [title, name, department, position])
        .then(([result]) => {
            if (result) {
                // res.status(201).json({ 'data': req.body })
                console.log(req.body)
                res.redirect('/products');
            }
        }).catch((err) => {
            console.log('Error Post data')
        });

    // db.query('INSERT INTO products (title, name, department, position) VALUES (?, ?, ?, ?)', [title, name, department, position], (err, result) => {
    //     if (err) throw err;
    //     res.redirect('/products');
    //      res.send('OK')
    // });
};

exports.getEditProduct = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id])
        .then(([results]) => {
            res.render('dashboard/editProduct', { product: results[0] });
        }).catch((err) => {
            if (err) throw err;
        });

    // db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    //     if (err) throw err;
    //     res.render('editProduct', { product: results[0] });
    // });
};

exports.postEditProduct = (req, res) => {
    const { id } = req.params;
    const { title, name, department, position } = req.body;
    db.query('UPDATE products SET title = ?, name = ?, department = ?, position = ? WHERE id = ?', [title, name, department, position, id])
        .then(([result]) => {
            res.redirect('/products/admin')
        }).catch((err) => {
            if (err) throw err
        });

    // db.query('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?', [title, name, department, position, id], (err, result) => {
    //     if (err) throw err;
    //     res.redirect('/products');
    // });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id])
        .then(([result]) => {
            res.redirect('/products/admin');
        }).catch((err) => {
            if (err) throw err;
        });

    // db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    //     if (err) throw err;
    //     res.redirect('/products');
    // });
};
