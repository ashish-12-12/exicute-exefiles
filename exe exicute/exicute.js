const nodemailer = require("nodemailer");
const cp = require('child_process');
const path_to_exe = 'C:\\Users\\ashishc\\AppData\\Local\\Programs\\Opera\\opera.exe'
const fs = require('fs')
const moment = require('moment')
let date_for_file = moment().format('MMMM Do YYYY, h:mm:ss a')
let file_name_end = moment().format('YYYYMMDD')
console.log("fff",file_name_end);
let path_of_logs_file = `Output${file_name_end}.txt`
let to_mail_for_success = [
    "recivers email"
]
let to_mail_for_not_success = [
    "user email"
]


const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "nodemailer gmail",
        pass: "node mailer password",
    },
});
const sendTable_to_mail = (emailAddress, mailData, __callback) => {
    const mailOptions = {
        from: "nodemailer emial",
        to: emailAddress,
        subject: `subject`,
        text: mailData,
    };

    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        console.log("send2");
        __callback(null,info)
    });
}

let retrycount = 0
function child(retrycount) {
    try {
        cp.exec(path_to_exe, (err,data) => {
            if (err) {
                console.warn("error in path", err);
                var mesasage = "FILE Path of exe FILE is wrong"
                let data = `${mesasage} -----------${date_for_file}`
                fs.appendFile(path_of_logs_file, `${data}\r\n`, (err) => {
                    if (err) throw err;
                })
            }
            else {
                console.warn("file executed successfully");
                var mesasage = "opera file executed successfully"
                let data = `${mesasage} -----------${date_for_file}`
                fs.appendFile(path_of_logs_file, `${data}\r\n`, (err) => {
                    if (err) throw err;
                    console.warn("file append success at log file");
                })
                sendTable_to_mail(to_mail_for_success, mesasage, function (err, res) {
                    if (err) {
                        console.log("errr", err);
                    } else {
                        process.exit(0)
                    }
                })
            }
        });
    } catch (err) {
        retrycount = retrycount + 1
        if (retrycount == 2) {
            var mesasage = "The EXE file is not exicuted"
            let data = `${mesasage} -----------${date_for_file}`
            fs.appendFile(path_of_logs_file, `${data}\r\n`, (err) => {
                if (err) throw err;
                console.log("kkkkkkkkkkk");
            })
            sendTable_to_mail(to_mail_for_not_success, mesasage,function(err,res){
                if (err) {
                    console.log("errr", err);
                } else {
                    process.exit(0)
                }
            })
        }
        else if (retrycount < 3) {
            child(retrycount)
        }
    }
}

child(retrycount)





































