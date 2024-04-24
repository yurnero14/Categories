'use strict';

exports.TimeExpiry=(time)=>{
    return Math.floor(Date.now()/1000)-time;
}

exports.stringToarray=(str)=>{
    return str.split(',');
}
const a = "abb, bbc, ccd";
const b=exports.stringToarray(a);

  let arr1 = [2,3,4,5,2,3,4,5];
  let arr2 = [2,3];

  

    exports.removeduplicates=(arr)=>{
        // return arr.filter((item, index)=>arr.indexOf(item)===index);
        let uniq = [...new Set(arr)];
        return uniq;
    }

    console.log(exports.removeduplicates(['Yemen', 'Yemen']));

