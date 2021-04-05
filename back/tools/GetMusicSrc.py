import re
import requests
from snownlp import SnowNLP

class GetMusicSrc():

    @staticmethod
    def getMusicSrc(startName):
        header = {
            'User-Agent': 'Mozilla/5.0',
            "X-Requested-With": "XMLHttpRequest",
        }

        url = 'https://www.socarchina.com/vipmusic/'

        data = {
            "input": startName,
            "filter": "name",
            "type": "netease",
            "page": 1
        }
        result = requests.post(url, headers=header, data=data).json()
        Result = {
            "musiclist": result["data"],
            "emotionrank":{
                "title":[],
                "point":[]
            }
        }
        if  len(Result["musiclist"]):
            for i in range(len(Result["musiclist"])):
                txt = Result["musiclist"][i]['lrc']
                title = Result["musiclist"][i]['title']

                regEx = re.compile('\[.*\]')
                textList = list(filter(lambda y: y != '', list(map(lambda x: regEx.sub('', x), txt.split()))))

                # 歌词过滤
                words = []

                for i in textList:
                    if ':' in i:
                        continue
                    elif '：' in i:
                        continue
                    elif 'ISRC' in i:
                        continue
                    words.append(i)

                point = 0

                for t in words:
                    s = SnowNLP(t)
                    point += s.sentiments

                Result["emotionrank"]["title"].append(title)
                Result["emotionrank"]["point"].append(round(point / len(words), 3))
            return {"msg":"OK" , "item":Result}
        else:
            return {"msg":"ERROR"}

