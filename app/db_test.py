from db import *

for i in range(30):
    add_user("THING " + str(i), "password")

for i in range(29):
    add_friend(0, i)
    add_group(0 ,"Da Best", "image")

