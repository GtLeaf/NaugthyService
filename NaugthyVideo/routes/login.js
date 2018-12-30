var express = require('express');
var router = express.Router();
var MongoClient  = require('mongodb').MongoClient;
var url = "mongodb://101.201.236.217:27017/";

/* GET home page. */
//登录接口
router.post('/', function (req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

        if (err) res.json({err_code:1,resultd:[], message:'数据库连接失败',affectedRows:0});
        var NaugthyVideo = db.db("NaugthyVideo")
        var whereStr = {"phone_number":req.body.phone_number, "password":req.body.password}
        console.log(whereStr)
        NaugthyVideo.collection("user").find(whereStr).toArray(function (err, result) {
            if (err) res.json({err_code:1 ,resultd:[] ,message:'查询指令错误' ,affectedRows:0});
            // res.render('indexmongo', {movieList: result});

            if(result.length == 0){
                db.close()
                res.json({err_code:1 ,resultd:result ,message:'用户名或密码错误' ,affectedRows:result.length});
                return 
            }
	    //使用0时区时间
            var date = new Date(result[0].deadline)
            var nowDate = new Date(Date.now())
            var message = "success"
            if (date<nowDate){
                message = "账号授权过期"
                db.close()
                return res.json({err_code:1 ,result:[] ,message:message ,affectedRows:0});
            }
            //允许登录
            res.json({err_code:0 ,result:result ,message:message ,affectedRows:result.length});

            //填写登录记录
            var login_record = {
                "phone_number": req.body.phone_number,
                "login_time": nowDate
            }
            NaugthyVideo.collection("login_record").insertOne(login_record, function (err, result) {
                db.close()
                if(err){
                    return console.log("登录记录写入失败",err)
                }
                console.log("result.length",result.result.n)
                if(result.result.n !== 1){
                   return console.log("添加登录记录失败")
                }  
                console.log("添加登录记录成功")
            })
        })
    });
});

router.post('/', function (req, res) {
    console.log("in the next")
})

router.get('/search', function (req, res) {
    var movieName = decodeURI(req.query.movie_name)
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var movieSearch = db.db("moviesearch")
        var whereStr = {"movie_name":movieName}
        movieSearch.collection("movielist").find(whereStr).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.render('indexmongo', {movieList: result});
            db.close();
        })
    });
})

module.exports = router;
