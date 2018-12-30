var express = require('express');
var router = express.Router();
var MongoClient  = require('mongodb').MongoClient;
var url = "mongodb://101.201.236.217:27017/";

/* GET home page. */

router.post('/', function (req, res) {
    console.log("register")
    var user = {phone_number: req.body.phone_number,
        nick_name: req.body.nick_name,
        password: req.body.password,
        sex: req.body.sex,
        deadline:"2119-12-05 24:00:00",
        isVIP:false}

    var isExist = true

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) res.json({err_code:1,resultd:[], message:'数据库连接失败',affectedRows:0});
        var NaugthyVideo = db.db("NaugthyVideo")
        var whereStr = {"phone_number":user.phone_number}
        NaugthyVideo.collection("user").find(whereStr).toArray(function (err, result) {
            if (err)  res.json({err_code:1,resultd:[], message:'注册失败，数据库写入失败',affectedRows:0});
            if (result.length = 0){
                isExist = false
            } else {
                db.close()
                res.json({err_code:1,resultd:[], message:'手机号已注册',affectedRows:result.length});
            }
        })

        if (isExist){
            return
        }
        NaugthyVideo.collection("user").insertOne(user, function (err, result) {
            if (err)  res.json({err_code:1,resultd:[], message:'注册失败，数据库写入失败',affectedRows:0});
            db.close()
            res.json({err_code:1,resultd:[], message:'注册成功',affectedRows:result.length});
        })
    })
})


module.exports = router;
