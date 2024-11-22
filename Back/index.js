// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

//const https = require('https');
const express = require('express');
const multer  = require('multer');
const db = require('./config/db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

// Storage Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
});
const upload = multer({ storage: storage });

// Users Routes
{
    // Route to get all Users
    app.get("/api/users", (req,res)=>{
    db.query("SELECT * FROM users",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get all possible Secondary Users
    app.get("/api/users/not=:id", (req,res)=>{

        const id = req.params.id;

        db.query("SELECT * FROM users WHERE id != ?", [id],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Users by limit
    app.get("/api/users/page=:page/perPage=:perPage/search=:search", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;
    let search = '';
    if (req.params.search !== "null") {
        search = `%${req.params.search}%`;
    } else {
        search = `%`;
    }

    db.query(`SELECT * FROM users WHERE id LIKE ? OR nickname LIKE ? OR realname LIKE ? LIMIT ?, ?`, [search, search, search, page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });


    // Route to get one User by id
    app.get("/api/users/:id", (req,res)=>{

    const id = req.params.id;
    db.query(`SELECT * FROM users WHERE id = ?`, id, 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });


    // Route for creating a User
    app.post('/api/users/create', (req,res)=> {

    const nickname = req.body.nickname;
    const password = req.body.password;
    const realname = req.body.realname;
    const registration = req.body.registration;

    db.query("INSERT INTO users (nickname, password, realname, registration ) VALUES (?,?,?,?)",
        [nickname, password, realname, registration],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }});
    });


    // Route to update a User
    app.patch('/api/users/:id/update',(req,res)=>{
    const id = req.params.id;

    const nickname = req.body.nickname;
    const password = req.body.password;
    const realname = req.body.realname;
    const registration = req.body.registration;

    db.query("UPDATE users SET nickname = ?, password = ?, realname = ? registration = ? WHERE id = ?",
        [nickname, password, realname, registration, id],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }
        });    
    });


    // Route to delete a User
    app.delete('/api/users/:id/delete',(req,res)=>{
    const id = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", id,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });
}

// Entities Routes
{
    // Route to get all Entities
    app.get("/api/entities", (req,res)=>{
    db.query("SELECT * FROM entities", (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to get one Entities by limit
    app.get("/api/entities/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query('SELECT entities.id, entities.code, entities.name, entities.phone, zone.name as zone_name, zone.color as zone_color FROM entities LEFT JOIN zone ON zone.id = entities.id_zone_adress WHERE entities.code LIKE ? OR entities.name LIKE ? OR zone.name LIKE ? LIMIT ?, ?', [search, search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
        });
    });

    // Route to get one Entity by id
    app.get("/api/entities/:id", (req,res)=>{

    const id = req.params.id;
    db.query("SELECT entities.*, zone.name as zone_name, zone.color as zone_color FROM entities LEFT JOIN zone ON zone.id = entities.id_zone_adress WHERE entities.id = ?", id, 
        (err,result)=>{
        if(err) {
            //console.log(err)
            console.log(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });


    // Route for creating a Entity
    app.post('/api/entities/create', (req,res)=> {

    const code = req.body.code;
    const name = req.body.name;
    const phone = req.body.phone;
    const name_manager = req.body.name_manager;
    const phone_manager = req.body.phone_manager;

    const cep_adress = req.body.cep_adress;
    const street_adress = req.body.street_adress;
    const number_adress = req.body.number_adress;
    const district_adress = req.body.district_adress;
    const zone_adress = req.body.zone_adress;

    console.log(zone_adress)

    db.query("INSERT INTO entities (code, name, phone, name_manager, phone_manager, cep_adress, street_adress, number_adress, district_adress, id_zone_adress) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [code, name, phone, name_manager, phone_manager,cep_adress, street_adress, number_adress, district_adress, zone_adress],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }
        });
    })


    // Route to update a Entity
    app.patch('/api/entities/:id/update',(req,res)=>{
    const id = req.params.id;

    const code = req.body.code;
    const name = req.body.name;
    const phone = req.body.phone;
    const name_manager = req.body.name_manager;
    const phone_manager = req.body.phone_manager;

    const cep_adress = req.body.cep_adress;
    const street_adress = req.body.street_adress;
    const number_adress = req.body.number_adress;
    const district_adress = req.body.district_adress;
    const zone_adress = req.body.zone_adress;

    db.query("UPDATE entities SET code = ?, name = ?, phone = ?, name_manager = ?, phone_manager = ?, cep_adress = ?, street_adress = ?, number_adress = ?, district_adress = ?, id_zone_adress = ? WHERE id = ?",
        [code, name, phone, name_manager, phone_manager, cep_adress, street_adress, number_adress, district_adress, zone_adress, id],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    })

    // Route to delete a Entity
    app.delete('/api/entities/:id/delete',(req,res)=>{
    const id = req.params.id;

    db.query("DELETE FROM entities WHERE id = ?", id,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to get all Zones
    app.get("/api/zones/all", (req,res)=>{
    db.query("SELECT * FROM zone",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });
}

// Machines Routes
{
    // Route to get all Machines
    app.get("/api/machines", (req,res)=>{
    db.query("SELECT * FROM machines", (err,result)=>{
        if(err) {
            //console.log(err);
            res.send(err);
        } else{
            //console.log(result);
            res.send(result)
        }});
    });

    // Route to get all Machines Activateds and Not in Maintenance
    app.get("/api/machines/activateds", (req,res)=>{
        db.query("SELECT * FROM machines WHERE maintenance = 0 AND id_status_m = 1", (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err);
            } else{
                //console.log(result);
                res.send(result)
            }});
        });

    // Route to get all Machines from a Entity
    app.get("/api/machines/entity/:id", (req,res)=>{
    
    const id = req.params.id;
    db.query("SELECT * FROM machines WHERE id_entities_m = ? AND maintenance = 0 AND id_status_m = 1", id, (err,result)=>{
        if(err) {
            //console.log(err);
            res.send(err);
        } else{
            //console.log(result);
            res.send(result)
        }});
    });

    // Route to get one Machine by limit
    app.get("/api/machines/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query(`SELECT machines.id, machines.num_serial, machines.model, entities.name AS entities_name, type_machine.name AS type_machine_name, status_machine.name as status_name, status_machine.color as status_color FROM machines LEFT JOIN entities ON machines.id_entities_m = entities.id LEFT JOIN type_machine ON machines.id_type_m = type_machine.id LEFT JOIN status_machine ON machines.id_status_m = status_machine.id WHERE machines.num_serial LIKE ? OR machines.model LIKE ? OR entities.name LIKE ? OR type_machine.name LIKE ? OR status_machine.name LIKE ? LIMIT ?, ?`, [search, search, search, search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err)
            } else{
                //console.log(result);
                res.send(result)
            }
        });
    });

    // Route to get one Machine by id
    app.get("/api/machines/:id", (req,res)=>{

    const id = req.params.id;
    db.query("SELECT machines.*, status_machine.name as status_name, status_machine.color as status_color, entities.name AS entities_name, entities.code AS entities_code, type_machine.name AS type_machine_name FROM machines LEFT JOIN entities ON machines.id_entities_m = entities.id LEFT JOIN type_machine ON machines.id_type_m = type_machine.id LEFT JOIN status_machine ON machines.id_status_m = status_machine.id WHERE machines.id = ?", id, 
        (err,result)=>{
        if(err) {
            //console.log(err);
            res.send(err);
        } else{
            //console.log(result);
            res.send(result);
        }});
    });

    // Route to get all Machine Types
    app.get("/api/machines-types", (req,res)=>{
    db.query("SELECT * FROM type_machine ORDER BY id", (err,result)=>{
        if(err) {
            //console.log(err);
            res.send(err);
        } else{
            //console.log(result);
            res.send(result);
        }});
    });

    // Route for creating a Machine
    app.post('/api/machines/create', (req,res)=> {

    const num_serial = req.body.num_serial;
    const model = req.body.model;
    const description = req.body.description;
    const id_type = req.body.id_type;
    const id_entity = req.body.id_entity;
    const status = req.body.status;

    db.query("INSERT INTO machines (id_entities_m, num_serial, model, id_type_m, description, id_status_m) VALUES (?,?,?,?,?,?)",
        [id_entity, num_serial, model, id_type, description, status],
        (err,result)=>{
        if(err) {
            //console.log(err);
            res.send(err);
        } else{
            //console.log(result);
            res.send(result);
        }
        });
    })


    // Route to update a Machine
    app.patch('/api/machines/:id/update',(req,res)=>{
    const id = req.params.id;

    const num_serial = req.body.num_serial;
    const model = req.body.model;
    const description = req.body.description;
    const id_type_m = req.body.id_type_m;
    const id_entities_m = req.body.id_entities_m;
    const status = req.body.status;

    db.query("UPDATE machines SET num_serial = ?, model = ?, description = ?, id_type_m = ?, id_entities_m = ?, id_status_m = ? WHERE id = ?",
        [num_serial, model, description, id_type_m, id_entities_m, status, id],
        (err,result)=>{
        if(err) {
            //console.log(err);
            res.ye3send(err);
        } else{
            //console.log(result);
            res.send(result);
        }});
    })

    // Route to update Machine Maintenance to 'ON' or 'OFF'
    app.patch('/api/machines/:id/update/maintenance',(req,res)=>{
        const id = req.params.id;

        const maintenance = req.body.maintenance;
    
        db.query("UPDATE machines SET maintenance = ? WHERE id = ?",
            [maintenance, id],
            (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err);
            } else{
                //console.log(result);
                res.send(result);
            }});
        })
    
    // Route to GET Document Deactivate Machine
    app.get("/api/records/machines/:id/deactivate/doc", (req,res)=>{
        
        const id = req.params.id;
        db.query("SELECT max(date), deactivate_doc FROM historic_machines WHERE id_machine_h = ? AND action LIKE 'Desativado'", id,
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
}

// Historic Machines
{
    // Route to get all Records
    app.get("/api/records", (req,res)=>{
    db.query("SELECT * FROM historic_machines",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });
    
    // Route to get Records by limit
    app.get("/api/records/page=:page/perPage=:perPage/search=:search", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;
    let search = '';
    if (req.params.search !== "null") {
        search = `%${req.params.search}%`;
    } else {
        search = `%`;
    }

    db.query("SELECT historic_machines.*, machines.id as machine_id, machines.num_serial as machine_serial, entities.name as entity FROM historic_machines LEFT JOIN machines ON machines.id = historic_machines.id_machine_h LEFT JOIN entities ON entities.id = historic_machines.id_entity_h WHERE historic_machines.id LIKE ? OR historic_machines.date LIKE ? OR historic_machines.action LIKE ? OR entities.name LIKE ? OR machines.num_serial LIKE ? ORDER BY historic_machines.id DESC LIMIT ?, ?", [search, search, search, search, search, page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route for creating a Historic
    app.post('/api/records/create', (req,res)=> {

    const id_machine = req.body.id_machine;
    const id_entity = req.body.id_entity;
    const action = req.body.action;
    const observation = req.body.observation;
    console.log(observation);


    db.query("INSERT INTO historic_machines (id_machine_h, id_entity_h, action, observation) VALUES (?,?,?,?)",
        [id_machine, id_entity, action, observation],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }});
    })
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Deactivations Routes
{
    // Route to get all Deactivations
    app.get("/api/deactivations", (req,res)=>{
    db.query("SELECT * FROM deactivation",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get One Deactivation
    app.get("/api/deactivations/:id/:year", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - PT`;

        db.query("SELECT * FROM deactivation WHERE id = ?", [cod],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
        });
    });

    // Route to get all Deactivations
    app.get("/api/deactivations/this-year", (req,res)=>{
    db.query("SELECT * FROM deactivation WHERE YEAR(deactivation.date) = YEAR(CURDATE())",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get Deactivations document null
    app.get("/api/deactivations/doc-null", (req,res)=>{

    db.query(`SELECT deactivation.*, machines.num_serial as machine_serial, machines.model as machine_model FROM deactivation JOIN machines ON machines.id = deactivation.id_machine_d WHERE deactivation.document IS NULL`, 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get Deactivations by limit
    app.get("/api/deactivations/page=:page/perPage=:perPage/search=:search", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;
    let search = '';
    if (req.params.search !== "null") {
        search = `%${req.params.search}%`;
    } else {
        search = `%`;
    }

    db.query(`SELECT deactivation.*, machines.num_serial as machine_serial, machines.model as machine_model FROM deactivation JOIN machines ON machines.id = deactivation.id_machine_d WHERE deactivation.id LIKE ? OR machines.num_serial LIKE ? OR machines.model LIKE ? OR deactivation.date LIKE ? LIMIT ?, ?`, [search, search, search, search, page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route for creating a Deactivation
    app.post('/api/deactivations/create/', (req,res)=> {

    const id = req.body.id;
    const machine = req.body.machine;
    const problem = req.body.problem;

    db.query("INSERT INTO deactivation (id, id_machine_d, date, problem) VALUES (?,?,CURDATE(),?)",
        [id, machine, problem],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }});
    });

    // Route to ADD Document Deactivation Machine
    app.patch('/api/deactivations/create/doc/:id/:year', upload.single('file'), (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - PT`;

        const documentPath = req.file.path; // Caminho temporário do arquivo enviado pelo multer
        const finalFilePath = `./uploads/deactivations/GA_DMEI_N_${id}_${year}_PT.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }
    
        // Agora você pode salvar o caminho final no banco de dados em vez do arquivo em binário
        db.query("UPDATE deactivation SET document = ? WHERE id = ?",
            [finalFilePath, cod],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    })

    // Route to Get Document
    app.get("/api/deactivations/document", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "deactivations", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                //console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Document Deactivation
    app.delete('/api/deactivations/delete/doc/:id/:year', (req, res) => {
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - PT`;

        const filePath = path.join(__dirname, "uploads", "deactivations", `GA_DMEI_N_${id}_${year}_PT.pdf`);
        console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE deactivation SET document = NULL WHERE id = ?", [cod], (err, result) => {
                if (err) {
                    //console.log(err);
                    return res.send(err);
                } else {
                    //console.log(result);
                    res.send(result);
                }
            });
        });
    });

    // Route to delete a Deactivation
    app.delete('/api/deactivateds/:id/:year/delete',(req,res)=>{
    const id = req.params.id;
    const year = req.params.year;

    const cod = `GA/DMEI Nº ${id} / ${year} - PT`;

    db.query("DELETE FROM deactivation WHERE id = ?", cod,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to Deactivate Machine
    app.patch('/api/machines/:id/deactivate', (req,res)=>{
        const id = req.params.id;
    
        db.query("UPDATE machines SET id_status_m = 0, maintenance = 0 WHERE id = ?",
            [id],
            (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err);
            } else{
                //console.log(result);
                res.send(result);
            }});
        })
}

// Dispatch Routes
{
    // Route to get all Dispatches
    app.get("/api/dispatches", (req,res)=>{
        db.query("SELECT * FROM dispatch",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get all Dispatches
    app.get("/api/dispatches/this-year", (req,res)=>{
        db.query("SELECT * FROM dispatch WHERE YEAR(dispatch.date) = YEAR(CURDATE())",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Dispatches document null
    app.get("/api/dispatches/doc-null", (req,res)=>{

        db.query(`SELECT * FROM dispatch WHERE dispatch.document IS NULL`, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get One Dispatch
    app.get("/api/dispatches/:id/:year", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - MD`;

        db.query(`SELECT * FROM dispatch WHERE id = ?`,cod, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get Dispatches Itens
    app.get("/api/dispatches/:id/:year/itens", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - MD`;

        db.query(`SELECT * FROM item_dispatch WHERE id_dispatch_dis = ?`,cod, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Dispatches by limit
    app.get("/api/dispatches/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query(`SELECT * FROM dispatch WHERE id LIKE ? OR date LIKE ? LIMIT ?, ?`, [search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route for creating a Dispatch
    app.post('/api/dispatches/create/', (req,res)=> {
        const id = req.body.id;
        const observation = req.body.observation;
    
        db.query("INSERT INTO dispatch (id, date, observation) VALUES (?,CURDATE(),?)",[id, observation],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });
    
    // Route for creating a Dispatch Item
    app.post('/api/dispatches/create/item', (req,res)=> {
        const id_dispatch = req.body.id_dispatch;
        const id_machine = req.body.id_machine;
    
        db.query("INSERT INTO item_dispatch (id_dispatch_dis, id_machine_dis) VALUES (?,?)",[id_dispatch,id_machine],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });

    // Route to ADD Document Dispatch
    app.patch('/api/dispatches/create/doc/:id/:year', upload.single('file'), (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - MD`;

        const documentPath = req.file.path; // Caminho temporário do arquivo enviado pelo multer
        const finalFilePath = `./uploads/dispatches/GA_DMEI_N_${id}_${year}_MD.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE dispatch SET document = ? WHERE id = ?",
            [finalFilePath, cod],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Get Document
    app.get("/api/dispatches/document", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "dispatches", fileName);
        //console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                //console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Document Dispatch
    app.delete('/api/dispatches/delete/doc/:id/:year', (req, res) => {
        const id = req.params.id;
        const year = req.params.year;
        //console.log(id, year);

        const cod = `GA/DMEI Nº ${id} / ${year} - MD`;

        const filePath = path.join(__dirname, "uploads", "dispatches", `GA_DMEI_N_${id}_${year}_MD.pdf`);
        //console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE dispatch SET document = NULL WHERE id = ?", [cod], (err, result) => {
                if (err) {
                    //console.log(err);
                    return res.send(err);
                } else {
                    //console.log(result);
                    res.send(result);
                }
            });
        });
    });

    // Route to delete the Dispatch Itens
    app.delete('/api/dispatches/:id/:year/delete-itens',(req,res)=>{
    const id = req.params.id;
    const year = req.params.year;

    const cod = `GA/DMEI Nº ${id} / ${year} - MD`;

        db.query("DELETE FROM item_dispatch WHERE id_dispatch_dis = ?", cod,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to delete a Dispatch
    app.delete('/api/dispatches/:id/:year/delete',(req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - MD`;
    
            db.query("DELETE FROM dispatch WHERE id = ?", cod,
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });

    // Route to Dispatch Machine
    app.patch('/api/machines/:id/dispatch', (req,res)=>{
        const id = req.params.id;
    
        db.query("UPDATE machines SET id_entities_m = 330 WHERE id = ?",
            [id],
            (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err);
            } else{
                //console.log(result);
                res.send(result);
            }});
        })
}

// Delivery Routes
{
    // Route to get all Deliveries
    app.get("/api/deliveries", (req,res)=>{
        db.query("SELECT * FROM delivery",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get all Deliveries
    app.get("/api/deliveries/this-year", (req,res)=>{
        db.query("SELECT * FROM delivery WHERE YEAR(delivery.date) = YEAR(CURDATE())",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Deliveries document null
    app.get("/api/deliveries/doc-null", (req,res)=>{
        db.query(`SELECT * FROM delivery WHERE delivery.document IS NULL`, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get One Delivery
    app.get("/api/deliveries/:id/:year", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - REE`;

        db.query(`SELECT * FROM delivery WHERE id = ?`,cod, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Deliveries Itens
    app.get("/api/deliveries/:id/:year/itens", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - REE`;

        db.query(`SELECT * FROM item_delivery WHERE id_delivery_del = ?`,cod, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Deliveries by limit
    app.get("/api/deliveries/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query(`SELECT * FROM delivery WHERE id LIKE ? OR date LIKE ? LIMIT ?, ?`, [search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route for creating a Delivery
    app.post('/api/deliveries/create/', (req,res)=> {
        const id = req.body.id;
        const id_entity = req.body.id_entity;
        const observation = req.body.observation;
        const text_machines = req.body.text_machines;
    
        db.query("INSERT INTO delivery (id, date, id_entities_del, text_machines, observation) VALUES (?,CURDATE(),?,?,?)",[id, id_entity, text_machines, observation],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });
    
    // Route for creating a Delivery Item
    app.post('/api/deliveries/create/item', (req,res)=> {
        const id_delivery = req.body.id_delivery;
        const id_machine = req.body.id_machine;
    
        db.query("INSERT INTO item_delivery (id_delivery_del, id_machine_del) VALUES (?,?)",[id_delivery, id_machine],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });

    // Route to ADD Document Delivery
    app.patch('/api/deliveries/create/doc/:id/:year', upload.single('file'), (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - REE`;

        const documentPath = req.file.path; // Caminho temporário do arquivo enviado pelo multer
        const finalFilePath = `./uploads/deliveries/GA_DMEI_N_${id}_${year}_REE.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE delivery SET document = ? WHERE id = ?",
            [finalFilePath, cod],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Get Document
    app.get("/api/deliveries/document", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "deliveries", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                //console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Document Deliveries
    app.delete('/api/deliveries/delete/doc/:id/:year', (req, res) => {
        const id = req.params.id;
        const year = req.params.year;
        //console.log(id, year);

        const cod = `GA/DMEI Nº ${id} / ${year} - REE`;

        const filePath = path.join(__dirname, "uploads", "deliveries", `GA_DMEI_N_${id}_${year}_REE.pdf`);
        //console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE delivery SET document = NULL WHERE id = ?", [cod], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        });
    });

    // Route to delete a Delivery
    app.delete('/api/deliveries/:id/:year/delete',(req,res)=>{
    const id = req.params.id;
    const year = req.params.year;

    const cod = `GA/DMEI Nº ${id} / ${year} - REE`;

        db.query("DELETE FROM item_delivery WHERE id_delivery_del = ?", cod,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});

        db.query("DELETE FROM delivery WHERE id = ?", cod,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to Delivery Machine
    app.patch('/api/machines/:id/delivery', (req,res)=>{
        const id = req.params.id;
        const id_entity = req.body.id_entity;
    
        db.query("UPDATE machines SET id_entities_m = ? WHERE id = ?",
            [id_entity, id],
            (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err);
            } else{
                //console.log(result);
                res.send(result);
            }});
        })
}

// Substitution Routes
{
    // Route to get all Substitutions
    app.get("/api/substitutions", (req,res)=>{
        db.query("SELECT * FROM substitution",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get all Substitutions
    app.get("/api/substitutions/this-year", (req,res)=>{
        db.query("SELECT * FROM substitution WHERE YEAR(substitution.date) = YEAR(CURDATE())",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Susbtitutions document null
    app.get("/api/substitutions/doc-null", (req,res)=>{

        db.query(`SELECT * FROM substitution WHERE substitution.document IS NULL`, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get ONE Substitution
    app.get('/api/substitutions/:id/:year',(req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - SE`;
    
            db.query("SELECT * FROM substitution WHERE id = ?", cod,
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });

    // Route to get Substitutions by limit
    app.get("/api/substitutions/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query(`SELECT * FROM substitution WHERE id LIKE ? OR date LIKE ? LIMIT ?, ?`, [search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route for creating a Substitution
    app.post('/api/substitutions/create/', (req,res)=> {
        const id = req.body.id;
        const id_machine_in = req.body.id_machine_in;
        const id_machine_out = req.body.id_machine_out;
        const id_entity = req.body.id_entity;
        const responsible = req.body.responsible;
    
        db.query("INSERT INTO substitution (id, date, id_entities_sub, id_machine_in_sub, id_machine_out_sub, responsible) VALUES (?,CURDATE(),?,?,?,?)",[id, id_entity, id_machine_in, id_machine_out, responsible],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });

    // Route to ADD Document Substitution
    app.patch('/api/substitutions/create/doc/:id/:year', upload.single('file'), (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - SE`;

        const documentPath = req.file.path; // Caminho temporário do arquivo enviado pelo multer
        const finalFilePath = `./uploads/substitutions/GA_DMEI_N_${id}_${year}_SE.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE substitution SET document = ? WHERE id = ?",
            [finalFilePath, cod],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Get Document
    app.get("/api/substitutions/document", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "substitutions", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                //console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Document Substitutions
    app.delete('/api/substitutions/delete/doc/:id/:year', (req, res) => {
        const id = req.params.id;
        const year = req.params.year;
        //console.log(id, year);

        const cod = `GA/DMEI Nº ${id} / ${year} - SE`;

        const filePath = path.join(__dirname, "uploads", "substitutions", `GA_DMEI_N_${id}_${year}_SE.pdf`);
        //console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE substitution SET document = NULL WHERE id = ?", [cod], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        });
    });

    // Route to delete a Substitution
    app.delete('/api/substitutions/:id/:year/delete',(req,res)=>{
    const id = req.params.id;
    const year = req.params.year;

    const cod = `GA/DMEI Nº ${id} / ${year} - SE`;

        db.query("DELETE FROM substitution WHERE id = ?", cod,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to Substitute Machine
    app.patch('/api/machines/:id/substitute', (req,res)=>{
        const id = req.params.id;
        const id_entity = req.body.id_entity;
    
        db.query("UPDATE machines SET id_entities_m = ? WHERE id = ?",
            [id_entity, id],
            (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err);
            } else{
                //console.log(result);
                res.send(result);
            }});
        })
}

// Loan Routes
{
    // Route to get all Loans
    app.get("/api/loans", (req,res)=>{
        db.query("SELECT * FROM loan",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get all Loans
    app.get("/api/loans/this-year", (req,res)=>{
        db.query("SELECT * FROM loan WHERE YEAR(loan.date_loan) = YEAR(CURDATE())",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Loans document-loan null
    app.get("/api/loans/doc-null", (req,res)=>{

        db.query(`SELECT * FROM loan WHERE loan.document_loan IS NULL`, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Loans document-return null
    app.get("/api/loans/return-null", (req,res)=>{

        db.query(`SELECT * FROM loan WHERE loan.document_loan IS NOT NULL AND loan.document_return IS NULL`, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get ONE Loan
    app.get("/api/loans/:id/:year", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        db.query(`SELECT * FROM loan WHERE id = ?`,cod, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Loans Itens
    app.get("/api/loans/:id/:year/itens", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        db.query(`SELECT * FROM item_loan WHERE id_loan_loan = ?`,cod, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Loans by limit
    app.get("/api/loans/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query(`SELECT * FROM loan WHERE id LIKE ? OR date_loan LIKE ? LIMIT ?, ?`, [search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route for creating a Loan
    app.post('/api/loans/create/', (req,res)=> {
        const id = req.body.id;
        const id_entity = req.body.id_entity;
        const text_machines = req.body.text_machines;
        const responsible = req.body.responsible;
    
        db.query("INSERT INTO loan (id, date_loan, id_entities_loan, text_machines, responsible) VALUES (?,CURDATE(),?,?,?)",[id, id_entity, text_machines, responsible],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });
    
    // Route for creating a Loan Item
    app.post('/api/loans/create/item', (req,res)=> {
        const id_loan = req.body.id_loan;
        const id_machine = req.body.id_machine;
    
        db.query("INSERT INTO item_loan (id_loan_loan, id_machine_loan) VALUES (?,?)",[id_loan, id_machine],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });

    // Route to Get Document
    app.get("/api/loans/document", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "loans", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                //console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });
    
    // Route to ADD Document Loan
    app.patch('/api/loans/create/doc-loan/:id/:year', upload.single('file'), (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        const documentPath = req.file.path; // Caminho temporário do arquivo enviado pelo multer
        const finalFilePath = `./uploads/loans/GA_DMEI_N_${id}_${year}_TE.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE loan SET document_loan = ? WHERE id = ?",
            [finalFilePath, cod],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Delete Document Loan
    app.delete('/api/loans/delete/doc-loan/:id/:year', (req, res) => {
        const id = req.params.id;
        const year = req.params.year;
        //console.log(id, year);

        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        const filePath = path.join(__dirname, "uploads", "loans", `GA_DMEI_N_${id}_${year}_TE.pdf`);
        //console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE loan SET document_loan = NULL WHERE id = ?", [cod], (err, result) => {
                if (err) {
                    //console.log(err);
                    return res.send(err);
                } else {
                    //console.log(result);
                    res.send(result);
                }
            });
        });
    });
    
    // Route to ADD Document Return
    app.patch('/api/loans/create/doc-return/:id/:year', upload.single('file'), (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        const documentPath = req.file.path; // Caminho temporário do arquivo enviado pelo multer
        const finalFilePath = `./uploads/loans/GA_DMEI_N_${id}_${year}_TE_return.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE loan SET document_return = ?, date_return = CURDATE() WHERE id = ?",
            [finalFilePath, cod],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Delete Document Return
    app.delete('/api/loans/delete/doc-return/:id/:year', (req, res) => {
        const id = req.params.id;
        const year = req.params.year;
        //console.log(id, year);

        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        const filePath = path.join(__dirname, "uploads", "loans", `GA_DMEI_N_${id}_${year}_TE_return.pdf`);
        //console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE loan SET document_return = NULL, date_return = NULL WHERE id = ?", [cod], (err, result) => {
                if (err) {
                    //console.log(err);
                    return res.send(err);
                } else {
                    //console.log(result);
                    res.send(result);
                }
            });
        });
    });

    // Route to delete Loan Itens
    app.delete('/api/loans/:id/:year/delete-itens',(req,res)=>{
    const id = req.params.id;
    const year = req.params.year;

    const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        db.query("DELETE FROM item_loan WHERE id_loan_loan = ?", cod,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to delete a Loan
    app.delete('/api/loans/:id/:year/delete',(req,res)=>{
        const id = req.params.id;
        const year = req.params.year;

        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;

        db.query("DELETE FROM loan WHERE id = ?", cod,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to delete a Loan Document
    app.patch('/api/loans/:id/:year/delete-doc-loan',(req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;
    
            db.query("UPDATE loan SET document_loan = NULL WHERE id = ?", cod,
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });
    
    // Route to delete a Devolution Document
    app.patch('/api/loans/:id/:year/delete-doc-devolution',(req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - TE`;
    
            db.query("UPDATE loan SET document_return = NULL WHERE id = ?", cod,
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });

    // Route to Loan Machine
    app.patch('/api/machines/:id/loan', (req,res)=>{
        const id = req.params.id;
        const id_entity = req.body.id_entity;
    
        db.query("UPDATE machines SET id_entities_m = ? WHERE id = ?",
            [id_entity, id],
            (err,result)=>{
            if(err) {
                //console.log(err);
                res.send(err);
            } else{
                //console.log(result);
                res.send(result);
            }});
        })
}

// Request Routes
{
    // Route to get all Requests
    app.get("/api/requests", (req,res)=>{
        db.query("SELECT * FROM request",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get One Request
    app.get("/api/requests/:id/:year", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - SR`;

        db.query("SELECT * FROM request WHERE id = ?", [cod],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get all Requests
    app.get("/api/requests/this-year", (req,res)=>{
        db.query("SELECT * FROM request WHERE YEAR(request.date) = YEAR(CURDATE())",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Requests by limit
    app.get("/api/requests/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query(`SELECT * FROM request WHERE id LIKE ? OR date LIKE ? LIMIT ?, ?`, [search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route for creating a Request
    app.post('/api/requests/create/', (req,res)=> {
        const id = req.body.id;
        const content = req.body.content;
        const receiver = req.body.receiver;
    
        db.query("INSERT INTO request (id, date, content, receiver) VALUES (?,CURDATE(),?,?)",[id, content, receiver],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });

    // Route to delete a Request
    app.delete('/api/requests/:id/:year/delete',(req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - SR`;
    
            db.query("DELETE FROM request WHERE id = ?", cod,
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });
}

// Devolution Routes
{
    // Route to get all Devolutions
    app.get("/api/devolutions", (req,res)=>{
        db.query("SELECT * FROM devolution",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get One Devolution
    app.get("/api/devolutions/:id/:year", (req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - DE`;

        db.query("SELECT * FROM devolution WHERE id = ?", [cod],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get all Devolutions
    app.get("/api/devolutions/this-year", (req,res)=>{
        db.query("SELECT * FROM devolution WHERE YEAR(devolution.date) = YEAR(CURDATE())",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get Devolutions by limit
    app.get("/api/devolutions/page=:page/perPage=:perPage/search=:search", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
        let search = '';
        if (req.params.search !== "null") {
            search = `%${req.params.search}%`;
        } else {
            search = `%`;
        }
    
        db.query(`SELECT * FROM devolution WHERE id LIKE ? OR date LIKE ? LIMIT ?, ?`, [search, search, page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route for creating a Devolution
    app.post('/api/devolutions/create/', (req,res)=> {
        const id = req.body.id;
        const content = req.body.content;
    
        db.query("INSERT INTO devolution (id, date, content) VALUES (?,CURDATE(),?)",[id, content],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });
    
    // Route to ADD Document Devolution
    app.patch('/api/devolutions/create/doc/:id/:year', upload.single('file'), (req, res) => {
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - DE`;
        
        const documentPath = req.file.path; // Caminho temporário do arquivo enviado pelo multer
        const finalFilePath = `./uploads/devolutions/GA_DMEI_N_${id}_${year}_DE.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }
    
        // Agora você pode salvar o caminho final no banco de dados em vez do arquivo em binário
        db.query("UPDATE devolution SET document = ? WHERE id = ?",
            [finalFilePath, cod],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Get Document
    app.get("/api/devolutions/document", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "devolutions", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                //console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Document Devolution
    app.delete('/api/devolutions/delete/doc/:id/:year', (req, res) => {
        const id = req.params.id;
        const year = req.params.year;
        console.log(id, year);

        const cod = `GA/DMEI Nº ${id} / ${year} - DE`;

        const filePath = path.join(__dirname, "uploads", "devolutions", `GA_DMEI_N_${id}_${year}_DE.pdf`);
        console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE devolution SET document = NULL WHERE id = ?", [cod], (err, result) => {
                if (err) {
                    //console.log(err);
                    return res.send(err);
                } else {
                    //console.log(result);
                    res.send(result);
                }
            });
        });
    });


    // Route to delete a Devolution
    app.delete('/api/devolutions/:id/:year/delete',(req,res)=>{
        const id = req.params.id;
        const year = req.params.year;
    
        const cod = `GA/DMEI Nº ${id} / ${year} - DE`;
    
            db.query("DELETE FROM devolution WHERE id = ?", cod,
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - 

//Services Internal
{
    // Route to get all Internals
    app.get("/api/internals", (req,res)=>{
    db.query("SELECT * FROM service_internal",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get all Internals Terminateds
    app.get("/api/internals/terminateds", (req,res)=>{
        db.query("SELECT * FROM service_internal WHERE date_exit IS NOT NULL",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get all Internals Not Terminateds
    app.get("/api/internals/not/terminateds", (req,res)=>{
        db.query("SELECT * FROM service_internal WHERE date_exit IS NULL",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get Internals by limit
    app.get("/api/internals/page=:page/perPage=:perPage", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;

    db.query("SELECT service_internal.*, entities.name as entity_name, zone.name as zone_name, zone.color as zone_color FROM service_internal LEFT JOIN entities ON entities.id = service_internal.id_entity_si LEFT JOIN zone ON zone.id = entities.id_zone_adress LIMIT ?, ?", [page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get Internals Terminateds by limit
    app.get("/api/internals/terminateds/page=:page/perPage=:perPage", (req,res)=>{

        const perPage = Number(req.params.perPage);
        const page = Number(req.params.page) * perPage;
    
        db.query("SELECT service_internal.*, entities.name as entity_name, zone.name as zone_name, zone.color as zone_color FROM service_internal LEFT JOIN entities ON entities.id = service_internal.id_entity_si LEFT JOIN zone ON zone.id = entities.id_zone_adress WHERE service_internal.date_exit IS NOT NULL LIMIT ?, ?", [page, perPage], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else{
                //console.log(result)
                res.send(result)
            }
            });
        });
    

    // Route to get one Internal by id
    app.get("/api/internals/:id", (req,res)=>{

    const id = req.params.id;
    db.query("SELECT service_internal.*, entities.name as entity_name, entities.code as entity_code, entities.street_adress as entity_street_adress, entities.number_adress as entity_number_adress, entities.district_adress as entity_district_adress, zone.name as zone_name FROM service_internal LEFT JOIN entities ON entities.id = service_internal.id_entity_si LEFT JOIN zone ON zone.id = entities.id_zone_adress WHERE service_internal.id = ?", id, 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to get Machines Internal by id
    app.get("/api/internals/:id/machines", (req,res)=>{

        const id = req.params.id;
        db.query("SELECT machines.id, machines.num_serial, machines.model FROM machines JOIN item_machine_si imsi ON machines.id = imsi.id_machine_internal WHERE imsi.id_service_internal = ?", id, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });

    // Route to get Users Internal by id
    app.get("/api/internals/:id/users", (req,res)=>{

        const id = req.params.id;
        db.query("SELECT users.id, users.nickname FROM users JOIN item_user_si iusi ON users.id = iusi.id_user_internal WHERE iusi.id_service_internal = ?", id, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });

    // Route for creating a Internal
    app.post('/api/internals/create', (req,res)=> {

    const entity = req.body.entity;
    const problem = req.body.problem;
    const text_machines = req.body.text_machines;
    const requester = req.body.requester;
    const date_schedule = req.body.date_schedule;
    const comment = req.body.comment;

    db.query("INSERT INTO service_internal (id_entity_si, problem, text_machines, requester, comment, date_schedule) VALUES (?,?,?,?,?,?)",
        [entity, problem, text_machines, requester, comment, date_schedule],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }});
    })

    // Route for creating a Internal Item Machine
    app.post('/api/internals/create/item-machine', (req,res)=> {
        const id_service = req.body.id_service;
        const id_machine = req.body.id_machine;
    
        db.query("INSERT INTO item_machine_si (id_service_internal, id_machine_internal) VALUES (?,?)",[id_service, id_machine],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });
    // Route to delete all Internal Itens Machine
    app.delete('/api/internals/:id/delete/itens-machine',(req,res)=>{
        const id = req.params.id;

        db.query("DELETE FROM item_machine_si WHERE id_service_internal = ?", id,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route for creating a Internal Item User
    app.post('/api/internals/create/item-user', (req,res)=> {
        const id_service = req.body.id_service;
        const id_user = req.body.id_user;
    
        db.query("INSERT INTO item_user_si (id_service_internal, id_user_internal) VALUES (?,?)",[id_service, id_user],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });
    // Route to delete a Internal Itens User
    app.delete('/api/internals/:id/delete/itens-user',(req,res)=>{
        const id = req.params.id;

        db.query("DELETE FROM item_user_si WHERE id_service_internal = ?", id,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to update a Internal
    app.patch('/api/internals/:id/update',(req,res)=>{
    const id = req.params.id;

    const entity = req.body.entity;
    const problem = req.body.problem;
    const service = req.body.service;
    const text_machines = req.body.text_machines;
    const requester = req.body.requester;
    const comment = req.body.comment;

    db.query("UPDATE service_internal SET id_entity_si = ?, text_machines = ?, requester = ?, problem = ?, service_performed = ?, comment = ? WHERE id = ?",
        [entity, text_machines, requester, problem, service, comment, id],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }
        });    
    });

    // Route to terminate a Internal
    app.patch('/api/internals/:id/terminate',(req,res)=>{
        const id = req.params.id;

        const service = req.body.service;
    
        db.query("UPDATE service_internal SET service_performed = ?, date_exit = NOW() WHERE id = ?",
            [service, id],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }
            });    
    });

    // Route to ADD Document
    app.patch('/api/internals/upload/doc/:id', upload.single('file'), (req,res)=>{
        const id = req.params.id;

        const documentPath = req.file.path;
        const finalFilePath = `./uploads/internals/OSI_${id}.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE service_internal SET document = ? WHERE id = ?",
            [finalFilePath, id],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Get Document
    app.get("/api/internals/open/doc", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "internals", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Document
    app.delete('/api/internals/delete/doc/:id', (req, res) => {
        const id = req.params.id;

        const filePath = path.join(__dirname, "uploads", "internals", `OSI_${id}.pdf`);
        console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE service_internal SET document = NULL WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        });
    });
}

//External Schedulings
{
    // Route to get all Externals
    app.get("/api/externals", (req,res)=>{
    db.query("SELECT * FROM external_scheduling",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get all Internals Terminateds
    app.get("/api/externals/terminateds", (req,res)=>{
        db.query("SELECT * FROM external_scheduling  WHERE date_exit IS NOT NULL",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });

    // Route to get all Internals Not Terminateds
    app.get("/api/externals/not/terminateds", (req,res)=>{
        db.query("SELECT * FROM external_scheduling WHERE date_exit IS NULL",
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
            });
        });
    
    // Route to get Externals by limit
    app.get("/api/externals/page=:page/perPage=:perPage", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;

    db.query("SELECT external_scheduling.*, entities.name as entity_name, zone.name as zone_name, zone.color as zone_color FROM external_scheduling LEFT JOIN entities ON entities.id = external_scheduling.id_entity_es LEFT JOIN zone ON zone.id = entities.id_zone_adress LIMIT ?, ?", [page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get Externals Terminateds by limit
    app.get("/api/externals/terminateds/page=:page/perPage=:perPage", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;

    db.query("SELECT external_scheduling.*, entities.name as entity_name, zone.name as zone_name, zone.color as zone_color FROM external_scheduling LEFT JOIN entities ON entities.id = external_scheduling.id_entity_es LEFT JOIN zone ON zone.id = entities.id_zone_adress WHERE external_scheduling.date_exit IS NOT NULL LIMIT ?, ?", [page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });
    

    // Route to get one External by id
    app.get("/api/externals/:id", (req,res)=>{

    const id = req.params.id;
    db.query("SELECT external_scheduling.*, entities.name as entity_name, entities.code as entity_code, entities.street_adress as entity_street_adress, entities.number_adress as entity_number_adress, entities.district_adress as entity_district_adress, zone.name as zone_name FROM external_scheduling LEFT JOIN entities ON entities.id = external_scheduling.id_entity_es LEFT JOIN zone ON zone.id = entities.id_zone_adress WHERE external_scheduling.id = ?", id, 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to get Machines External by id
    app.get("/api/externals/:id/machines", (req,res)=>{

        const id = req.params.id;
        db.query("SELECT machines.id, machines.num_serial, machines.model FROM machines JOIN item_machine_es imes ON machines.id = imes.id_machine_external WHERE imes.id_external_scheduling = ?", id, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });

    // Route to get Users External by id
    app.get("/api/externals/:id/users", (req,res)=>{

        const id = req.params.id;
        db.query("SELECT users.id, users.nickname FROM users JOIN item_user_es iues ON users.id = iues.id_user_external WHERE iues.id_external_scheduling = ?", id, 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }});
        });


    // Route for creating a External
    app.post('/api/externals/create', (req,res)=> {

    const entity = req.body.entity;
    const text_machines = req.body.text_machines;
    const problem = req.body.problem;
    const comment = req.body.comment;
    const date = req.body.date;
    const requester = req.body.requester;

    db.query("INSERT INTO external_scheduling (id_entity_es, text_machines, problem, comment, date_schedule, requester) VALUES (?,?,?,?,?,?)",
        [entity, text_machines, problem, comment, date, requester],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }});
    })

    // Route for creating a External Item Machine
    app.post('/api/externals/create/item-machine', (req,res)=> {
        const id_service = req.body.id_service;
        const id_machine = req.body.id_machine;
    
        db.query("INSERT INTO item_machine_es (id_external_scheduling, id_machine_external) VALUES (?,?)",[id_service, id_machine],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });

    // Route to delete all External Itens Machine
    app.delete('/api/externals/:id/delete/itens-machine',(req,res)=>{
        const id = req.params.id;

        db.query("DELETE FROM item_machine_es WHERE id_external_scheduling = ?", id,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route for creating a External Item User
    app.post('/api/externals/create/item-user', (req,res)=> {
        const id_service = req.body.id_service;
        const id_user = req.body.id_user;
    
        db.query("INSERT INTO item_user_es (id_external_scheduling, id_user_external) VALUES (?,?)",[id_service, id_user],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }});
        });

    // Route to delete a External Itens User
    app.delete('/api/externals/:id/delete/itens-user',(req,res)=>{
        const id = req.params.id;

        db.query("DELETE FROM item_user_es WHERE id_external_scheduling = ?", id,
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });

    // Route to terminate a Internal
    app.patch('/api/externals/:id/terminate',(req,res)=>{
        const id = req.params.id;

        const service = req.body.service;
    
        db.query("UPDATE external_scheduling SET service_performed = ?, date_exit = NOW() WHERE id = ?",
            [service, id],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }
            });    
    });

    // Route to update a External
    app.patch('/api/externals/:id/update',(req,res)=>{
    const id = req.params.id;

    const entity = req.body.entity;
    const problem = req.body.problem;
    const service = req.body.service;
    const text_machines = req.body.text_machines;
    const requester = req.body.requester;
    const comment = req.body.comment;
    
    console.log(entity);

    db.query("UPDATE external_scheduling SET id_entity_es = ? , problem = ?, service_performed = ?, text_machines = ?, requester = ?, comment = ? WHERE id = ?",
        [entity , problem, service, text_machines, requester, comment, id],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }
        });    
    });

    // Route to terminate a Internal
    app.patch('/api/externals/:id/terminate',(req,res)=>{
        const id = req.params.id;

        const service = req.body.service;
    
        db.query("UPDATE external_scheduling SET service_performed = ?, date_exit = NOW() WHERE id = ?",
            [service, id],
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err);
            } else{
                //console.log(result)
                res.send(result);
            }
            });    
    });

    // Route to ADD Document
    app.patch('/api/externals/upload/doc/:id', upload.single('file'), (req,res)=>{
        const id = req.params.id;

        const documentPath = req.file.path;
        const finalFilePath = `./uploads/externals/OSE_${id}.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE external_scheduling SET document = ? WHERE id = ?",
            [finalFilePath, id],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Get Document
    app.get("/api/externals/open/doc", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "externals", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Document
    app.delete('/api/externals/delete/doc/:id', (req, res) => {
        const id = req.params.id;

        const filePath = path.join(__dirname, "uploads", "externals", `OSE_${id}.pdf`);
        console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE external_scheduling SET document = NULL WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        });
    });
}

//Equipments Inputs
{
    // Route to get all Inputs
    app.get("/api/inputs", (req,res)=>{
    db.query("SELECT * FROM input_equipment",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });
    
    // Route to get Inputs by limit
    app.get("/api/inputs/page=:page/perPage=:perPage/search=:search", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;
    let search = '';
    if (req.params.search !== "null") {
        search = `%${req.params.search}%`;
    } else {
        search = `%`;
    }

    db.query("SELECT input_equipment.*, entities.name as entity_name, machines.model as machine_model, machines.num_serial as machine_num, users.realname as user_name FROM input_equipment LEFT JOIN entities ON entities.id = input_equipment.id_entity_ie LEFT JOIN machines ON machines.id = input_equipment.id_machine_ie LEFT JOIN users ON users.id = input_equipment.id_user_ie WHERE input_equipment.id LIKE ? OR entities.name LIKE ? OR machines.model LIKE ? OR machines.num_serial LIKE ? OR input_equipment.date_input LIKE ? ORDER BY input_equipment.id DESC LIMIT ?, ?", [search, search, search, search, search, page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });
    

    // Route to get one Inputs by id
    app.get("/api/inputs/:id", (req,res)=>{ 

    const id = req.params.id;
    db.query("SELECT input_equipment.*, entities.name as entity_name, entities.code as entity_code, entities.phone as entity_phone, entities.street_adress as entity_street_adress, entities.number_adress as entity_number_adress, entities.district_adress as entity_district_adress, zone.name as zone_name, machines.num_serial as machine_num, machines.model as machine_model, primary_users.realname as user_name, primary_users.registration as registration, second_users.realname as second_user_name FROM input_equipment LEFT JOIN entities ON entities.id = input_equipment.id_entity_ie LEFT JOIN zone ON zone.id = entities.id_zone_adress LEFT JOIN machines ON machines.id = input_equipment.id_machine_ie LEFT JOIN users as primary_users ON primary_users.id = input_equipment.id_user_ie LEFT JOIN users as second_users ON second_users.id = input_equipment.id_second_user_ie WHERE input_equipment.id = ?", id, 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }});
    });


    // Route for creating a Input
    app.post('/api/inputs/create', (req,res)=> {

    const entity = req.body.entity;
    const machine = req.body.machine;
    const responsable = req.body.responsable;
    const phone_responsable = req.body.phone_responsable;

    const user = req.body.user;
    const problem = req.body.problem;
    const comment = req.body.comment;
    const date_input = req.body.date_input;
    const peripheral = req.body.peripheral;

    db.query("INSERT INTO input_equipment (id_machine_ie, problem, date_input, id_user_ie, comment, id_entity_ie, peripheral, responsable, phone_responsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [machine, problem, date_input, user, comment, entity, peripheral, responsable, phone_responsable],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }});
    })

    // Route to update a Input
    app.patch('/api/inputs/:id/update',(req,res)=>{
    const id = req.params.id;

    const entity = req.body.entity;
    const machine = req.body.machine;
    const responsable = req.body.responsable;
    const phone_responsable = req.body.phone_responsable;
    
    const user = req.body.user;
    const problem = req.body.problem;
    const comment = req.body.comment;
    const peripheral = req.body.peripheral;
    const date_input = req.body.date_input;

    db.query("UPDATE input_equipment SET id_entity_ie = ?, id_machine_ie = ?, id_user_ie = ?, problem = ?, comment = ?, peripheral = ?, date_input = ?, responsable = ?, phone_responsable = ? WHERE input_equipment.id = ?",
        [entity, machine, user, problem, comment, peripheral, date_input, responsable, phone_responsable, id],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }
        });    
    });


    // Route to get Inputs NOT TERMINATEDs
    app.get("/api/inputs/not/terminateds", (req,res)=>{

    db.query("SELECT input_equipment.*, entities.name as entity_name, machines.num_serial as machine_num, users.realname as user_name FROM input_equipment LEFT JOIN entities ON entities.id = input_equipment.id_entity_ie LEFT JOIN machines ON machines.id = input_equipment.id_machine_ie LEFT JOIN users ON users.id = input_equipment.id_user_ie WHERE input_equipment.date_exit IS NULL ORDER BY input_equipment.date_input DESC", 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get all Inputs TERMINATEDs
    app.get("/api/inputs-terminateds", (req,res)=>{
    db.query("SELECT * FROM input_equipment WHERE date_exit IS NOT NULL",
        (err,result)=>{
        if(err) {
            // console.log(err)
            res.send(err)
        } else {
            // console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get Inputs TERMINATEDs by limit
    app.get("/api/inputs/terminateds/page=:page/perPage=:perPage/search=:search", (req,res)=>{

    const perPage = Number(req.params.perPage);
    const page = Number(req.params.page) * perPage;
    let search = '';
    if (req.params.search !== "null") {
        search = `%${req.params.search}%`;
    } else {
        search = `%`;
    }

    db.query("SELECT input_equipment.*, entities.name as entity_name, machines.model as machine_model, machines.num_serial as machine_num, users.realname as user_name FROM input_equipment LEFT JOIN entities ON entities.id = input_equipment.id_entity_ie LEFT JOIN machines ON machines.id = input_equipment.id_machine_ie LEFT JOIN users ON users.id = input_equipment.id_user_ie WHERE input_equipment.date_exit IS NOT NULL AND (input_equipment.id LIKE ? OR entities.name LIKE ? OR machines.model LIKE ? OR machines.num_serial LIKE ? OR input_equipment.date_exit LIKE ? OR users.realname LIKE ?) ORDER BY input_equipment.date_exit DESC LIMIT ?, ?", [search, search, search, search, search, search, page, perPage], 
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else{
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to TERMINATE a Input
    app.patch('/api/inputs/:id/terminate',(req,res)=>{
    const id = req.params.id;

    const user = req.body.user;
    const secondUser = req.body.secondUser;
    const service = req.body.service;
    const comment = req.body.comment;

    db.query("UPDATE input_equipment SET id_user_ie = ?, id_second_user_ie = ?, service_performed = ?, comment = ?, date_exit = NOW() WHERE input_equipment.id = ?",
        [user, secondUser, service, comment, id],
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err);
        } else{
            //console.log(result)
            res.send(result);
        }
        });    
    });

    // Route to ADD Exit Document to Input
    app.patch('/api/inputs/upload/doc/exit/:id', upload.single('file'), (req,res)=>{
        const id = req.params.id;

        const documentPath = req.file.path;
        const finalFilePath = `./uploads/inputs/OS_${id}_EXIT.pdf`;
        
        fs.rename(documentPath, finalFilePath, function (err) {
        if (err) {
            //console.log(err);
            return res.status(500).send(err);
        }

        db.query("UPDATE input_equipment SET document_exit = ? WHERE id = ?",
            [finalFilePath, id],
            (err, result) => {
            if (err) {
                //console.log(err);
                return res.status(500).send(err);
            } else {
                //console.log(result);
                res.send(result);
            }
            });
        });
    });

    // Route to Get Exit Document
    app.get("/api/inputs/doc/exit", (req, res) => {
        const fileName = req.query.fileName;
        const filePath = path.join(__dirname, "uploads", "inputs", fileName);
        console.log(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                //console.log(err);
                res.send(err);
            } else {
                //console.log(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.send(data);
            }
        });
    });

    // Route to Delete Exit Document from Inputs
    app.delete('/api/inputs/delete/doc/exit/:id', (req, res) => {
        const id = req.params.id;

        const filePath = path.join(__dirname, "uploads", "inputs", `OS_${id}_EXIT.pdf`);
        console.log(filePath);
                
        fs.unlink(filePath, (error) => {
            if (error) {
                //console.log(error);
                return res.send(error);
            }

            db.query("UPDATE input_equipment SET document_exit = NULL WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        });
    });
}

// - - - - - - - - - - - - - -
{

}
// - - - - - - - - - - - - - -

// Dashboard
{
    // Route to get all Technicans
    app.get("/api/calls", (req,res)=>{
    db.query("SELECT users.nickname as username, COUNT(input_equipment.id) as score FROM users JOIN input_equipment ON users.id = input_equipment.id_user_ie OR users.id = input_equipment.id_second_user_ie WHERE input_equipment.date_exit IS NOT null GROUP BY username",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get all Zones
    app.get("/api/zones", (req,res)=>{
    db.query("SELECT zone.name as zonename, zone.color as zonecolor, COUNT(date_input) as score FROM external_scheduling JOIN entities ON entities.id = external_scheduling.id_entity_es JOIN zone ON zone.id = entities.id_zone_adress GROUP BY zone.name",
        (err,result)=>{
        if(err) {
            //console.log(err)
            res.send(err)
        } else {
            //console.log(result)
            res.send(result)
        }
        });
    });

    // Route to get all Historic PerMonth
    app.get("/api/historic/:year", (req,res)=>{
        const year = req.params.year;
        db.query("SELECT month(date_input) as month,COUNT(date_input) as inputs, COUNT(date_exit) as exits FROM input_equipment WHERE year(date_input) = ? GROUP BY month(date_input) ORDER BY month(date_input) ASC", [year], 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
        });
    });

    // Route to get all Historic Years
    app.get("/api/historic-years", (req,res)=>{
        db.query("SELECT year(date_input) as year FROM input_equipment GROUP BY year(date_input)", 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
        });
    });

    // Route to get Count Users
    app.get("/api/count-users", (req,res)=>{
        db.query("SELECT COUNT(id) as count FROM users", 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
        });
    });

    // Route to get Count Machines
    app.get("/api/count-machines", (req,res)=>{
        db.query("SELECT COUNT(id) as count FROM machines", 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err)
            } else {
                //console.log(result)
                res.send(result)
            }
        });
    });

    // Route to get Count Entities
    app.get("/api/count-entities", (req,res)=>{
        db.query("SELECT COUNT(id) as count FROM entities", 
            (err,result)=>{
            if(err) {
                //console.log(err)
                res.send(err) 
            } else {
                //console.log(result)
                res.send(result)
            }
        });
    });
}


//Listen
app.listen(PORT, ()=>{
    console.log(`Server rodando em http://localhost:${PORT}\n`)
    console.log('// Projeto realizado por');
    console.log('// Gabriel Oliveira -> https://github.com/gabriel-codart');
    console.log('// Kaylanne Santos -> https://github.com/kaylannesantos');
})

// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos