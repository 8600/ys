var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://user.hanshu.run/login',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "type": "夜市",
    "username": "875740127",
    "password": "lcc199211"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  const body = JSON.parse(response.body)
  const userData = body.data
  
  check(userData.data)
});


function check(data) {
  console.log('-------------------------------------------------')
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      var options = {
        'method': 'GET',
        'url': 'http://pol-service.yoruichi.cn/nightMall/appApi/goods/' + key,
        'headers': {}
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        const body = JSON.parse(response.body)
        if (body.data) {
          body.data.goodsSpecificationListWithRmbPrice.forEach(element2 => {
            console.log(element2.name, element2.specValue, element2.priceRmb, element2.inventory)
            if (element2.inventory > 0 && !element.isAlert) {
              element.isAlert = true
              sendMessage('夜市商品数量监控', element2.name, `[${JSON.parse(element2.specValue)[0]}]: 当前价格${element2.priceRmb} 剩余数量${element2.inventory}`)
            }
            if (element.rmb > element2.priceRmb && element2.inventory > 0) {
              element.rmb = element2.priceRmb
              sendMessage('夜市商品价格监控', element2.name, `[${JSON.parse(element2.specValue)[0]}]: 当前价格${element2.priceRmb} 剩余数量${element2.inventory}`)
            }
          });
        } else if (body.message) {
          console.error(`[${key}]:${body.message}`)
        }
      });
    }
  }
  setTimeout(() => {
    check(data)
  }, 5000);
}

function sendMessage(text, text1, text2) {
  console.log(`发送消息提示:${text} ${text1} ${text2}`)
  var options = {
    'method': 'POST',
    'url': 'https://hanshu.run/gzh?id=ohxET6Dz11XvhSrJAXkQMNze4gj4&template=EvpHwEBpG2rkLHYMtIH2ADww9JCQwEaWlTAqyoPF6xQ',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `{"first":{"value":"商品监控提醒","color":"#173177"},"keyword1":{"value":"${text}","color":"#173177"},"keyword2":{"value":"${text1}","color":"#173177"},"keyword3":{"value":"现在","color":"#173177"},"remark":{"value":"${text2}","color":"#173177"}}`
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}