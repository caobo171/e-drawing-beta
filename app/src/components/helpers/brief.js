
export const limitName = (name, limit = 15)=>{
    name = name.trim();
    if(name.length > limit){
       name = name.slice(0,limit) +'...'
       return name;
    } 
    return name;
}