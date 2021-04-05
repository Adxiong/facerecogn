from bs4 import BeautifulSoup
import requests
from utils.utils import RegText


class GetStartInfoByName():

    @staticmethod
    def getStartInfoByName(startName):
        header = {
            'host': "baike.baidu.com",
            'User-Agent': 'Mozilla/5.0'
        }
        try:
            url = f'https://baike.baidu.com/item/{startName}'
            html = requests.get(url, headers=header)

            initialSoup = BeautifulSoup(html.text, 'lxml')

            basicInfoName = map(lambda x: x.text.replace('\xa0', ''), initialSoup.select('dl.basicInfo-block > dt'))
            basicInfoValue = map(lambda x: RegText(x.text).strip(), initialSoup.select('dl.basicInfo-block > dd'))

            basicInfo = dict(zip(basicInfoName, basicInfoValue))

            if '代表作品' in basicInfo:
                del basicInfo['代表作品']

            del basicInfo['中文名']

            if '主要成就' in basicInfo:
                basicInfo['主要成就'] = list(
                    filter(lambda x: x != '', map(lambda y: RegText(y), basicInfo['主要成就'].split()[0: -1])))

            # 统计占比
            singleMusic = initialSoup.select(
                '.module-musicSingle > div.musicSingle-wrapper.nslog-area.log-set-param > table > tbody.page-wrapper > tr > td:nth-child(1)')
            othersMusic = initialSoup.select(
                '.module-musicOther > div.musicOther-wrapper.nslog-area.log-set-param > table > tbody.page-wrapper > tr > td:nth-child(1)')
            movieAndTv = initialSoup.select('.starMovieAndTvplay > div.viewport > ul > li > ul > li')
            singleList = []
            othersList = []
            movieAndTvList = []

            if len(singleMusic):
                for s in singleMusic:
                    if s.text != '':
                        singleList.append(RegText(s.text))

            if len(othersMusic):
                for o in othersMusic:
                    if o.text != '':
                        othersList.append(RegText(o.text))

            if len(movieAndTv):
                for m in movieAndTv:
                    if m.text != '':
                        movieAndTvList.append(RegText(m.text))

            workstats = [{'name': '个人音乐', 'data': len(singleList)},
                               {'name': '为他人创作', 'data': len(othersList)},
                               {'name': '影视作品', 'data': len(movieAndTvList)}]

            return {"msg":"OK", "info":basicInfo , "workstats":workstats}
        except:
            return {"msg":"ERROR"}