import requests

class FaceRegonInfo:

    @staticmethod
    def getToken():
        url = 'https://iam.cn-north-4.myhuaweicloud.com/v3/auth/tokens'
        header = {
            "Content-Type": "application/json"
        }
        data = '{ "auth": { "identity": { "methods": [ "password" ], "password": {"user": {"name": "hw27515659", "password": "0417.xyl","domain": {"name": "hw27515659" } } }}, "scope": { "project": { "name": "cn-north-4"  } } } }'
        req = requests.post(url, headers=header, data=data)
        token = req.headers["X-Subject-Token"]
        return token

    @staticmethod
    def getStartName( img_base64):
        token = FaceRegonInfo.getToken()
        url = 'https://image.cn-north-4.myhuaweicloud.com/v1.0/image/celebrity-recognition'
        header = {
            "Content-Type": "application/json",
            "X-Auth-Token": token
        }
        data = '{image:"'+img_base64+'"}'
        req = requests.post(url, headers=header, data=data)
        if len(req.json()["result"]) != 0:
            return {"msg":"OK" , "name" : req.json()["result"][0]["label"]}
        else:
            return {"msg":"ERROR"}

