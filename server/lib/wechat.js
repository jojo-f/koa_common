



//支付订单
exports.miniPay = function(req,res) {
    let payData = req.body;
    let openId = payData.openId;		   //trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。
    let appid = payData.appid;			   //微信分配的小程序ID
    let attach = payData.attach;		   //附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用。
    let mch_id = payData.mch_id;		   //微信支付分配的商户号
    let nonce_str = Math.random().toString(36).substr(2, 15);  //随机字符串，长度要求在32位以内。
    let body = payData.body;            					   //商品描述
    let out_trade_no = payData.orderNumber;                    //商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一
    let total_fee = payData.total_fee;                         //金额 分为单位
    let spbill_create_ip = "123.12.12.123";					   //乱写的
    let notify_url = "http://192.168.1.141";				   //乱写的
    let trade_type = "JSAPI";                                  //小程序为JSAPI
    let timeStamp = wxPay.time();                              //时间戳
    /*该方法为第一次签名方法，微信签名共有两次
	  后面我会将该方法贴出来wxPay.paysignMini
	  这个是第一次签名,签名规则按照文档
    */
    let sign = wxPay.paysignMini(appid,mch_id,body,nonce_str,openId,trade_type,notify_url,spbill_create_ip,out_trade_no,total_fee,attach);
    let formData = "<xml>";
    formData += "<appid>"+appid+"</appid>";
    formData += "<attach>"+attach+"</attach>";
    formData += "<body>"+body+"</body>";
    formData += "<mch_id>"+mch_id+"</mch_id>";
    formData += "<nonce_str>"+nonce_str+"</nonce_str>";
    formData += "<notify_url>"+notify_url+"</notify_url>";
    formData += "<openid>"+openId+"</openid>";
    formData += "<out_trade_no>"+out_trade_no+"</out_trade_no>"; 
    formData += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>";
    formData += "<total_fee>"+total_fee+"</total_fee>"; 
    formData += "<trade_type>"+trade_type+"</trade_type>"; 
    formData += "<sign>"+sign+"</sign>";                        
    formData += "</xml>";
	/*签名成功之后,变成xml格式的数据,向微信服务器发送https请求,若成功,微信服务器会返回xml格式数据
	  解析之后会得到预付交易回话表示prepay_id
	  在下吗的方法中用到了两个封装的方法，之后会贴出来wxPay.getXMLNodeValue（因为微信返回的是xml形式的所以要写一个解析的方法），wxPay.paysignMini2（第二次签名的方法，然后后端就应该没啥事了）
	*/
	//!!!!!!!!!!!!!这里要注意package这个参数 一定要prepay_id=字符串与prepay_id进行拼接
	request({
        url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
        method: 'POST',
        body: formData
    }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            let msg = wxPay.getXMLNodeValue('return_msg', body.toString('utf-8'));	// 这个参数可选，微信给咱们正确或错误信息
            let prepay_id = wxPay.getXMLNodeValue('prepay_id', body.toString('utf-8'));
            let nonce_str = wxPay.getXMLNodeValue('nonce_str', body.toString('utf-8'));
            let package = 'prepay_id='+prepay_id;
            timeStamp = timeStamp.toString();
            let paySign= wxPay.paysignMini2(appid,nonce_str,package,timeStamp);
            let data = {
                msg :msg,									   
                nonce_str:nonce_str,
                prepay_id:prepay_id,                           
                timeStamp:timeStamp,                            
                paySign:paySign
            };
            res.json(data)
        }});
};

//好啦 咱们就没啥事了

//
exports.paysignMini = (appid,mch_id,body,nonce_str,openId,trade_type,notify_url,spbill_create_ip,out_trade_no,total_fee,attach)=> {
    let rets = {
        appid: appid,
        body: body,
        mch_id: mch_id,
        nonce_str:nonce_str,
        openid:openId,
        trade_type:trade_type,
        notify_url:notify_url,
        spbill_create_ip:spbill_create_ip,
        out_trade_no:out_trade_no,
        total_fee:total_fee,
        attach:attach
    };
    key = "********************";			//密钥
    var str = raw(rets);
    //将参数拼接成字符串
    str = str + '&key='+key;
    var md5Str = crypto.createHash('md5').update(str).digest('hex');
    md5Str = md5Str.toUpperCase();
    return md5Str;
};
//二次签名sign
exports.paysignMini2 =(appid,nonceStr,package,timeStamp)=> {
    let reta = {
        appId: appid,
        nonceStr: nonceStr,
        package:package,
        signType: 'MD5',
        timeStamp:timeStamp.toString()
    };
    key = "**********************";		//密钥
    var str = raw1(reta);
    //将参数拼接成字符串
    str = str + '&key='+key;
    console.log("MD5Str:",str);
    var md5Str = crypto.createHash('md5').update(str).digest('hex');
    md5Str = md5Str.toUpperCase();
    return md5Str;
};

exports.getXMLNodeValue = (node_name,xml)=>{
        let tmp = xml.split("<"+node_name+">");
        if(tmp[1]!=undefined){
            let _tmp = tmp[1].split("</"+node_name+">");
            let tmp1 = _tmp[0].split('[');

            let _tmp1 = tmp1[2].split(']');
            return _tmp1[0];
        }
};



function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function (key) {
        // newArgs[key.toLowerCase()] = args[key];
        newArgs[key] = args[key]; });
    var str = '';
    for (var k in newArgs) {
        str += '&' + k + '=' + newArgs[k];
    }
    str = str.substr(1);
    console.log(str)
    return str;
}