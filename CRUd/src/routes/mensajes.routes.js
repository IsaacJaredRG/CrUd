import {Router} from 'express'
import pool from '../database.js'

const router = Router();

router.get('/add',(req,res)=>{
    res.render('mensajes/add');
});

router.post('/add', async(req, res)=>{
    try{
        const {remitente, mensaje_corto, receptor, fecha, asunto} = req.body;
        const newMensaje = {
            remitente, mensaje_corto, receptor, fecha, asunto
        }
        await pool.query('INSERT INTO mensajes SET ?', [newMensaje]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/list', async(req,res)=>{
    try{
        const[result]= await pool.query('SELECT * FROM mensajes');
        res.render('mensajes/list',{mensajes:result});

    }
    catch(err){
      res.status(500).json({message:err.message});  
    }
})


router.get('/edit/:id', async(req,res)=>{
    try{
        const {id}=req.params;
        const [mensaje]=await pool.query('SELECT * FROM mensajes WHERE id = ?',[id]);
        const mensajeEdit = mensaje[0];
        res.render('mensajes/edit', {mensaje: mensajeEdit})
    }
    catch(err){
        res.status(500).json({message:err.message});  
    }
})
router.post('/edit/:id', async(req,res)=>{
    try{
        const {remitente, mensaje_corto, receptor, fecha, asunto} = req.body;
        const{id}=req.params;
        const editMensaje = {
            remitente, mensaje_corto, receptor, fecha, asunto
        };
        await pool.query('UPDATE mensajes SET ? WHERE id = ?', [editMensaje, id]);
        res.redirect('/list')
    }
    catch(err){
        res.status(500).json({message:err.message});  
    }
})
router.get('/delete/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        await pool.query('DELETE FROM mensajes WHERE id = ?', [id]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
export default router;