const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary'); // ya tienes esto exportado

// Crear post
exports.createPost = async (req, res) => {


    try {
        const { title, slug, content, author, status } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        let image_url = null;
        let image_id = null;

        if (req.file) {
            image_url = req.file.path;       // URL pública de Cloudinary
            image_id = req.file.filename;    // public_id
        }

        const [dbResult] = await db.query(
            `INSERT INTO blog_posts (title, slug, content, image_url, image_id, author, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, content, image_url, image_id, author || 'Anónimo', status || 'draft']
        );

        res.status(201).json({ message: 'Publicación creada', id: dbResult.insertId });
    } catch (err) {
        console.error('Error al crear blog:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todos los posts
exports.getPosts = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT id, title, slug, content, image_url, author, created_at, status
            FROM blog_posts
            ORDER BY created_at DESC
        `);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener blogs:', err);
        res.status(500).json({ message: 'Error al obtener los posts' });
    }
};

// Obtener post por slug
exports.getPostBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const [results] = await db.query(`
            SELECT id, title, slug, content, image_url, author, created_at
            FROM blog_posts
            WHERE slug = ?
            LIMIT 1
        `, [slug]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Error al obtener publicación por slug:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Obtener publicados
exports.getPublishedPosts = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT id, title, slug, content, image_url, author, created_at 
            FROM blog_posts 
            WHERE status = 'published' 
            ORDER BY created_at DESC
        `);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener publicaciones publicadas:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Actualizar post
exports.updatePost = async (req, res) => {


    const { id } = req.params;
    const { title, slug, content, author, status } = req.body;

    try {
        const [rows] = await db.query('SELECT image_id FROM blog_posts WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        let image_url = null;
        let image_id = rows[0].image_id;

        if (req.file) {
            // Eliminar imagen anterior si existe
            if (image_id) {
                await cloudinary.uploader.destroy(image_id);
            }

            image_url = req.file.path;
            image_id = req.file.filename;
        } else {
            // Mantener imagen anterior
            const [img] = await db.query('SELECT image_url FROM blog_posts WHERE id = ?', [id]);
            image_url = img[0].image_url;
        }

        await db.query(
            `UPDATE blog_posts SET
                title = ?, slug = ?, content = ?, image_url = ?, image_id = ?, author = ?, status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [title, slug, content, image_url, image_id, author || 'Anónimo', status || 'draft', id]
        );

        res.json({ message: 'Publicación actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar el blog:', err);
        res.status(500).json({ message: 'Error al actualizar la publicación' });
    }
};

// Eliminar post
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT image_id FROM blog_posts WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const image_id = rows[0].image_id;
        if (image_id) {
            await cloudinary.uploader.destroy(image_id);
        }

        await db.query('DELETE FROM blog_posts WHERE id = ?', [id]);
        res.json({ message: 'Publicación eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar publicación:', err);
        res.status(500).json({ message: 'Error al eliminar el blog' });
    }
};
