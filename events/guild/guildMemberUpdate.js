const configModel = require("../../models/configSchema");
module.exports = async ( oldMember, newMember, client) => {
    let supportRoles = ["864797910914695168","864799262625759232"]
    let megaSuportRole = "864800059840004107"
    let b = 0;
    let t = 0;
    let configdata = await configModel.fetchConfig(process.env.config_id);
    if(configdata.sendSupporterMessages == undefined){
        configdata.sendSupporterMessages = false;
        configdata.save(); 
    }
    if(!configdata.sendSupporterMessages) return
    newMember.roles.cache.forEach(async e =>{
        await supportRoles.forEach(e2 =>{
            if(e2 == e.id){
                b++;
                if(oldMember.roles.cache.get(e.id) == undefined){
                    newMember.guild.channels.cache.get("816724723739656222").send(`Tack <@${newMember.id}>, för att du har blivit en ${e.name}`);
                }
            }
        })
    })
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
}