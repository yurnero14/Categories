'use strict';

const db = require('./Db');

exports.getCategoryId = (category) => {
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT id from Categories where category =? `;
        db.get(sql, [category], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Category not found'});
        
            }
            else {
                resolve(row.id);
            }
        });
    });
};

// const id = exports.getCategoryId('animals');
// console.log(id);