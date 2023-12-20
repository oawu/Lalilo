/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Api = function() {}

Api.shared = _ => [
  Api.Folder('01 | APP 與 F2E', [
    Api.Folder('01 | Auth', [
      Api.Request('01 | 註冊', 'post', [], {
        url: [
          'launcher',
          'mqtt',
          'group',
          { title: 'Group ID', type: 'num', d4: 0 },
        ],

        query: {
          a: 'b',
          b: { title: '標題', type: 'str', d4: '' },
        },

        header: null,

        payload: {
          type: 'RawObj',
        },

        test: null,

        save: null,
      }),

      Api.Request('02 | 登入', 'post'),
      Api.Request('03 | 🔐 刪除', 'delete'),
      Api.Request('04 | 🔐 Me', 'get'),
      Api.Request('05 | 🔐 儲值點數', 'post'),
      Api.Request('06 | 🔐 點數紀錄', 'get'),
      Api.Request('07 | 🔐 發送驗證碼', 'post'),
      Api.Request('08 | 🔐 驗證驗證碼', 'put'),
    ]),
    Api.Folder('02 | 訂單', [
      Api.Folder('01 | 一般商品', [
        Api.Folder('01 | 購物車', [
          Api.Request('01 | 🔐 加入購物車', 'post'),
          Api.Request('02 | 🔐 更新購物車', 'post'),
          Api.Request('03 | 🔐 檢視購物車', 'get', [
            Api.Sample('01 | 檢視購物車'),
            Api.Sample('02 | 加入折價卷'),
          ]),
          Api.Request('04 | 🔐 購物車移除品項', 'delete'),
          Api.Request('05 | 🔐 購物車移除所有品項', 'delete'),
        ]),
        Api.Folder('02 | 檢視訂單', [
          Api.Request('01 | 🔐 訂單列表 - 未處理', 'get'),
          Api.Request('02 | 🔐 訂單列表 - 完成', 'get'),
          Api.Request('03 | 🔐 訂單列表 - 取消', 'get'),
          Api.Request('04 | 🔐 檢視訂單', 'get'),
        ]),
        Api.Request('__ | 取得授權碼', 'post'),
        Api.Request('01 | 🔐 成立訂單', 'post', [
          Api.Sample('01 | 信用卡付款「不儲存」，二聯 - 會員載具'),
          Api.Sample('02 | 信用卡付款「不儲存」，二聯 - 紙本證明聯'),
          Api.Sample('03 | 信用卡付款「不儲存」，三聯 - 地址'),
          Api.Sample('04 | 信用卡付款「不儲存」，三聯 - E-Mail'),
          Api.Sample('05 | 信用卡付款「不儲存」，二聯 - 手機條碼'),
          Api.Sample('06 | 信用卡付款「儲存」，二聯 - 會員載具'),
          Api.Sample('07 | 信用卡付款「儲存」，二聯 - 紙本證明聯'),
          Api.Sample('08 | 信用卡付款「儲存」款，三聯 - 地址'),
          Api.Sample('09 | 信用卡付款「儲存」，三聯 - E-Mail'),
          Api.Sample('10 | 信用卡付款「儲存」，二聯 - 手機條碼'),
          Api.Sample('11 | Card ID 付款，二聯 - 會員載具'),
          Api.Sample('12 | Card ID 付款，二聯 - 紙本證明聯'),
          Api.Sample('13 | Card ID 付款，三聯 - 地址'),
          Api.Sample('14 | Card ID 付款，三聯 - E-Mail'),
          Api.Sample('15 | Card ID 付款，二聯 - 手機條碼'),
          Api.Sample('16 | 信用卡付款「不儲存」，二聯 - 會員載具，分期付款'),
          Api.Sample('17 | 信用卡付款「不儲存」，二聯 - 會員載具，購買人資料「同步」到用戶資料'),
          Api.Sample('18 | 信用卡付款「不儲存」，二聯 - 會員載具，收件人資訊「儲存」'),
        ]),
        Api.Request('02 | 🔐 重新付款', 'post', [
          Api.Sample('01 | 信用卡付款 Prime 付款 - 儲存'),
          Api.Sample('02 | 信用卡付款 Prime 付款 - 不儲存'),
          Api.Sample('03 | 信用卡付款 Card ID 付款'),
          Api.Sample('04 | 分期付款'),

        ]),
        Api.Request('03 | 🔐 取消', 'post'),
        Api.Request('04 | 🔐 退貨', 'post'),
      ]),
      Api.Folder('02 | 線下訂單付款連結', [
        Api.Request('__ | 取得授權碼', 'post'),
        Api.Request('01 | 取得訂單內容', 'get'),
        Api.Request('02 | 信用卡付款', 'post'),
      ]),
    ]),

    Api.Folder('03 | 禮物'),
    Api.Folder('04 | 合約'),
    Api.Folder('05 | 賣場'),
    Api.Folder('06 | 自訂手法'),
    Api.Folder('07 | 手法市集'),
    Api.Folder('08 | 沖煮紀錄'),
    Api.Folder('09 | Device 系列'),
    Api.Folder('10 | 咖啡展 2023'),
    
    Api.Request('01 | 數字手法查詢'),
  ])
]