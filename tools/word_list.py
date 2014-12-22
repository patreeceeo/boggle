import sys
import re
import string

pattern = re.compile('[\W]+') 

print "boggle.masterWordList = {}; boggle.masterWordList.en = ["

for line in sys.stdin:
    word = pattern.sub('', line)
    if len(word) > 2 and not word[0] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        print "  \"%s\"," % pattern.sub('', line)

print "];"

