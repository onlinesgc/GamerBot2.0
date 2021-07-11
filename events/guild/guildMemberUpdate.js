module.exports = async ( oldMember, newMember, client) => {
    let supportRoles = []
    newMember.roles.cache.forEach(async e =>{
        let b = false;
        await supportRoles.forEach(e2 =>{
            if(e2 == e.id){
                b = true;
            }
        })
        if(b){
            
        }
    })
}