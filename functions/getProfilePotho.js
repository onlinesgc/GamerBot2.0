var fs = require("fs");
const gifencoder = require("gifencoder");
module.exports = async (profileData, TimeOut, Xp, xpPercentage, iconUrl, username, ProfileFrame, isGif) => {
    const endcoder = new gifencoder(500,800)
    const { createCanvas, loadImage, registerFont } = require("canvas");
    var Photos = null;
    let iterations = 1;
    var data;
    if(isGif){
        Photos = [];
        data = await getGifMap(ProfileFrame)
        iterations = data.length;
    }
    if(isGif){
        Photos = endcoder.createReadStream().pipe(fs.createWriteStream("./canvas/temp/mygif.gif"))
        endcoder.start()
        endcoder.setRepeat(0); 
        endcoder.setDelay(100); 
        endcoder.setQuality(10); 
    }
    for(i = 0 ; i < iterations ; i++){
        var whidth = 500;
        var hight = 800;
        registerFont("./canvas/Hard Compound.ttf", { family: "Hard_Compound" });
        const Profile = createCanvas(whidth, hight);
        const ProfileOptions = Profile.getContext("2d");
        ProfileOptions.fillStyle = profileData.colorHexCode;
        ProfileOptions.fillRect(0, 0, whidth, hight);
        if(!isGif){
            await loadImage(`./canvas/Backrounds/BackrundsFrame${ProfileFrame}.png`).then(img => {
                ProfileOptions.drawImage(img, 0, 0, whidth, hight);
            })
        }
        else{
            await loadImage(`./canvas/Backrounds/gifBackrounds/GifBackround${ProfileFrame}/${i}.png`).then(img => {
                ProfileOptions.drawImage(img, 0, 0, whidth, hight);
            })
        }
        if (iconUrl != undefined) {
            await loadImage(iconUrl).then(img => {
                ProfileOptions.fillStyle = profileData.colorHexCode;
                //roundRect(ProfileOptions,(whidth/2)-135,70,270,270,20,true)
                //ProfileOptions.fillRect((whidth/2)-135,70,270,270,20)
                ProfileOptions.fillStyle = profileData.colorHexCode;
                //ProfileOptions.fillRect((whidth/2)-125,80,250,250)
                ProfileOptions.drawImage(img, (whidth / 2) - 125, 80, 250, 250);
                //roundRect(ProfileOptions,(whidth/2)-125,80,250,250,40 ,true, true)
            })
        }
        ProfileOptions.font = "bold 50pt Hard_Compound"
        ProfileOptions.textAlign = "center"
        ProfileOptions.fillStyle = "#fff"
        ProfileOptions.fillText(username, (whidth / 2), 400)
        ProfileOptions.font = "normal 40pt Hard_Compound"
        ProfileOptions.fillText(`Level: ${profileData.level - 1}`, (whidth / 2), 470);
        //ProfileOptions.font = "normal 30pt sans"
        //ProfileOptions.fillText(`Progress:\n${progressBar} ${xpPercentage}%`,(whidth/2),630);
        var multiplier = 3.5;
        var fildBar = 100 * multiplier + 10;
        var Bar = xpPercentage * multiplier + 10;
        ProfileOptions.fillStyle = "#898C87"
        roundRect(ProfileOptions, 65, 500, fildBar, 40, 15, true);
        ProfileOptions.fillStyle = "#fff"
        roundRect(ProfileOptions, 65, 500, Bar, 40, 15, true);
        ProfileOptions.font = "normal 40pt Hard_Compound";
        ProfileOptions.fillText(`${xpPercentage}%`, (whidth / 2), 600);
        ProfileOptions.font = "normal 20pt Hard_Compound";

        if (Xp != "") ProfileOptions.fillText(Xp, (whidth / 2), 630);
        if (TimeOut != "") ProfileOptions.fillText(TimeOut, (whidth / 2), 660);

        if(isGif) endcoder.addFrame(ProfileOptions)
        else Photos = Profile.toBuffer("image/png")
    }
    if(isGif) endcoder.finish()

    if(isGif) return "./canvas/temp/mygif.gif"
    else return Photos;

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }
    function getGifMap(gifframe){
        return new Promise(resolve =>{
            fs.readdir(`./canvas/Backrounds/gifBackrounds/GifBackround${gifframe}`,(err,data)=>{
                if(err) return console.log(err);
                resolve(data)
            })
        })
    }
}