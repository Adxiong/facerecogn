import re

def RegText(text):
    regEx = re.compile('\[\d{1,3}\].*\\n')
    return regEx.sub('', text)
