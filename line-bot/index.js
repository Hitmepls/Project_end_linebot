const line = require("@line/bot-sdk");
const express = require("express");
const axios = require("axios").default;
const dotenv = require("dotenv");
const app = express();
const env = dotenv.config().parsed;
const lineconfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};

//create client
const client = new line.Client(lineconfig);
app.post("/webhook", line.middleware(lineconfig), async (req, res) => {
  try {
    const events = req.body.events;
    console.log("event=>>>>", events);
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send("OK");
  } catch {
    res.status(500).end();
  }
});
// API
const API = "http://localhost:8080/";

//DICT for define reporter
const dictState = {};
const dictData = {};
const Reporter = {};

function GetReporter() {
  axios
    .get(`${API}reporters`)
    .then((res) => {
      const data = res.data.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        Reporter[element.UserId] = element.ID;
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
    });
}

// Header
const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.ACCESS_TOKEN}`,
  },
};
const RegexDes = /^-d\s/;
const RegexTel = /0[986]\d{8}$/;

//event
const handleEvent = async (event) => {
  // add line-bot

  if (event.message?.text == "วิธีการใช้งาน") {
    const CustomPayload = {
      type: "text",
      text: 'นี้คือวิธีการแจ้งอุบัติเหตุ \n1.พิมพ์คำว่า "แจ้งอุบัติเหตุ" \n2.ส่งข้อความ รายละเอียด"\n3.ส่งรูปอุบัติเหตุ\n4.บอกระดับอุบัติเหตุ\n5.share locations\n6.เบอร์โทรศัพ\nสามารถยกเลิกได้ด้วยการพิมพ์ "ยกเลิก"',
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "แจ้งอุบัติเหตุ",
              text: "แจ้งอุบัติเหตุ",
            },
          },
        ],
      },
    };
    ReplyMessage(event.replyToken, CustomPayload);
  } else if (event?.type === "follow") {
    axios
      .get(
        `https://api.line.me/v2/bot/profile/${event.source.userId}`,
        requestOptions
      )
      .then((res) => res?.data)
      .then((response) => {
        console.log(response);
        axios
          .post(
            `${API}reporters`,
            {
              UserId: response.userId,
              DisplayName: response.displayName,
              PictureUrl: response.pictureUrl,
            },
            GetReporter()
          )
          .catch((err) => {
            console.log(err.response.data);
          });
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  } else if (event.message?.text == "แจ้งอุบัติเหตุ") {
    dictData[event.source.userId] = [];
    dictState[event.source.userId] = 0;
    const CustomPayload = [
      {
        type: "text",
        text: "ระบุรายละเอียดอุบัติเหตุ พิมพ์ -dเว้นวรรคตามด้วยรายละเอียด ตัวอย่าง",
      },
      {
        type: "text",
        text: "-d รถกระบะหลุดโค้งบาดเจ็บ 1 ราย",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "พิมพ์ข้อความ",
                data: "แจ้งอุบัติเหตุ",
                inputOption: "openKeyboard",
                fillInText: "-d",
              },
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "ยกเลิก",
                text: "ยกเลิก",
              },
            },
          ],
        },
      },
    ];
    ReplyMessage(event.replyToken, CustomPayload);
  } else if (
    dictState[event.source.userId] >= 0 &&
    event.message?.text == "ยกเลิก"
  ) {
    delete dictData[event.source.userId];
    delete dictState[event.source.userId];

    const CustomPayload = {
      type: "text",
      text: "การแจ้งของท่านถูกยกเลิกแล้ว",
    };
    ReplyMessage(event.replyToken, CustomPayload);
  } else if (dictState[event.source.userId] == 0) {
    if (RegexDes.test(event.message?.text)) {
      dictState[event.source.userId] = 1;
      dictData[event.source.userId].push(event.message.text.slice(3));
      const CustomPayload = {
        type: "text",
        text: "กรุณาส่งรูปภาพประกอบ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "cameraRoll",
                label: "ส่งรูปภาพ",
              },
            },
            {
              type: "action",
              action: {
                type: "camera",
                label: "เปิดกล้อง",
              },
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "ยกเลิก",
                text: "ยกเลิก",
              },
            },
          ],
        },
      };
      ReplyMessage(event.replyToken, CustomPayload);
    } else if (event.postback?.data != "แจ้งอุบัติเหตุ") {
      const CustomPayload = {
        type: "text",
        text: "ขอรายละเอียดอุบัติเหตุด้วยครับ",
      };
      ReplyMessage(event.replyToken, CustomPayload);
    }
  } else if (dictState[event.source.userId] == 1) {
    if (event.message.type == "image") {
      dictState[event.source.userId] = 2;
      dictData[event.source.userId].push(event.message.id);
      const CustomPayload = {
        type: "text",
        text: "กรุณาระบุระดับของอุบัติเหตุ\n1.อุบัติเหตุที่ไม่สร้างความบาดเจ็บ\n2.อุบัติเหตุที่สร้างความบาดเจ็บเล็กน้อย\n3.อุบัติเหตุที่สร้างความบาดเจ็บรุนแรง เช่น บาดเจ็บสาหัด พิการ หรือเสียชีวิต",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "message",
                label: "ระดับ 1",
                text: "1",
              },
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "ระดับ 2",
                text: "2",
              },
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "ระดับ 3",
                text: "3",
              },
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "ยกเลิก",
                text: "ยกเลิก",
              },
            },
          ],
        },
      };
      ReplyMessage(event.replyToken, CustomPayload);
    } else {
      const CustomPayload = {
        type: "text",
        text: "ขอรายรูปภาพด้วยครับ",
      };
      ReplyMessage(event.replyToken, CustomPayload);
    }
  } else if (dictState[event.source.userId] == 2) {
    if (
      event.message.text == "1" ||
      event.message.text == "2" ||
      event.message.text == "3"
    ) {
      dictState[event.source.userId] = 3;
      dictData[event.source.userId].push(Number(event.message.text));
      const CustomPayload = {
        type: "text",
        text: "share locations ให้ด้วยครับ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "location",
                label: "Location",
              },
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "ยกเลิก",
                text: "ยกเลิก",
              },
            },
          ],
        },
      };
      ReplyMessage(event.replyToken, CustomPayload);
    } else {
      const CustomPayload = {
        type: "text",
        text: "กรุณาระบุระดับของอุบัติเหตุ\n1.อุบัติเหตุที่ไม่สร้างความบาดเจ็บ\n2.อุบัติเหตุที่สร้างความบาดเจ็บเล็กน้อย\n3.อุบัติเหตุที่สร้างความบาดเจ็บรุนแรง เช่น บาดเจ็บสาหัด พิการ หรือเสียชีวิต",
      };
      ReplyMessage(event.replyToken, CustomPayload);
    }
  } else if (dictState[event.source.userId] == 3) {
    if (event.message.type == "location") {
      dictState[event.source.userId] = 4;
      dictData[event.source.userId].push(String(event.message.latitude));
      dictData[event.source.userId].push(String(event.message.longitude));
      const CustomPayload = {
        type: "text",
        text: "ขอเบอร์ติดต่อด้วยครับ",
      };
      ReplyMessage(event.replyToken, CustomPayload);
    } else {
      const CustomPayload = {
        type: "text",
        text: "ช่วย shere location ให้ด้วยครับ",
      };
      ReplyMessage(event.replyToken, CustomPayload);
    }
  } else if (dictState[event.source.userId] == 4) {
    if (RegexTel.test(event.message.text)) {
      dictState[event.source.userId] = -1;
      let date = new Date();
      dictData[event.source.userId].push(date.toISOString());
      dictData[event.source.userId].push(event.message.text);
      dictData[event.source.userId].push(Reporter[event.source.userId]);
      const CustomPayload = [
        {
          type: "text",
          text: "ได้รับข้อมูลอุบัติเหตุแล้ว รอเจ้าหน้าที่ดำเนินการนะครับ",
        },
        {
          type: "text",
          text: `สามารถติดตามอุบัติเหตุที่ เว็บไซต์ http://192.168.0.105:3000`,
        },
      ];

      axios
        .post(`${API}accidents`, {
          Description: dictData[event.source.userId][0],
          ImageID: dictData[event.source.userId][1],
          LevelID: dictData[event.source.userId][2],
          Latitude: dictData[event.source.userId][3],
          Longitude: dictData[event.source.userId][4],
          Time: dictData[event.source.userId][5],
          Contact: dictData[event.source.userId][6],
          ReporterID: dictData[event.source.userId][7],
          ProcessStatusID: 1,
        })
        .then((res) => {
          if (res) {
            ReplyMessage(event.replyToken, CustomPayload);
          }
          delete dictData[event.source.userId];
        })
        .catch((err) => {
          console.log(err.response?.data);
          delete dictData[event.source.userId];
        });
    } else {
      const CustomPayload = {
        type: "text",
        text: "ขอเบอร์ติดต่อด้วยครับ",
      };
      ReplyMessage(event.replyToken, CustomPayload);
    }
  } else if (event.message?.text == "ผลการดำเนินการ") {
    axios
      .get(`${API}accidents/${Reporter[event.source.userId]}`)
      .then((res) => {
        const data = res.data.data;
        const CustomPayload = [];
        CustomPayload.push({
          type: "text",
          text: `ท่านได้แจ้งเหตุการณ์มาทั้งหมด ${data.length} เหตุการณ์`,
        });
        data.map((item, index) => {
          CustomPayload.push({
            type: "text",
            text: `${index + 1}.${item.Description} \nสถานะ:${
              item.ProcessStatus.Name
            }`,
          });
        });
        ReplyMessage(event.replyToken, CustomPayload);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  } else {
    const CustomPayload = {
      type: "text",
      text: "คำสั่งของท่านไม่อยู่ในการทำงาน",
    };
    ReplyMessage(event.replyToken, CustomPayload);
  }
};

function ReplyMessage(event, CustomPayload) {
  return client.replyMessage(event, CustomPayload);
}
const PORT = 4000;
app.listen(PORT, () => {
  GetReporter();
  console.log(`listening on port ${PORT}`);
});
