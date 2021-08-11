module.exports = async ( oldMember, newMember, client) => {
    let supportRoles = []
    newMember.roles.cache.forEach(async e =>{
        let b = false;
        await supportRoles.forEach(e2 =>{
            if(e2 == e.id){
                b = true;
            }
        })
    })
    /*
    if(b == supportRoles.length){
        oldMember.roles.cache.forEach(async e =>{
            await supportRoles.forEach(e2 =>{
                if(e2 == e.id){
                    t++;
                }
            })
        })
        if(t != supportRoles.length){
            newMember.guild.channels.cache.get("816724723739656222").send(`Tack <@${newMember.id}>, för att du supportar stamsite till det ytersta :D\nMed deta kommer du få en egen roll på servern`);
            newMember.roles.add(megaSuportRole);
        }
    }
    */
}