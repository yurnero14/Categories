'use strict';

const db = require('./Db');

exports.createResponse = (response) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `INSERT into Responses(user_id, round_id) VALUES(?,?)`;
       
        db.run(sql,[response.user_id, response.round_id], function (err){
            if(err){
                reject(err);
                return;
            }
            else{
                // console.log(response)
                resolve({id: this.lastID, user_id: response.user_id, round_id: response.round_id});
            }
        })
    })
}



exports.getResponseId = (user_id, round_id) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT id from Responses where user_id =? AND round_id = ?`;
        db.get(sql,[user_id, round_id], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Response not found'});
            }
            else{
                resolve(row.id);
            }
        })
    })
}

exports.storeAnswers = (response_id, answers) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `UPDATE Responses SET answers=? where id =? `;

            db.run(sql, [answers, response_id], (err)=>{
                if(err){
                    reject(err);
                    return;
                }
                else{
                    // answers.push(answers[i]);
                    // console.log(answers);
                    resolve(answers);
                }
            });
        

    });
}



exports.storeScore = (score, response_id)=>{
    return new Promise ((resolve, reject) =>{
        const sql = `UPDATE Responses SET score=? where id =?`;
        db.run(sql, [score, response_id], (err)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(score);
            }
        })
    })
}

exports.getroundId=(response_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT round_id from Responses where id =?`;
        db.get(sql, [response_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Round not found'});
            }
            else{
                resolve(row.round_id);
            }
        })
    })
}

exports.getAnswers=(response_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT answers from Responses where id =?`;
        db.get(sql, [response_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Answers not found'});
            }
            else{
                console.log(row);
                resolve(row);
            }
        })
    })
}




exports.getUserlist=(round_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT user_id from Responses where round_id =?`;
        db.all(sql, [round_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'User not found'});
            }
            else{
                resolve(row);
            }
        })
    })
}

exports.getAllanswersfromroundId=(round_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT answers from Responses where round_id =?`;
        db.all(sql, [round_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Answers not found'});
            }
            else{
            
                resolve(row);
            }
        })
    })
}

exports.getAllanswersbyUserId=(user_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT answers from Responses where user_id =?`;
        db.all(sql, [user_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Answers not found'});
            }
            else{
            
                resolve(row);
            }
        })
    })
}


  exports.getResponse=(id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT * from Responses where id =?`;
        db.get(sql, [id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Response not found'});
            }
            else{
                resolve(row);
            }
        })
    })
}

exports.getAllResponses=(round_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT * from Responses where round_id =?`;
        db.all(sql, [round_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Response not found'});
            }
            else{
                resolve(row);
            }
        })
    })

}

exports.getAllanswerfromRoundid=(round_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT answers from Responses where round_id =?`;
        db.all(sql, [round_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Answers not found'});
            }
            else{
                // console.log(row);
                resolve(row);
            }
        })
    })
}


exports.getAllanswersfromRoundandUserid=(round_id, user_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT answers from Responses where round_id =? and user_id=?`;
        db.all(sql, [round_id, user_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                // resolve({error: 'Answers not found'});
                resolve({error: 'Answers not found'});
            }
            else{
                // console.log(row);
                let values=[];
                
                for(let i=0; i<row.length; i++){
                    let a=row[i].answers;
                    values.push(a);
                }
                
                // console.log(values);
                resolve(values);
            }
        })
    })
}



exports.getRoundsPlayedByUser=(user_id)=>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT round_id from Responses where user_id =?`;
        db.all(sql, [user_id],(err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Round not found'});
            }
            else{
                // console.log("id is", row);
                let values=[];
                
                for(let i=0; i<row.length; i++){
                    let a=row[i].round_id;
                    values.push(a);
                }
                // console.log("idss are: ", values);
                resolve(values);
            }
        })
    })
}



exports.getScore = (user_id, round_id) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT score from Responses where user_id =? AND round_id = ?`;
        db.get(sql,[user_id, round_id], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Response not found'});
            }
            else{
                // console.log("iam here");
                // console.log(row);
                resolve(row);
            }
        })
    })
}

// 
exports.getAll=()=>{
    return new Promise((resolve,reject)=>{
        const sql = `SELECT DISTINCT user_id FROM Responses`
        db.all(sql,[],(err, rows)=>{
            if(err)
                reject(err);
            else{
                console.log(rows);
                resolve(rows);
            }
        })
    })
}

exports.getAll();