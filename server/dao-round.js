'use strict';

const db = require('./Db');
// const cDao = require('./categories-dao');

// function generateRandomLetter(){
//     const letters = 'abcdefghijklmnopqrstuvwxyz';
//     return letters[Math.floor(Math.random() * letters.length)];
// }

function Round (id,category,letter,difficulty)
{
    this.id = id;
    this.category = category;
    this.letter = letter;
    this.difficulty = difficulty;
}


exports.getAllrounds=()=>{
    return new Promise((resolve, reject)=>{
        const sql=`SELECT * from rounds`
        db.all(sql, [], (err,rows)=>{
            if(err)
            reject(err);
        else{
            // console.log(rows);
            resolve(rows);
        }
        })
    })
}
exports.createRound = (round) =>{
    return new Promise((resolve, reject)=>{
        // const cdId = cDao.getCategoryId(category);
        // const rand = generateRandomLetter();
        const sql = `INSERT INTO rounds(cat_Id, letter, difficulty, StartTime) VALUES(?,?,?,?)`;
        db.run(sql, [round.cat_Id, round.letter, round.difficulty, round.StartTime], function (err){
            if(err){
                reject(err);
                return;
            }
            else{
                // const result = exports.getRound(this.lastID);
                // resolve(exports.getRoundId(round.cat_Id, round.letter)); //this will give me the last inserted row 
                // console.log(this.lastID);
                resolve({id: this.lastID, cat_Id: round.cat_Id, letter: round.letter, difficulty: round.difficulty, StartTime: round.StartTime});
            }
        });
    });

}

exports.getRoundId = (cat_Id, letter) =>{
    return new Promise ((resolve,reject)=>{
        const sql = `SELECT id from rounds where cat_Id =? and letter =?`;
        db.get(sql, [cat_Id, letter], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Round not found'});
            }
            else {
                resolve(row.id);
            }
        } );

    })
}

// exports.getRoundIds = (cat_Id, letter) =>{
//     return new Promise ((resolve,reject)=>{
//         const sql = `SELECT * from rounds where cat_Id =? and letter =?`;
//         db.all(sql, [cat_Id, letter], (err, row)=>{
//             if(err){
//                 reject(err);
//                 return;
//             }
//             else{
//             const rounds = row.map((r)=>{
//                 new Round(r.id);
//             });
//             resolve(rounds);
//         } 
//         } );

//     })
// }

exports.countRoundId = (cat_Id, letter) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT count(*) as count from rounds where cat_Id =? and letter =?`;
        db.get(sql, [cat_Id, letter], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(row.count);
            }
        } );
    })
}

exports.getRound = (id) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT * from rounds where id =?`;
        db.get(sql, [id], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(row);
            }
        } );
    })
}

exports.getLetter = (id) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT letter from rounds where id =?`;
        db.get(sql, [id], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(row.letter);
            }
        } );
    })
}


exports.getRoundList = (cat_Id, letter) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT * from rounds where cat_Id =? and letter =?`;
        db.all(sql, [cat_Id, letter], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                // const rounds = row.map((r)=>{
                //     new Round(r.id, r.cat_Id, r.letter, r.difficulty);
                // } );
                console.log(row)
                resolve(row);
            }
        } );
    })
}
// exports.getRoundList(2, 'l');


exports.getCategoryId=(id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT cat_Id from rounds where id =?`;
        db.get(sql, [id], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(row);
            }
        } );
    })
}

//get category//
//get difficulty//
// exports.getRoundList(2,'o');