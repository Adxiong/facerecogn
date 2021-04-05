from flask import Flask ,request
from tools.FaceRegonInfo import FaceRegonInfo
from tools.GetStartInfoByName import GetStartInfoByName as GetSInfo
from tools.GetPicsByShImage import GetPicsByShImage as Getphotos
from tools.GetMusicSrc import GetMusicSrc as GetMList

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route("/upface" , methods=["POST"])
def getFaceInfo():
    data = {
        "msg":"OK",
        "name":"",
        "info":{}
    }
    image_base64 = request.json["face"]
    result = FaceRegonInfo.getStartName(image_base64)
    if result["msg"] == "OK":
        data["name"] = result["name"]
        info = GetSInfo.getStartInfoByName(data["name"])
        if info["msg"] == "OK":
            data["info"] = info["info"]
            data["workstats"] = info["workstats"]
        else:
            data["msg"] == "未收入此人信息"
    else:
        data["msg"] == "ERROR"
    print(data)
    return data , 200

@app.route("/getphotolist")
def getPhotoList():
    startName = request.args["name"]
    data = Getphotos.getPicsByBdimage(startName)

    return data, 200

@app.route("/getmusiclist")
def getMusicSrc():
    startName = request.args["name"]
    data = GetMList.getMusicSrc(startName)
    print(data)
    return data , 200


if __name__ == '__main__':
    app.run()
