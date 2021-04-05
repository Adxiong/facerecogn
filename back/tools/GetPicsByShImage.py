import requests

class GetPicsByShImage():

    @staticmethod
    def getPicsByBdimage(startName):
        # 从搜狗图库获取歌手照片
        header = {
            'User-Agent': 'Mozilla/5.0',
            'Host': 'pic.sogou.com',
            'Referer': 'https://pic.sogou.com/'
        }
        url = f'https://pic.sogou.com/napi/pc/searchList?mode=1&start=0&xml_len=48&query={startName}'
        html = requests.get(url, headers=header)
        imgJson = html.json()['data']['items']

        photoesList = []
        
        for index in range(len(imgJson)):
            try:
                if requests.get(imgJson[index]['picUrl']).status_code == 200:
                    photoesList.append(dict(key=len(photoesList) + 1, src=imgJson[index]['picUrl']))

                if len(photoesList) == 15:
                    break
            except Exception as e:
                print(e)
        if len(photoesList) != 0:
            return {"msg":"OK" , "photolist": photoesList}
        else:
            return {"msg":"ERROR"}